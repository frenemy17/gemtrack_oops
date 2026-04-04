'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ShaderBackground from './ShaderBackground';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Shader */}
            <ShaderBackground />

            {/* Content */}
            <div className="z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-200 bg-blue-900/30 border border-blue-500/30 rounded-full backdrop-blur-sm"
                >
                    ✨ The Ultimate Jewelry Management System
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
                >
                    Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Empire</span> <br />
                    With Precision
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    An elegant, all-in-one platform for jewelry stock management, sales tracking, and barcode integration. Designed for the modern jeweler.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/dashboard/signup">
                        <Button size="lg" className="h-12 px-8 text-base bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20">
                            Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent border-white/20 text-white hover:bg-white/10">
                            Explore Features
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Decorative gradient at bottom to blend into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </section>
    );
}
