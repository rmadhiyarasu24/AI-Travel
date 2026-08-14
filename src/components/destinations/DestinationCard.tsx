import React from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Destination } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useSavedItems } from '../../hooks/useSavedItems';

interface DestinationCardProps {
  destination: Destination;
  featured?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  featured = false
}) => {
  const { isSaved, toggleDestination } = useSavedItems();
  const saved = isSaved('destination', destination.id);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image Container with Zoom */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDestination(destination.id);
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
          title={saved ? 'Remove from saved' : 'Save destination'}
          aria-label="Bookmark destination"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'text-rose-500 fill-rose-500' : ''
            }`}
          />
        </button>

        {/* Climate / Region Pill */}
        <div className="absolute top-3.5 left-3.5 z-10 flex gap-1.5">
          <Badge variant="primary" size="sm" className="bg-slate-900/70 text-white border-white/20 backdrop-blur-md">
            {destination.region}
          </Badge>
        </div>

        {/* Bottom Image Overlay Info */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Best: {destination.bestTimeToVisit}</span>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <RatingStars rating={destination.rating} reviewCount={destination.reviewCount} size="sm" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
              {destination.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{destination.stateOrCountry}</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>

          {/* Activity Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {destination.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Starting from</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
              {formatCurrency(destination.startingBudget)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/planner?destination=${encodeURIComponent(destination.name)}`)}
              className="p-2 rounded-xl text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
              title="Plan trip with AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <Link
              to={`/destinations/${destination.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-sky-600 dark:hover:bg-sky-600 transition-colors shadow-xs"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
