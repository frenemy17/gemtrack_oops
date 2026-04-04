'use client';

import React, { useState, useEffect } from 'react';
import { items } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Printer, Search, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { BarcodePreviewModal } from '@/components/BarcodePreviewModal';

export default function InventoryPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: 'all', purity: 'all' });
    const router = useRouter();

    useEffect(() => {
        loadItems();
    }, [search, filters]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const filterParams = {};
            if (filters.category !== 'all') filterParams.category = filters.category;
            if (filters.purity !== 'all') filterParams.purity = filters.purity;

            const res = await items.getAll(1, search, filterParams);
            setData(res.data.items || []);
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [itemsToPrint, setItemsToPrint] = useState([]);

    const fetchBarcodeImage = async (sku) => {
        const { default: JsBarcode } = await import('jsbarcode');
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, sku, {
            format: "CODE128",
            width: 2,
            height: 30,
            displayValue: false
        });
        return canvas.toDataURL("image/png");
    };

    const generatePDF = async (items) => {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF();

        let x = 10, y = 20, col = 0;

        pdf.setFontSize(16);
        pdf.text('Barcode Labels', 10, 10);

        for (const item of items) {
            try {
                const barcodeImg = await fetchBarcodeImage(item.sku);

                // Grid Layout: 3 columns
                if (col === 3) {
                    col = 0;
                    y += 45;
                    x = 10;
                }

                // Check for new page
                if (y > 270) {
                    pdf.addPage();
                    y = 20;
                    x = 10;
                    col = 0;
                }

                // Draw Barcode
                pdf.addImage(barcodeImg, 'PNG', x, y, 60, 25);

                // Draw Text
                pdf.setFontSize(10);
                const name = item.name ? (item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name) : 'Unknown Item';
                pdf.text(name, x + 5, y + 30);

                pdf.setFontSize(8);
                pdf.text(`SKU: ${item.sku || 'N/A'}`, x + 5, y + 35);

                const weight = item.netWeight ? `${item.netWeight}g` : '';
                const purity = item.purity ? item.purity : '';
                const details = [weight, purity].filter(Boolean).join(' | ');

                pdf.text(details, x + 5, y + 39);

                x += 70;
                col++;
            } catch (err) {
                console.error(`Failed to generate barcode for ${item.sku}`, err);
            }
        }
        return pdf;
    };

    const handlePrint = async () => {
        try {
            const res = await items.getUnprinted();
            if (res.data.length === 0) {
                toast.info("No New Barcodes", {
                    description: "All items already have printed barcodes."
                });
                return;
            }

            const unprintedItems = res.data;
            setItemsToPrint(unprintedItems);

            // Generate Preview
            const pdf = await generatePDF(unprintedItems);
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setIsPreviewOpen(true);

        } catch (error) {
            console.error("Failed to generate preview", error);
            toast.error("Preview Failed", {
                description: "Failed to generate barcode preview."
            });
        }
    };

    const handleConfirmPrint = async () => {
        try {
            const pdf = await generatePDF(itemsToPrint);
            pdf.save(`barcodes-${new Date().toISOString().split('T')[0]}.pdf`);

            // Mark as printed
            await items.markAsPrinted(itemsToPrint.map(i => i.id));
            loadItems(); // Refresh list
            setIsPreviewOpen(false);

            toast.success("Barcodes Generated", {
                description: `${itemsToPrint.length} barcode labels generated.`
            });
        } catch (error) {
            console.error("Failed to print", error);
            toast.error("Print Failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Barcodes
                    </Button>
                    <Link href="/dashboard/inventory/add">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select
                                value={filters.category}
                                onValueChange={(v) => setFilters({ ...filters, category: v })}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Ring">Ring</SelectItem>
                                    <SelectItem value="Necklace">Necklace</SelectItem>
                                    <SelectItem value="Chain">Chain</SelectItem>
                                    <SelectItem value="Bracelet">Bracelet</SelectItem>
                                    <SelectItem value="Earrings">Earrings</SelectItem>
                                    <SelectItem value="Bangle">Bangle</SelectItem>
                                    <SelectItem value="Pendant">Pendant</SelectItem>
                                    <SelectItem value="Anklet">Anklet</SelectItem>
                                    <SelectItem value="Mangalsutra">Mangalsutra</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.purity}
                                onValueChange={(v) => setFilters({ ...filters, purity: v })}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Purity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Purity</SelectItem>
                                    <SelectItem value="22K">22K</SelectItem>
                                    <SelectItem value="18K">18K</SelectItem>
                                    <SelectItem value="14K">14K</SelectItem>
                                    <SelectItem value="24K">24K</SelectItem>
                                    <SelectItem value="916">916</SelectItem>
                                    <SelectItem value="750">750</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="ghost" size="icon" onClick={loadItems}>
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Purity</TableHead>
                                    <TableHead className="text-right">Weight (g)</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No items found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">💎</span>
                                                    {item.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.purity}</TableCell>
                                            <TableCell className="text-right">{item.netWeight}</TableCell>
                                            <TableCell className="text-right">₹{item.price?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                {item.isSold ? (
                                                    <div className="flex flex-col">
                                                        <Badge variant="destructive" className="w-fit">Sold</Badge>
                                                        {item.saleItems?.[0]?.sale?.customer?.name && (
                                                            <span className="text-xs text-muted-foreground mt-1">
                                                                to {item.saleItems[0].sale.customer.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <BarcodePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                pdfUrl={previewUrl}
                onPrint={handleConfirmPrint}
            />
        </div>
    );
}
