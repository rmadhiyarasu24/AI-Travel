import React, { useState, useEffect } from 'react';
import { Hotel } from '../types';
import { hotelService } from '../services/hotelService';
import { HotelCard } from '../components/hotels/HotelCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Hotel as HotelIcon, Search, Leaf, Star, Sparkles } from 'lucide-react';

export const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [onlyEco, setOnlyEco] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const data = await hotelService.getAllHotels();
        setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const categories = ['All', 'Heritage Luxury', 'Plantation Resort', 'Boutique Bungalow', 'Backwater Luxury', 'Mountain Luxury'];
  const destinations = ['All', 'Ooty', 'Kerala', 'Leh Ladakh', 'Jaipur', 'Coorg'];

  const filtered = hotels.filter((hotel) => {
    const matchesSearch =
      searchQuery === '' ||
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.destinationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || hotel.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDestination =
      selectedDestination === 'All' || hotel.destinationName.toLowerCase() === selectedDestination.toLowerCase();

    const matchesEco = !onlyEco || hotel.sustainableBadge;

    return matchesSearch && matchesCategory && matchesDestination && matchesEco;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price_desc') return b.pricePerNight - a.pricePerNight;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <HotelIcon className="w-4 h-4" />
            <span>Curated Accommodations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Heritage & Boutique Hotels
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            From 19th-century British colonial tea bungalows to cliffside eco-resorts and traditional backwater houseboats.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotel name, location..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    Destination: {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="rating">Sort: Top Rated</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyEco}
                onChange={(e) => setOnlyEco(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Eco-Certified & Sustainable Stays Only</span>
            </label>
          </div>
        </div>

        {/* Hotels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={6} />
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sorted.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching accommodations found"
            description="Try changing your search parameters or removing the eco-certified filter."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedDestination('All');
              setSelectedCategory('All');
              setOnlyEco(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
