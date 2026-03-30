import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, Sun, Moon, Globe, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t, languageNames, availableLanguages } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/analyze', label: t('nav.ideaAnalyzer') },
    { to: '/generate', label: t('nav.ideaGen') },
    { to: '/talent', label: t('nav.talentScout') },
    { to: '/market', label: t('nav.marketTrends') },
    { to: '/competitors', label: t('nav.competitors') },
    { to: '/canvas', label: t('nav.canvas') },
  ];

  return (
    <>
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

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <div className="ml-6 flex items-baseline space-x-1">
                {navLinks.map(link => (
                  <NavLink key={link.to} to={link.to} current={location.pathname}>{link.label}</NavLink>
                ))}
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Selector */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase font-medium">{language}</span>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-fade-in-down z-50">
                    {availableLanguages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => { changeLanguage(lang); setLangDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${language === lang ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                      >
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg shadow-blue-500/25">
                    {t('nav.signup')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-400 hover:text-white transition-all">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={closeMobile}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#0f172a] border-r border-gray-800 z-50 transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            🚀 StartupIQ
          </span>
          <button onClick={closeMobile} className="p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-800 pt-3 mt-3">
            {/* Language Selector in Mobile */}
            <div className="px-4 py-2">
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Language</p>
              <div className="flex gap-2">
                {availableLanguages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === lang ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-3 mt-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 text-gray-300">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <Link to="/login" onClick={closeMobile} className="block w-full text-center py-2.5 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 hover:bg-gray-800 transition-all">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" onClick={closeMobile} className="block w-full text-center py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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