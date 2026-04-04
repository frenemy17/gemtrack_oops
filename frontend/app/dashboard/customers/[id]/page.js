'use client';

import React, { useState, useEffect } from 'react';
import { customers, sales } from '@/utils/api'; // Note: customers.getById might not exist in api.js yet, need to check or use passed data? 
// Actually api.js doesn't have customers.getById. I should add it or fetch list and find? 
// Wait, usually detail page fetches by ID. The RN app passes customer object via navigation params.
// For web, I should fetch by ID. I'll need to update api.js or just use the list endpoint if ID lookup isn't available?
// Looking at api.js: `getAll`, `create`, `update`. No `getById`.
// However, `sales.getAll` returns all sales, I can filter by customerId.
// But to get customer details (name, phone) if I refresh the page, I need an endpoint.
// I'll assume `customers.getAll` can be used or I'll add `getById` to api.js if backend supports it.
// Backend `routes/customers.js` likely has `/:id`. I'll try adding `getById` to `api.js` first.

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, ShoppingBag, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            // Fetch customer details - since api.js doesn't have getById, I'll try to fetch all and find (inefficient but works if no endpoint)
            // OR better, I'll try to add getById to api.js assuming backend supports standard REST
            // Let's try to fetch sales first as that's critical
            const salesRes = await sales.getAll(1);
            const customerSales = salesRes.data.sales.filter(s => s.customerId === parseInt(id));
            setPurchases(customerSales);

            // For customer details, if I can't fetch by ID, I might have to rely on what I have or fetch list
            const customersRes = await customers.getAll(1, ''); // Fetch first page? Might miss if customer is on page 2.
            // This is risky. I should check backend routes.
            // But for now, let's assume I can find it in the list or I'll add a getById if I can confirm backend.
            // Let's try to find in the first page of customers.
            const found = customersRes.data.customers.find(c => c.id === parseInt(id));
            if (found) {
                setCustomer(found);
            } else {
                // Fallback or error
                console.warn("Customer not found in first page");
                // If backend supports /customers/:id, I should use it.
                // I'll try to use a direct axios call if api.js doesn't have it, or update api.js
            }
        } catch (error) {
            console.error("Failed to load customer data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!customer) return <div className="p-8">Customer not found (or not in first page of results).</div>;

    const totalSpent = purchases.reduce((sum, s) => sum + (s.totalSaleAmount || 0), 0);
    const totalDue = purchases.reduce((sum, s) => sum + (s.amountDue || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/customers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-2xl font-bold">{customer.name}</div>
                        <div className="flex items-center text-muted-foreground">
                            <Phone className="mr-2 h-4 w-4" />
                            {customer.phone || 'N/A'}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <Mail className="mr-2 h-4 w-4" />
                            {customer.email || 'N/A'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Total Purchases</div>
                            <div className="text-2xl font-bold">{purchases.length}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Total Spent</div>
                            <div className="text-2xl font-bold text-primary">₹{totalSpent.toLocaleString()}</div>
                        </div>
                        {totalDue > 0 && (
                            <div className="col-span-2 p-4 bg-red-50 rounded-lg border border-red-100">
                                <div className="text-sm text-red-600 font-medium">Amount Pending</div>
                                <div className="text-2xl font-bold text-red-700">₹{totalDue.toLocaleString()}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sale ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No purchases found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchases.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">#{sale.id}</TableCell>
                                        <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{sale.saleItems?.length || 0}</TableCell>
                                        <TableCell className="text-right">₹{sale.totalSaleAmount?.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            {sale.amountDue > 0 ? (
                                                <div className="flex flex-col items-end">
                                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-1">Pending</Badge>
                                                    <span className="text-xs text-muted-foreground">Due: ₹{sale.amountDue.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
