import React, { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurantService';
import { RestaurantCard } from '../components/restaurants/RestaurantCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Utensils, Search, Sparkles, Coffee } from 'lucide-react';

export const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'cost_asc' | 'cost_desc'>('rating');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const cuisines = [
    'All',
    'South Indian / Chettinad',
    'Continental & Bakery',
    'Tibetan & Ladakhi',
    'Traditional Coastal Kerala',
    'Royal Rajasthani',
    'Kodava Traditional',
    'Goan Portuguese Seafood'
  ];

  const destinations = ['All', 'Ooty', 'Kerala', 'Leh Ladakh', 'Jaipur', 'Coorg', 'Goa'];

  const filtered = restaurants.filter((rest) => {
    const matchesSearch =
      searchQuery === '' ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCuisine =
      selectedCuisine === 'All' || rest.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());

    const matchesDestination =
      selectedDestination === 'All' || rest.destinationName.toLowerCase() === selectedDestination.toLowerCase();

    const matchesVeg = !onlyVeg || rest.vegetarianOnly || rest.dietaryOptions.includes('Pure Veg') || rest.dietaryOptions.includes('Vegetarian');

    return matchesSearch && matchesCuisine && matchesDestination && matchesVeg;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'cost_asc') return a.costForTwo - b.costForTwo;
    if (sortBy === 'cost_desc') return b.costForTwo - a.costForTwo;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Utensils className="w-4 h-4" />
            <span>Epicurean Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Authentic Dining & Cafes
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Explore heritage bakeries, high-altitude mountain cafes, coastal seafood shacks, and authentic spice-rich culinary havens.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant or dish..."
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
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    Cuisine: {c}
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
                <option value="cost_asc">Cost: Low to High</option>
                <option value="cost_desc">Cost: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyVeg}
                onChange={(e) => setOnlyVeg(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Vegetarian / Pure Veg Friendly Only</span>
            </label>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={6} />
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sorted.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching dining spots found"
            description="Try relaxing your filters or searching for another regional favorite."
            actionLabel="Reset Dining Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedDestination('All');
              setSelectedCuisine('All');
              setOnlyVeg(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
