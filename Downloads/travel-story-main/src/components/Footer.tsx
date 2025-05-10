import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-heading font-bold">TravelStory</h3>
            <p className="text-gray-300 mt-2">Create beautiful travel memories</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TravelStory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;