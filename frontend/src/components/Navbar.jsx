import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              StartupIQ
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/heatmap">Market Heatmap</NavLink>
              <NavLink to="/ideas">Idea Generator</NavLink>
              <NavLink to="/analyzer">Analyzer</NavLink>
              <NavLink to="/talent">Talent Match</NavLink>
            </div>
          </div>

          {/* Login/Signup Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-300 hover:text-white font-medium transition-colors">Log In</button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
              Sign Up
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

// Helper component for cleaner links
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
  >
    {children}
  </Link>
);

export default Navbar;