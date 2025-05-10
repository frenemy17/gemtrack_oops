import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="backdrop-blur-md bg-[#0f0f0f]/70 shadow-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-white no-underline hover:opacity-80 transition">
          <MapPin size={26} className="text-white/80" />
          <span className="font-bold text-xl tracking-tight">TravelStory</span>
        </Link>
        <div className="flex gap-3 items-center">
          <Link
            to="/canvas"
            className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition duration-200"
          >
            Create Story
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
