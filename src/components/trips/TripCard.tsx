import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, MapPin, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TripPlan } from '../../types';
import { formatCurrency, formatDateRange } from '../../utils/formatters';
import { useSavedItems } from '../../hooks/useSavedItems';

interface TripCardProps {
  trip: TripPlan;
  isUpcoming?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, isUpcoming = false }) => {
  const { isSaved, toggleTrip } = useSavedItems();
  const saved = isSaved('trip', trip.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className={`group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border ${
        isUpcoming
          ? 'border-sky-300 dark:border-sky-800 ring-2 ring-sky-500/20'
          : 'border-slate-200/80 dark:border-slate-800'
      } shadow-sm hover:shadow-xl transition-all flex flex-col`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={trip.heroImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Saved Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTrip(trip.id);
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
          title={saved ? 'Remove from saved' : 'Save trip'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {isUpcoming && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-md">
              Upcoming Trip
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold">{trip.destination}</span>
          </div>
          <span className="text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
            {trip.durationDays} Days • {trip.travelers} Guests
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 mb-1.5">
            {trip.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {trip.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {trip.interests.map((interest) => (
              <span
                key={interest}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Est. Budget</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
              {formatCurrency(trip.budget.total)}
            </span>
          </div>

          <Link
            to={`/trips/${trip.id}`}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-sky-600 dark:hover:bg-sky-600 transition-colors shadow-xs"
          >
            <span>View Trip</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
