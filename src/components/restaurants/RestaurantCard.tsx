import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, UtensilsCrossed, Clock, Check, ArrowRight } from 'lucide-react';
import { Restaurant } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { BookingModal } from '../common/BookingModal';
import { formatCurrency } from '../../utils/formatters';
import { useSavedItems } from '../../hooks/useSavedItems';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isSaved, toggleRestaurant } = useSavedItems();
  const saved = isSaved('restaurant', restaurant.id);
  const [tableBookingOpen, setTableBookingOpen] = useState(false);

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
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={restaurant.image}
            alt={restaurant.name}
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
              toggleRestaurant(restaurant.id);
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
            title={saved ? 'Remove from saved' : 'Save restaurant'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                saved ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>

          {/* Dietary Indicators */}
          <div className="absolute top-3.5 left-3.5 z-10 flex gap-1.5">
            {restaurant.isVegetarian && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
                Pure Veg
              </span>
            )}
            {restaurant.isVeganFriendly && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-600/90 text-white backdrop-blur-md shadow-xs">
                Vegan Options
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-900/70 text-amber-300 backdrop-blur-md border border-white/10">
              {restaurant.priceRange}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="bg-slate-900/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
              <RatingStars rating={restaurant.rating} reviewCount={restaurant.reviewCount} size="sm" />
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{restaurant.openingHours.split('–')[0]}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 mb-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{restaurant.location}</span>
            </div>

            {/* Cuisines */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {restaurant.cuisine.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Specialty Highlights */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-4">
              <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[11px] mb-1">
                Signature Must-Tries:
              </span>
              <p className="line-clamp-1 italic text-slate-500 dark:text-slate-400">
                {restaurant.specialtyDishes.join(', ')}
              </p>
            </div>
          </div>

          {/* Pricing & Reservation CTA */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Approx. for two</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                {formatCurrency(restaurant.approxCostForTwo)}
              </span>
            </div>

            <button
              onClick={() => setTableBookingOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-sky-600 dark:hover:bg-sky-600 transition-colors shadow-xs"
            >
              <span>Reserve Table</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      <BookingModal
        isOpen={tableBookingOpen}
        onClose={() => setTableBookingOpen(false)}
        title={`Table at ${restaurant.name}`}
        subtitle={`${restaurant.location} • ${restaurant.cuisine.join(', ')}`}
        itemType="restaurant"
        pricePerUnit={Math.round(restaurant.approxCostForTwo / 2)}
        unitLabel="per guest"
        image={restaurant.image}
      />
    </>
  );
};
