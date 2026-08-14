import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, MapPin, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { FloatingSearchBox } from './FloatingSearchBox';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 pb-20 overflow-hidden">
      {/* Background Hero Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=2200&q=85"
          alt="Scenic Hill Station"
          className="w-full h-full object-cover object-center scale-105 opacity-25 dark:opacity-20 filter saturate-150"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-slate-50/95 to-slate-50 dark:from-slate-950/80 dark:via-slate-950/95 dark:to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto pt-6 sm:pt-12 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
            <span>Introducing Aetheria Travel Intelligence 3.4</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight sm:leading-none"
          >
            Your Journey.{' '}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Planned by Intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Discover world-class destinations, formulate multi-day precision itineraries, and explore handpicked heritage stays and culinary experiences with your personal AI travel companion.
          </motion.p>
        </div>

        {/* Floating Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10"
        >
          <FloatingSearchBox />
        </motion.div>

        {/* Quick Highlights / Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center"
        >
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              100%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Tailored AI Itineraries
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              1,200+
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Verified Stays & Dining
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Live Transit
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Optimized Travel Routes
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              4.9 / 5
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Traveler Satisfaction
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
