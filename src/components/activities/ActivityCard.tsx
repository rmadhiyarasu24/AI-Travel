import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Clock,
  CheckCircle2,
  Mountain,
  Compass,
  Waves,
  Utensils,
  Bike,
  Theater,
  ArrowRight
} from 'lucide-react';
import { Activity } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { BookingModal } from '../common/BookingModal';
import { formatCurrency } from '../../utils/formatters';
import { useSavedItems } from '../../hooks/useSavedItems';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { isSaved, toggleActivity } = useSavedItems();
  const saved = isSaved('activity', activity.id);
  const [bookingOpen, setBookingOpen] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Trekking':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'Water Sports':
        return <Waves className="w-3.5 h-3.5" />;
      case 'Food Experiences':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'Cultural Experiences':
        return <Theater className="w-3.5 h-3.5" />;
      default:
        return <Compass className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25 }}
        className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      >
        {/* Image Container */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleActivity(activity.id);
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
            title={saved ? 'Remove from saved' : 'Save activity'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                saved ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>

          {/* Category Tag */}
          <div className="absolute top-3.5 left-3.5 z-10 flex gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/70 text-white backdrop-blur-md border border-white/20">
              {getCategoryIcon(activity.category)}
              {activity.category}
            </span>
            {activity.difficulty && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-950/70 text-sky-200 backdrop-blur-md border border-sky-400/20">
                {activity.difficulty}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="bg-slate-900/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
              <RatingStars rating={activity.rating} reviewCount={activity.reviewCount} size="sm" />
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{activity.duration}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 mb-1">
              {activity.title}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-3">
              {activity.destinationName}
            </span>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
              {activity.description}
            </p>

            {/* Inclusions */}
            <div className="space-y-1.5 mb-4">
              {activity.includes.slice(0, 2).map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="line-clamp-1">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                {formatCurrency(activity.pricePerPerson)}
              </span>
              <span className="text-[11px] text-slate-400"> / person</span>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 transition-all shadow-sm"
            >
              <span>Book Experience</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={activity.title}
        subtitle={`${activity.destinationName} • Duration: ${activity.duration}`}
        itemType="activity"
        pricePerUnit={activity.pricePerPerson}
        unitLabel="per person"
        image={activity.image}
      />
    </>
  );
};
