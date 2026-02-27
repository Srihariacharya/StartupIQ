import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation(); // To check active route
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl animate-pulse">🚀</span>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-80 transition-opacity">
              Idea Generator
            </Link>
          </div>

          {/* Desktop Menu - UPDATED LINKS */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <NavLink to="/" current={location.pathname}>Home</NavLink>
              <NavLink to="/analyze" current={location.pathname}>Idea Analyzer</NavLink>
              <NavLink to="/generate" current={location.pathname}>Idea Gen</NavLink>
              {/*<NavLink to="/valuation" current={location.pathname}>Valuation</NavLink>*/}
              <NavLink to="/talent" current={location.pathname}>Talent Scout</NavLink>
              <NavLink to="/market" current={location.pathname}>Market Trends</NavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg shadow-blue-500/25">
                  Sign Up
                </Link>
              </>
            )}
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
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
        : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;