'use client';

import React, { useState, useEffect } from 'react';
import { shop, market } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Loader2, Save, CheckCircle, XCircle } from 'lucide-react';

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        shopName: '',
        address: '',
        phone: '',
        gstin: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [apiStatus, setApiStatus] = useState(null); // 'success', 'error', or null
    const [apiMessage, setApiMessage] = useState('');
    const [testingApi, setTestingApi] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await shop.getProfile();
            if (res.data) {
                setProfile(res.data);
            }
        } catch (error) {
            console.error("Failed to load shop profile", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await shop.updateProfile(profile);
            toast.success("Settings Saved", {
                description: "Your shop profile has been updated."
            });
        } catch (error) {
            console.error("Failed to save profile", error);
            toast.error("Save Failed", {
                description: "Could not update shop profile."
            });
        } finally {
            setSaving(false);
        }
    };

    const testGoldApi = async () => {
        setTestingApi(true);
        setApiStatus(null);
        setApiMessage('');
        try {
            const res = await market.getRates();
            if (res.data && res.data.rates) {
                setApiStatus('success');
                setApiMessage(`Success! Gold 24K: ₹${res.data.rates.gold_24k_10gm}`);
                toast.success("GoldAPI Connected");
            } else {
                setApiStatus('error');
                // Show the actual error message from backend if available
                const msg = res.data?.message || "Failed to fetch rates. Check API Key or Quota.";
                const details = res.data?.details ? ` (${res.data.details})` : '';
                setApiMessage(msg + details);
                toast.error("GoldAPI Connection Failed", {
                    description: msg
                });
            }
        } catch (error) {
            setApiStatus('error');
            setApiMessage("Network or Server Error.");
            toast.error("Connection Error");
        } finally {
            setTestingApi(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your shop details and integrations.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Shop Profile</CardTitle>
                    <CardDescription>These details will appear on your printed bills.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="shopName">Shop Name</Label>
                        <Input
                            id="shopName"
                            value={profile.shopName}
                            onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                            placeholder="e.g. Royal Jewelers"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={profile.address || ''}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            placeholder="Shop No, Street, City"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={profile.phone || ''}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gstin">GSTIN</Label>
                            <Input
                                id="gstin"
                                value={profile.gstin || ''}
                                onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                                placeholder="22AAAAA0000A1Z5"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>Manage external services like GoldAPI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                            <div className="font-medium">GoldAPI Connection</div>
                            <div className="text-sm text-muted-foreground">
                                Test if your API key is working correctly.
                            </div>
                            {apiStatus && (
                                <div className={`text-sm font-medium flex items-center mt-2 ${apiStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {apiStatus === 'success' ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                                    {apiMessage}
                                </div>
                            )}
                        </div>
                        <Button variant="outline" onClick={testGoldApi} disabled={testingApi}>
                            {testingApi && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Test Connection
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
