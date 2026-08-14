import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass, Filter } from 'lucide-react';
import { Destination } from '../../types';
import { destinationService } from '../../services/destinationService';
import { DestinationCard } from '../destinations/DestinationCard';
import { CardSkeleton } from '../common/SkeletonLoader';

export const DestinationDiscoverySection: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const tags = ['All', 'Tea Plantations', 'Backwaters', 'Heritage', 'Himalayas', 'Beaches', 'Coffee Estates'];

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

  const filtered = destinations.filter((dest) => {
    if (selectedTag === 'All') return true;
    return dest.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              <Compass className="w-4 h-4" />
              <span>Trending Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              Explore Handcrafted Getaways
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Curated regions with live seasonal climate analytics, local heritage routes, and smart AI cost estimates.
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 self-start md:self-auto group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            filtered.slice(0, 6).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
