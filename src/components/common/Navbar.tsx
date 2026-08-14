import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  Hotel,
  Utensils,
  Search,
  Heart,
  User,
  Menu,
  X,
  CalendarDays,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useSavedItems } from '../../hooks/useSavedItems';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { totalSavedCount } = useSavedItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/' },
    { name: 'Plan Trip', path: '/planner', highlight: true },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Activities', path: '/activities' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/destinations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm py-3'
            : 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Aetheria
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20">
                  AI Travel
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block tracking-wide">
                Intelligent Journeys
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    link.highlight
                      ? 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center gap-1.5'
                      : isActive
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />}
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              id="global-search-btn"
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Search Destinations, Hotels & Stays"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved Items Heart */}
            <Link
              to="/dashboard?tab=saved"
              id="nav-saved-btn"
              className="relative p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
              title="View Saved Trips and Stays"
              aria-label="Favorites"
            >
              <Heart className={`w-5 h-5 ${totalSavedCount > 0 ? 'text-rose-500 fill-rose-500/20' : ''}`} />
              {totalSavedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {totalSavedCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile CTA / Dashboard */}
            <Link
              to="/dashboard"
              id="nav-profile-btn"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                alt="Madhiyarasu"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500/30"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 hidden sm:inline-block">
                Madhiyarasu
              </span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3">
              <Link
                to="/planner"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold text-sm shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Plan My Trip
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            <nav className="space-y-1 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSearchModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-5">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Ooty, Kerala, tea plantations, boutique stays..."
                className="flex-1 text-base bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Ooty', 'Kerala Backwaters', 'Leh Ladakh', 'Savoy Hotel', 'Tea Estates', 'Alleppey Cruise'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setSearchModalOpen(false);
                      navigate(`/destinations?search=${encodeURIComponent(term)}`);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
