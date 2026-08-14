import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Route,
  CloudSun,
  Hotel,
  UtensilsCrossed,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Autonomous AI Trip Synthesis',
      description: 'Generates day-by-day itineraries with checkpoint coordinates, timing, travel duration, and tips optimized to your pace.',
      badge: 'Core Intelligence',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: Route,
      title: 'Waypoint Distance Optimization',
      description: 'Intelligent sequencing eliminates back-and-forth travel between sights, saving up to 40% in daily road transit time.',
      badge: 'Routing Engine',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: CloudSun,
      title: 'Real-Time Climate & Packing Guidance',
      description: 'Dynamic precipitation probability, high/low forecasts, and packing recommendations calibrated to destination elevation.',
      badge: 'Weather Sync',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Hotel,
      title: 'Eco-Certified & Heritage Stays',
      description: 'Curated boutique tea estates, colonial bungalows, and backwater houseboats with verified traveler amenities.',
      badge: 'Curated Stays',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: UtensilsCrossed,
      title: 'Regional Gastronomy Trails',
      description: 'Find authentic local delicacies, pure vegetarian specialties, and historic dining spots recommended by residents.',
      badge: 'Food Trails',
      color: 'from-rose-500 to-pink-600'
    },
    {
      icon: ShieldCheck,
      title: 'FastAPI Microservice Ready',
      description: 'Built with rigorous TypeScript contracts, decoupled service models, and ready for Python FastAPI ML inference deployment.',
      badge: 'Modern Architecture',
      color: 'from-blue-600 to-cyan-600'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            Why Aetheria
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Engineered for Effortless Travel
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Moving beyond generic chatbot replies to formulate full interactive itineraries with live maps, real hotels, and budget transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700/60 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Banner CTA */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-400">
                Ready to explore?
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                Generate Your Personalized Itinerary in 10 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Choose your destination, dates, budget and let Aetheria organize every stop, hotel, meal, and waypoint.
              </p>
            </div>

            <Link
              to="/planner"
              className="shrink-0 px-8 py-4 rounded-2xl font-heading font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl hover:shadow-sky-500/25 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Trip Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
