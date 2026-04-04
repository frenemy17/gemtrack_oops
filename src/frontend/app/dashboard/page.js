'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { dashboard, market } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';

// Classy, minimal color palette
const COLORS = ['#D4AF37', '#C0C0C0', '#A9A9A9', '#2F4F4F', '#8B4513']; // Gold, Silver, Dark Gray, Slate, Bronze

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export default function DashboardPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stats, setStats] = useState(null);
    const [salesStats, setSalesStats] = useState(null);
    const [salesByYear, setSalesByYear] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [piecesByMetal, setPiecesByMetal] = useState([]);
    const [salesOverTime, setSalesOverTime] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [goldRates, setGoldRates] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch internal data first (Fast)
            const results = await Promise.allSettled([
                dashboard.getStats(),
                dashboard.getTotalSalesStats(),
                dashboard.getSalesByYear(),
                dashboard.getSalesByCategory(),
                dashboard.getPiecesByMetal(),
                dashboard.getSalesOverTime(),
                dashboard.getRecentSales()
            ]);

            const [statsRes, salesStatsRes, yearRes, catRes, metalRes, timeRes, recentRes] = results;

            setStats(statsRes.status === 'fulfilled' ? statsRes.value.data : null);
            setSalesStats(salesStatsRes.status === 'fulfilled' ? salesStatsRes.value.data : null);
            setSalesByYear(yearRes.status === 'fulfilled' ? yearRes.value.data : []);
            setSalesByCategory(catRes.status === 'fulfilled' ? catRes.value.data : []);
            setPiecesByMetal(metalRes.status === 'fulfilled' ? metalRes.value.data : []);
            setSalesOverTime(timeRes.status === 'fulfilled' ? timeRes.value.data : []);
            setRecentSales(recentRes.status === 'fulfilled' ? recentRes.value.data : []);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false); // Show dashboard as soon as internal data is ready
        }

        // Fetch external market rates separately (Slow)
        try {
            const ratesRes = await market.getRates();
            setGoldRates(ratesRes.data?.rates || null);
        } catch (error) {
            console.error("Failed to fetch market rates", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-xl font-light tracking-widest uppercase"
                >
                    Loading GemTrack...
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-4 pb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 font-light">Overview of your jewelry business</p>
                </div>
                <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#D4AF37]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Sales</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-[#D4AF37]" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-light">{stats?.totalSales || '0'}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                +2.5% from last month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#C0C0C0]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-[#C0C0C0]" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-light">₹{stats?.totalRevenue?.toLocaleString() || '0'}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#A9A9A9]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inventory</CardTitle>
                            <Package className="h-4 w-4 text-[#A9A9A9]" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-light">{stats?.totalItems || '0'}</div>
                            <p className="text-xs text-muted-foreground mt-1">Items in stock</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#2F4F4F]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Clients</CardTitle>
                            <Users className="h-4 w-4 text-[#2F4F4F]" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-light">{stats?.totalCustomers || '0'}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active customers</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div className="col-span-4" variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="font-light tracking-wide">Revenue Trend</CardTitle>
                            <CardDescription>Monthly revenue performance</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2 p-4 pt-0">
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesOverTime}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDark ? '#1e293b' : 'rgba(255, 255, 255, 0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                color: isDark ? '#f8fafc' : '#000'
                                            }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                        />
                                        <Area type="monotone" dataKey="totalSales" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div className="col-span-3" variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="font-light tracking-wide">Yearly Performance</CardTitle>
                            <CardDescription>Sales comparison by year</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesByYear}>
                                        <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{
                                                backgroundColor: isDark ? '#1e293b' : 'rgba(255, 255, 255, 0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                color: isDark ? '#f8fafc' : '#000'
                                            }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Bar dataKey="totalSales" fill={isDark ? "#D4AF37" : "#2F4F4F"} radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div className="col-span-4" variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="font-light tracking-wide">Category Distribution</CardTitle>
                            <CardDescription>Revenue by product category</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesByCategory} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="category" type="category" width={100} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{
                                                backgroundColor: isDark ? '#1e293b' : 'rgba(255, 255, 255, 0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                color: isDark ? '#f8fafc' : '#000'
                                            }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                        />
                                        <Bar dataKey="totalSales" fill={isDark ? "#C0C0C0" : "#A9A9A9"} radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div className="col-span-3" variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="font-light tracking-wide">Stock Composition</CardTitle>
                            <CardDescription>Items by metal type</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="h-[240px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={piecesByMetal}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="metal"
                                            stroke="none"
                                        >
                                            {piecesByMetal.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDark ? '#1e293b' : 'rgba(255, 255, 255, 0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                color: isDark ? '#f8fafc' : '#000'
                                            }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Sales & Gold Rates Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Sales */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="font-light tracking-wide">Recent Sales</CardTitle>
                            <CardDescription>Latest transactions</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentSales.map((sale) => (
                                        <TableRow key={sale.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium">{sale.customerName}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {new Date(sale.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">₹{sale.amount.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${sale.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    sale.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {sale.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recentSales.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                                No recent sales found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Gold Rates Table */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                            <div>
                                <CardTitle className="font-light tracking-wide">Live Market Rates</CardTitle>
                                <CardDescription>Real-time gold and silver prices</CardDescription>
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                Live
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[200px]">Metal / Purity</TableHead>
                                        <TableHead className="text-right">Rate (per gm)</TableHead>
                                        <TableHead className="text-right">Trend</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {goldRates ? (
                                        <>
                                            <TableRow className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium">Gold 24K (999)</TableCell>
                                                <TableCell className="text-right font-mono text-lg">₹{(parseFloat(goldRates.gold_24k_10gm) / 10).toFixed(2)}</TableCell>
                                                <TableCell className="text-right text-green-600"><ArrowUpRight className="h-4 w-4 inline" /></TableCell>
                                            </TableRow>
                                            <TableRow className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium">Gold 22K (916)</TableCell>
                                                <TableCell className="text-right font-mono text-lg">₹{(parseFloat(goldRates.gold_22k_10gm) / 10).toFixed(2)}</TableCell>
                                                <TableCell className="text-right text-green-600"><ArrowUpRight className="h-4 w-4 inline" /></TableCell>
                                            </TableRow>
                                            <TableRow className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium">Silver (999)</TableCell>
                                                <TableCell className="text-right font-mono text-lg">₹{(parseFloat(goldRates.silver_1kg) / 1000).toFixed(2)}</TableCell>
                                                <TableCell className="text-right text-green-600"><ArrowUpRight className="h-4 w-4 inline" /></TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                                Market rates unavailable
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
