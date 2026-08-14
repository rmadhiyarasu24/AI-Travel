import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Wifi, Sparkles, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { Hotel } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { BookingModal } from '../common/BookingModal';
import { formatCurrency } from '../../utils/formatters';
import { useSavedItems } from '../../hooks/useSavedItems';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { isSaved, toggleHotel } = useSavedItems();
  const saved = isSaved('hotel', hotel.id);
  const [bookingOpen, setBookingOpen] = useState(false);

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
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={hotel.image}
            alt={hotel.name}
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
              toggleHotel(hotel.id);
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
            title={saved ? 'Remove from saved' : 'Save hotel'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                saved ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>

          {/* Category / Eco Tag */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5">
            <Badge variant="primary" size="sm" className="bg-slate-900/70 text-white border-white/20 backdrop-blur-md">
              {hotel.category}
            </Badge>
            {hotel.sustainableBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/80 text-white backdrop-blur-md shadow-xs">
                <Leaf className="w-3 h-3" /> Eco Stay
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <RatingStars rating={hotel.rating} reviewCount={hotel.reviewCount} size="sm" />
            </div>
            {hotel.featuredTag && (
              <span className="text-xs font-bold text-amber-300 bg-amber-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {hotel.featuredTag}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 mb-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{hotel.location}</span>
            </div>

            {/* Amenities Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                {formatCurrency(hotel.pricePerNight)}
              </span>
              <span className="text-[11px] text-slate-400"> / night</span>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 transition-all shadow-sm"
            >
              <span>View & Reserve</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={hotel.name}
        subtitle={`${hotel.location} • ${hotel.category}`}
        itemType="hotel"
        pricePerUnit={hotel.pricePerNight}
        unitLabel="per night"
        image={hotel.image}
      />
    </>
  );
};
