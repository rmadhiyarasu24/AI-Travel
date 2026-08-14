import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Destination } from '../types';
import { destinationService } from '../services/destinationService';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Filter, Compass, MapPin, SlidersHorizontal } from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialRegion = searchParams.get('region') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'budget_asc' | 'budget_desc'>('rating');

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const data = await destinationService.getAllDestinations();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const regions = ['All', 'South India', 'North India', 'West India', 'Himalayas'];
  const climates = ['All', 'Cool / Hill Station', 'Tropical / Coastal', 'Warm & Sunny', 'Cold / Mountain Desert'];

  const filtered = destinations.filter((dest) => {
    const matchesSearch =
      searchQuery === '' ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.stateOrCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion =
      selectedRegion === 'All' || dest.region.toLowerCase() === selectedRegion.toLowerCase();

    const matchesClimate =
      selectedClimate === 'All' || dest.climate.toLowerCase().includes(selectedClimate.toLowerCase());

    return matchesSearch && matchesRegion && matchesClimate;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'budget_asc') return a.startingBudget - b.startingBudget;
    if (sortBy === 'budget_desc') return b.startingBudget - a.startingBudget;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Curated Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Global Destinations & Escapes
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Explore heritage hill stations, serene coastal backwaters, high-altitude mountain valleys, and cultural landmarks.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, state, or tag..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Region select */}
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    Region: {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Climate select */}
            <div>
              <select
                value={selectedClimate}
                onChange={(e) => setSelectedClimate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {climates.map((c) => (
                  <option key={c} value={c}>
                    Climate: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="rating">Sort: Top Rated</option>
                <option value="budget_asc">Sort: Budget (Low to High)</option>
                <option value="budget_desc">Sort: Budget (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Destination Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} />
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching destinations found"
            description="Try adjusting your keyword search or changing the region/climate filters."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedRegion('All');
              setSelectedClimate('All');
            }}
          />
        )}
      </div>
    </div>
  );
};
