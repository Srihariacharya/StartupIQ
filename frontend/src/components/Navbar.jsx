import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // To check active route

  return (
    <nav className="bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl animate-pulse">🚀</span>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-80 transition-opacity">
              StartupIQ
            </Link>
          </div>

          {/* Desktop Menu - CORRECTED LINKS */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <NavLink to="/" current={location.pathname}>Home</NavLink>
              <NavLink to="/analyze" current={location.pathname}>Feasibility</NavLink>
              <NavLink to="/generate" current={location.pathname}>Idea Gen</NavLink>
              <NavLink to="/talent" current={location.pathname}>Talent Scout</NavLink>
              <NavLink to="/market" current={location.pathname}>Market Trends</NavLink>
              <NavLink to="/brand" current={location.pathname}>Brand Names</NavLink>
            </div>
          </div>

          {/* Login/Signup Buttons (Visual Only) */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-300 hover:text-white font-medium transition-colors text-sm">Log In</button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-sm">
              Sign Up
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

// Helper component with Active State styling
const NavLink = ({ to, children, current }) => {
  const isActive = current === to;
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;