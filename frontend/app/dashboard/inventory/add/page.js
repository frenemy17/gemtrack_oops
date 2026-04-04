'use client';

import React, { useState } from 'react';
import { items } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const PURITY_OPTIONS = ['22K', '18K', '14K', '24K', '916', '750'];
const CATEGORY_OPTIONS = ['Ring', 'Necklace', 'Chain', 'Bracelet', 'Earrings', 'Bangle', 'Pendant', 'Anklet', 'Mangalsutra'];
const METAL_OPTIONS = ['Gold', 'Silver', 'Platinum'];

export default function AddItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', sku: '', huid: '', purity: '', category: '', metal: '',
        grossWeight: '', netWeight: '', makingPerGm: '', wastagePct: '',
        hallmarkingCharges: '', stoneCharges: '', otherCharges: '',
        cgstPct: '', sgstPct: '', cost: '', price: ''
    });
    const [barcodeUrl, setBarcodeUrl] = useState(null);

    const generateSKU = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `SKU${timestamp}${random}`;
    };

    const handleGenerateSKU = () => {
        const sku = generateSKU();
        setForm(prev => ({ ...prev, sku }));
        setBarcodeUrl(`https://barcodeapi.org/api/auto/${encodeURIComponent(sku)}`);
    };

    const handleSkuChange = (e) => {
        const sku = e.target.value;
        setForm(prev => ({ ...prev, sku }));
        if (sku) {
            setBarcodeUrl(`https://barcodeapi.org/api/auto/${encodeURIComponent(sku)}`);
        } else {
            setBarcodeUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) {
            alert('Name and Price are required');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...form, sku: form.sku || generateSKU() };
            await items.create(payload);
            router.push('/dashboard/inventory');
        } catch (error) {
            console.error("Failed to add item", error);
            alert(error.response?.data?.message || 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/inventory">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Add New Item</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Essentials */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Essentials</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="name">Item Name *</Label>
                                <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <div className="flex gap-2">
                                    <Input id="sku" value={form.sku} onChange={handleSkuChange} placeholder="Auto-generated if empty" />
                                    <Button type="button" variant="outline" size="icon" onClick={handleGenerateSKU}>
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="huid">HUID</Label>
                                <Input id="huid" value={form.huid} onChange={e => setForm({ ...form, huid: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label>Metal Type</Label>
                                <Select value={form.metal} onValueChange={v => setForm({ ...form, metal: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Metal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {METAL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Purity</Label>
                                <Select value={form.purity} onValueChange={v => setForm({ ...form, purity: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Purity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PURITY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            {barcodeUrl && (
                                <div className="sm:col-span-2 flex justify-center p-4 border rounded-md bg-white">
                                    <img src={barcodeUrl} alt="Barcode" className="h-20 object-contain" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Measurements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Measurements</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="grossWeight">Gross Weight (g)</Label>
                                <Input id="grossWeight" type="number" step="0.001" value={form.grossWeight} onChange={e => setForm({ ...form, grossWeight: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="netWeight">Net Weight (g)</Label>
                                <Input id="netWeight" type="number" step="0.001" value={form.netWeight} onChange={e => setForm({ ...form, netWeight: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="makingPerGm">Making Charges (Per Gram)</Label>
                                <Input id="makingPerGm" type="number" value={form.makingPerGm} onChange={e => setForm({ ...form, makingPerGm: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wastagePct">Wastage %</Label>
                                <Input id="wastagePct" type="number" step="0.01" value={form.wastagePct} onChange={e => setForm({ ...form, wastagePct: e.target.value })} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charges & Taxes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Charges & Taxes</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="hallmarkingCharges">Hallmarking</Label>
                                <Input id="hallmarkingCharges" type="number" value={form.hallmarkingCharges} onChange={e => setForm({ ...form, hallmarkingCharges: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stoneCharges">Stone Charges</Label>
                                <Input id="stoneCharges" type="number" value={form.stoneCharges} onChange={e => setForm({ ...form, stoneCharges: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="otherCharges">Other Charges</Label>
                                <Input id="otherCharges" type="number" value={form.otherCharges} onChange={e => setForm({ ...form, otherCharges: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cgstPct">CGST %</Label>
                                <Input id="cgstPct" type="number" step="0.01" value={form.cgstPct} onChange={e => setForm({ ...form, cgstPct: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sgstPct">SGST %</Label>
                                <Input id="sgstPct" type="number" step="0.01" value={form.sgstPct} onChange={e => setForm({ ...form, sgstPct: e.target.value })} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost Price</Label>
                                <Input id="cost" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Selling Price *</Label>
                                <Input id="price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/dashboard/inventory">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Item
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
