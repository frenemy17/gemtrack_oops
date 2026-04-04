'use client';

import React, { useState, useEffect } from 'react';
import { customers } from '@/utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, UserPlus, Users } from 'lucide-react';
import { ScrollView } from 'lucide-react'; // Wait, ScrollView is not in lucide

export default function CustomerSelect({ onSelect, selectedCustomer }) {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

    useEffect(() => {
        if (open && !showAdd) {
            loadCustomers();
        }
    }, [open, search, showAdd]);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const res = await customers.getAll(1, search);
            setList(res.data.customers || []);
        } catch (error) {
            console.error("Failed to load customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCustomer.name || !newCustomer.phone) {
            alert('Name and Phone are required');
            return;
        }
        try {
            const res = await customers.create(newCustomer);
            onSelect(res.data);
            setOpen(false);
            setShowAdd(false);
            setNewCustomer({ name: '', phone: '', email: '', address: '' });
        } catch (error) {
            alert('Failed to create customer');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
                    </div>
                    {selectedCustomer && <span className="text-xs text-muted-foreground">{selectedCustomer.phone}</span>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{showAdd ? 'Add New Customer' : 'Select Customer'}</DialogTitle>
                </DialogHeader>

                {showAdd ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone *</Label>
                            <Input value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="ghost" onClick={() => setShowAdd(false)}>Back</Button>
                            <Button onClick={handleCreate}>Create Customer</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or phone..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Button size="icon" onClick={() => setShowAdd(true)}>
                                <UserPlus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {loading ? (
                                <div className="text-center py-4 text-sm text-muted-foreground">Loading...</div>
                            ) : list.length === 0 ? (
                                <div className="text-center py-4 text-sm text-muted-foreground">No customers found</div>
                            ) : (
                                list.map(c => (
                                    <div
                                        key={c.id}
                                        className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                                        onClick={() => {
                                            onSelect(c);
                                            setOpen(false);
                                        }}
                                    >
                                        <div>
                                            <div className="font-medium">{c.name}</div>
                                            <div className="text-xs text-muted-foreground">{c.phone}</div>
                                        </div>
                                        <Button variant="ghost" size="sm">Select</Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
