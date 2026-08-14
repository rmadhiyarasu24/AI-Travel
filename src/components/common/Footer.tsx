import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, MapPin, ShieldCheck, Heart, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                Aetheria
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Next-generation AI travel recommendation & tourist service platform. Formulating intelligent itineraries, discovering authentic stays, and crafting bespoke journeys across the globe.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                AI Model v3.4 Ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                FastAPI Gateway
              </span>
            </div>
          </div>

          {/* Col 1: Discovery */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Explore Destinations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations?region=South India" className="hover:text-white transition-colors">
                  Ooty & Nilgiri Hills
                </Link>
              </li>
              <li>
                <Link to="/destinations?region=South India" className="hover:text-white transition-colors">
                  Kerala & Backwaters
                </Link>
              </li>
              <li>
                <Link to="/destinations?region=North India" className="hover:text-white transition-colors">
                  Leh Ladakh
                </Link>
              </li>
              <li>
                <Link to="/destinations?region=North India" className="hover:text-white transition-colors">
                  Jaipur & Udaipur
                </Link>
              </li>
              <li>
                <Link to="/destinations?region=South India" className="hover:text-white transition-colors">
                  Coorg Coffee Valleys
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Tourist Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/planner" className="hover:text-white transition-colors flex items-center gap-1">
                  AI Trip Generator
                  <Sparkles className="w-3 h-3 text-sky-400" />
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-white transition-colors">
                  Boutique Heritage Hotels
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-white transition-colors">
                  Regional Food Experiences
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition-colors">
                  Curated Outdoor Activities
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Traveler Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Platform Architecture
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400">LLM Reasoning Engine</li>
              <li className="text-slate-400">Real-time Weather & Routes</li>
              <li className="text-slate-400">Adaptive Budget Allocator</li>
              <li className="text-slate-400">Interactive Map Waypoints</li>
              <li className="text-slate-400">FastAPI REST Contract</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Aetheria Travel Intelligence Platform. Built for travelers worldwide.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for global travelers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
