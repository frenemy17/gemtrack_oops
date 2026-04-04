'use client';

import React, { useState, useEffect } from 'react';
import { items, sales, market } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Search, Trash2, ShoppingCart, CreditCard, Banknote, QrCode } from 'lucide-react';
import CustomerSelect from './components/CustomerSelect';
import EditItemDialog from './components/EditItemDialog';
import { Badge } from '@/components/ui/badge';

import BillPreviewDialog from './components/BillPreviewDialog';
import { toast } from "sonner";

export default function POSPage() {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [goldRate, setGoldRate] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [loading, setLoading] = useState(false);

    const [discount, setDiscount] = useState('');

    useEffect(() => {
        fetchGoldRate();
    }, []);

    useEffect(() => {
        if (search.length > 2) {
            searchItems();
        } else {
            setSearchResults([]);
        }
    }, [search]);

    const fetchGoldRate = async () => {
        try {
            const res = await market.getRates();
            // Assuming API returns rate for 10g, we need rate per gram
            const ratePer10g = parseFloat(res.data.rates?.gold_22k_10gm) || 0;
            setGoldRate(ratePer10g / 10);
        } catch (error) {
            console.error("Failed to fetch gold rate", error);
        }
    };

    const searchItems = async () => {
        try {
            const res = await items.getAll(1, search);
            setSearchResults(res.data.items || []);
        } catch (error) {
            console.error("Failed to search items", error);
        }
    };



    const handleItemSelect = (item) => {
        if (item.isSold) {
            toast.error("Item Sold", {
                description: "This item is already sold and cannot be added to the cart."
            });
            return;
        }
        setSelectedItem(item);
        setShowEditDialog(true);
        setSearch('');
        setSearchResults([]);
    };

    const handleAddToCart = (item) => {
        setCart([...cart, item]);
        setSelectedItem(null);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.soldPrice) || 0), 0);
        const discountVal = parseFloat(discount) || 0;
        const taxableAmount = Math.max(0, subtotal - discountVal);

        const cgst = (taxableAmount * 0.015).toFixed(2);
        const sgst = (taxableAmount * 0.015).toFixed(2);
        const total = (taxableAmount + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

        return { subtotal, discount: discountVal, cgst, sgst, total };
    };

    const handlePreview = () => {
        if (!cart.length || !customer) {
            toast.warning("Incomplete Details", {
                description: "Please select a customer and add items to cart."
            });
            return;
        }
        setShowPreviewDialog(true);
    };

    const handleConfirmCheckout = async () => {
        setLoading(true);
        try {
            const { total, discount: discountVal } = calculateTotals();
            const paid = parseFloat(amountPaid) || parseFloat(total);
            const payload = {
                customerId: customer.id,
                paymentMethod,
                items: cart.map(i => ({
                    itemId: i.id,
                    soldPrice: parseFloat(i.soldPrice),
                    soldMakingCharge: i.soldMakingCharge,
                    soldWastage: i.soldWastage,
                    soldHallmarking: i.soldHallmarking,
                    soldStoneCharges: i.soldStoneCharges,
                    soldOtherCharges: i.soldOtherCharges,
                    soldCgstPct: 1.5, // Defaulting as per calculation
                    soldSgstPct: 1.5
                })),
                amountPaid: paid,
                discount: discountVal
            };

            const res = await sales.checkout(payload);

            // Generate Invoice
            const { generateInvoice } = await import('@/utils/pdfGenerator');
            const saleId = res.data.saleId || 'NEW';
            const billNumber = res.data.billNumber;
            const amountDue = (parseFloat(total) - paid).toFixed(2);

            generateInvoice(customer, saleId, cart, paymentMethod, paid, amountDue, discountVal, billNumber);

            toast.success("Sale Completed", {
                description: `Invoice ${billNumber || saleId} generated successfully.`
            });

            setCart([]);
            setCustomer(null);
            setAmountPaid('');
            setDiscount('');
            setShowPreviewDialog(false);
        } catch (error) {
            console.error("Checkout failed", error);
            toast.error("Checkout Failed", {
                description: error.response?.data?.message || 'Something went wrong.'
            });
        } finally {
            setLoading(false);
        }
    };

    const totals = calculateTotals();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Left Column: Item Search & Selection */}
            <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Add Items</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Scan SKU or Search Item..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                                autoFocus
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {searchResults.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors flex justify-between items-center"
                                        onClick={() => handleItemSelect(item)}
                                    >
                                        <div>
                                            <div className="font-bold">{item.name}</div>
                                            <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                                            <div className="text-xs text-muted-foreground">{item.purity} • {item.netWeight}g</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary">₹{item.price?.toLocaleString()}</div>
                                            {item.isSold ? <Badge variant="destructive">Sold</Badge> : <Badge variant="outline">In Stock</Badge>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                <Search className="h-16 w-16 mb-4" />
                                <p>Scan barcode or type to search items</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Cart & Checkout */}
            <div className="lg:col-span-1 flex flex-col h-full">
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Current Sale</span>
                            <Badge variant="secondary">{cart.length} Items</Badge>
                        </CardTitle>
                        <CustomerSelect onSelect={setCustomer} selectedCustomer={customer} />
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">{item.sku}</div>
                                        </TableCell>
                                        <TableCell className="text-right">₹{item.soldPrice?.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeFromCart(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="p-6 bg-muted/20 border-t space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹{totals.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <span className="text-sm">Discount</span>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="w-24 h-8 text-right"
                                />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Tax (3%)</span>
                                <span>₹{(parseFloat(totals.cgst) + parseFloat(totals.sgst)).toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₹{totals.total}</span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Cash', 'Card', 'UPI'].map((m) => (
                                    <Button
                                        key={m}
                                        variant={paymentMethod === m ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setPaymentMethod(m)}
                                        className="w-full"
                                    >
                                        {m === 'Cash' && <Banknote className="mr-2 h-3 w-3" />}
                                        {m === 'Card' && <CreditCard className="mr-2 h-3 w-3" />}
                                        {m === 'UPI' && <QrCode className="mr-2 h-3 w-3" />}
                                        {m}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Amount Paid</Label>
                            <Input
                                type="number"
                                placeholder={`₹${totals.total}`}
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!cart.length || !customer || loading}
                            onClick={handlePreview}
                        >
                            Preview & Checkout
                        </Button>
                    </div>
                </Card>
            </div>

            <EditItemDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                item={selectedItem}
                onConfirm={handleAddToCart}
                goldRate={goldRate}
            />

            <BillPreviewDialog
                open={showPreviewDialog}
                onOpenChange={setShowPreviewDialog}
                customer={customer}
                cart={cart}
                totals={totals}
                paymentDetails={{
                    method: paymentMethod,
                    paid: amountPaid || totals.total,
                    due: (parseFloat(totals.total) - (parseFloat(amountPaid) || parseFloat(totals.total))).toFixed(2)
                }}
                onConfirm={handleConfirmCheckout}
                loading={loading}
            />
        </div>
    );
}
