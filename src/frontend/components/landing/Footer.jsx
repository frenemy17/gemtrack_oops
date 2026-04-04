export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-12 text-slate-400 text-sm">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400" />
                    <span className="text-white font-semibold text-lg">GemTrack</span>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                </div>

                <div className="text-slate-500">
                    © {new Date().getFullYear()} GemTrack. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
