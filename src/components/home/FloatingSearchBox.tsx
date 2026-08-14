import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Coins,
  Sparkles,
  ArrowRight,
  Search
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface FloatingSearchBoxProps {
  initialDestination?: string;
  className?: string;
}

export const FloatingSearchBox: React.FC<FloatingSearchBoxProps> = ({
  initialDestination = '',
  className = ''
}) => {
  const [destination, setDestination] = useState(initialDestination || 'Ooty');
  const [startDate, setStartDate] = useState('2026-09-10');
  const [endDate, setEndDate] = useState('2026-09-14');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(20000);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    { name: 'Ooty', state: 'Tamil Nadu', tag: 'Tea Hills' },
    { name: 'Kerala', state: 'Alleppey & Munnar', tag: 'Backwaters' },
    { name: 'Leh Ladakh', state: 'Ladakh', tag: 'Himalayas' },
    { name: 'Jaipur', state: 'Rajasthan', tag: 'Heritage Forts' },
    { name: 'Coorg', state: 'Karnataka', tag: 'Coffee Country' },
    { name: 'Goa', state: 'Goa Coast', tag: 'Beaches' }
  ];

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      destination,
      startDate,
      endDate,
      travelers: travelers.toString(),
      budget: budget.toString()
    });
    navigate(`/planner?${queryParams.toString()}`);
  };

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto rounded-3xl p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl ${className}`}
    >
      <form onSubmit={handlePlanSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Destination */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              Where to?
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g. Ooty, Kerala..."
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                required
              />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden py-1">
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onMouseDown={() => {
                      setDestination(s.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                      <span className="text-slate-400 ml-1.5">({s.state})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {s.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Travel Dates */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-500" />
              Dates
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-3 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-3 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              Travelers
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full px-3.5 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value={1}>1 Solo Explorer</option>
              <option value={2}>2 Travelers (Couple / Duo)</option>
              <option value={3}>3 Friends / Family</option>
              <option value={4}>4 Travelers (Group)</option>
              <option value={6}>6+ Large Group</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-sky-500" />
                Est. Budget
              </label>
              <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 font-heading">
                {formatCurrency(budget)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
            <span>AI synthesizes routes, heritage stays, local eats & budget automatically</span>
          </div>

          <button
            type="submit"
            id="hero-plan-my-trip-btn"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-heading font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 shadow-xl hover:shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
