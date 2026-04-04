'use client';

import React, { useEffect, useState } from 'react';
import { sales } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SalesPage() {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchSales();
    }, [page]);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await sales.getAll(page);
            setSalesData(res.data.sales);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!salesData.length) return;

        const headers = ['Sale ID', 'Date', 'Customer', 'Items', 'Total Amount', 'Paid', 'Due', 'Status'];
        const csvContent = [
            headers.join(','),
            ...salesData.map(sale => [
                sale.id,
                new Date(sale.createdAt).toLocaleDateString(),
                `"${sale.customer?.name || 'Unknown'}"`,
                `"${sale.saleItems?.map(si => si.item?.name).join(', ') || ''}"`,
                sale.totalSaleAmount,
                sale.amountPaid,
                sale.amountDue,
                sale.paymentStatus
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
                <Button onClick={handleExport} disabled={loading || !salesData.length}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Paid</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesData.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell className="font-medium">#{sale.id}</TableCell>
                                            <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{sale.customer?.name || 'Walk-in'}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {sale.saleItems?.map(si => si.item?.name).join(', ')}
                                            </TableCell>
                                            <TableCell className="text-right">₹{sale.totalSaleAmount?.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">₹{sale.amountPaid?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={sale.paymentStatus === 'PAID' ? 'default' : 'destructive'}>
                                                    {sale.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
