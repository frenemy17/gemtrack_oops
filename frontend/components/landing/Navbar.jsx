'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-transparent border-b border-white/10"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400" />
                <span className="text-xl font-bold tracking-tight text-white">GemTrack</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                {['Features', 'Solutions', 'Pricing', 'About'].map((item) => (
                    <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {item}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Link href="/dashboard/login">
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                        Log In
                    </Button>
                </Link>
                <Link href="/dashboard/signup">
                    <Button className="bg-white text-slate-900 hover:bg-slate-200">
                        Get Started
                    </Button>
                </Link>
            </div>
        </motion.nav>
    );
}
