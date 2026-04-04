'use client';

import { motion } from 'framer-motion';
import { Barcode, LineChart, Database, Zap, ShieldCheck, Globe } from 'lucide-react';

const features = [
    {
        title: "Real-time Inventory",
        description: "Track every gram of gold and every carat of diamond with precision updates.",
        icon: Database,
        className: "md:col-span-2",
    },
    {
        title: "Smart Analytics",
        description: "Visualize sales trends and customer preferences with interactive charts.",
        icon: LineChart,
        className: "md:col-span-1",
    },
    {
        title: "Barcode Integration",
        description: "Seamlessly scan and tag items for instant retrieval and sales.",
        icon: Barcode,
        className: "md:col-span-1",
    },
    {
        title: "Global Access",
        description: "Manage your diverse store locations from a single dashboard anywhere in the world.",
        icon: Globe,
        className: "md:col-span-2",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Excellence</h2>
                    <p className="text-slate-400 text-lg">
                        Everything you need to run a sophisticated jewelry business, wrapped in a beautiful interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors overflow-hidden ${feature.className}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-slate-400">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
