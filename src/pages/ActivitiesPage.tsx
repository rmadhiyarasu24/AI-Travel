import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { activityService } from '../services/activityService';
import { ActivityCard } from '../components/activities/ActivityCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Compass, Search, MapPin, Sparkles } from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await activityService.getAllActivities();
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const categories = [
    'All',
    'Nature & Plantations',
    'Heritage & Scenic Railways',
    'Scenic Viewpoints & Lakes',
    'Water & Cruise',
    'Cultural & Performance',
    'Adventure & High Altitude',
    'Spiritual & Monastic'
  ];

  const destinations = ['All', 'Ooty', 'Kerala', 'Leh Ladakh', 'Jaipur', 'Coorg', 'Goa'];

  const filtered = activities.filter((act) => {
    const matchesSearch =
      searchQuery === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || act.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesDestination =
      selectedDestination === 'All' || act.destinationName.toLowerCase() === selectedDestination.toLowerCase();

    return matchesSearch && matchesCategory && matchesDestination;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Experiences & Activities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Tours, Trails & Cultural Journeys
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Book guided mountain railway journeys, traditional tea tasting masterclasses, monastery dawn chants, and backwater kayaking.
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
                placeholder="Search experience or activity..."
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
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={6} />
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sorted.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching experiences found"
            description="Try changing your destination or category selection."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedDestination('All');
              setSelectedCategory('All');
            }}
          />
        )}
      </div>
    </div>
  );
};
