'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditItemDialog({ open, onOpenChange, item, onConfirm, goldRate }) {
    const [editedItem, setEditedItem] = useState(null);

    useEffect(() => {
        if (item) {
            // Calculate initial price based on gold rate if not set
            const rate = item.rate || goldRate || 0;
            const netWeight = parseFloat(item.netWeight) || 0;
            const calculatedPrice = netWeight * rate; // Simplified calculation, real one might include charges

            setEditedItem({
                ...item,
                rate: rate,
                cgstPct: item.cgstPct ?? 1.5,
                sgstPct: item.sgstPct ?? 1.5,
                soldPrice: item.soldPrice || calculatedPrice || item.price || 0
            });
        }
    }, [item, goldRate]);

    const handleSave = () => {
        onConfirm(editedItem);
        onOpenChange(false);
    };

    if (!editedItem) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Item Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Item Name</Label>
                            <Input value={editedItem.name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input value={editedItem.sku} disabled />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Net Weight (g)</Label>
                            <Input
                                type="number"
                                value={editedItem.netWeight ?? ''}
                                onChange={e => {
                                    let weight = parseFloat(e.target.value) || 0;
                                    if (weight < 0) weight = 0; // Prevent negative weight

                                    // Price Formula: (Weight * GoldRate) + Making + Stone + Other
                                    // Note: goldRate passed is per gram
                                    const metalCost = weight * (goldRate || editedItem.rate || 0);
                                    const making = parseFloat(editedItem.makingCharges) || 0; // Assuming making is total, not per gram for simplicity here, or fetch from item
                                    // If making is per gram, it should be weight * makingPerGm

                                    // Let's try to be smart: if item has makingPerGm, use it
                                    const makingCost = (item.makingPerGm ? weight * item.makingPerGm : (item.makingCharges || 0));

                                    const price = metalCost + makingCost + (item.stoneCharges || 0) + (item.otherCharges || 0);
                                    setEditedItem({ ...editedItem, netWeight: weight, soldPrice: price.toFixed(2) });
                                }}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gold Rate (₹/g)</Label>
                            <Input
                                type="number"
                                value={editedItem.rate ?? ''}
                                onChange={e => {
                                    const rate = parseFloat(e.target.value) || 0;
                                    const price = (editedItem.netWeight || 0) * rate;
                                    setEditedItem({ ...editedItem, rate, soldPrice: price });
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Making/g</Label>
                            <Input
                                type="number"
                                value={editedItem.makingPerGm ?? ''}
                                onChange={e => setEditedItem({ ...editedItem, makingPerGm: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Wastage %</Label>
                            <Input
                                type="number"
                                value={editedItem.wastagePct ?? ''}
                                onChange={e => setEditedItem({ ...editedItem, wastagePct: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Other Charges</Label>
                            <Input
                                type="number"
                                value={editedItem.otherCharges ?? ''}
                                onChange={e => setEditedItem({ ...editedItem, otherCharges: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-lg font-bold">Final Sold Price (₹)</Label>
                        <Input
                            type="number"
                            className="text-lg font-bold"
                            value={editedItem.soldPrice ?? ''}
                            onChange={e => setEditedItem({ ...editedItem, soldPrice: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Add to Cart</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
