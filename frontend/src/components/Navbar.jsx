import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-500">StartupIQ 🚀</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/heatmap" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Market Heatmap</Link>
                <Link to="/ideas" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Idea Generator</Link>
                <Link to="/analyzer" className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Analyzer</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;