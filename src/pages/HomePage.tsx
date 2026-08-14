import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { DestinationDiscoverySection } from '../components/home/DestinationDiscoverySection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { hotelService } from '../services/hotelService';
import { activityService } from '../services/activityService';
import { Hotel, Activity } from '../types';
import { HotelCard } from '../components/hotels/HotelCard';
import { ActivityCard } from '../components/activities/ActivityCard';
import { Sparkles, ArrowRight, Hotel as HotelIcon, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const [hotels, activities] = await Promise.all([
          hotelService.getAllHotels(),
          activityService.getAllActivities()
        ]);
        setFeaturedHotels(hotels.slice(0, 3));
        setFeaturedActivities(activities.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* 1. Hero with Floating Search */}
      <HeroSection />

      {/* 2. Destination Discovery Grid */}
      <DestinationDiscoverySection />

      {/* 3. Featured Stays Preview */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                <HotelIcon className="w-4 h-4" />
                <span>Boutique & Heritage Stays</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                Handpicked Accommodations
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Colonial bungalows, plantation estates, luxury houseboats, and cliffside eco-resorts.
              </p>
            </div>

            <Link
              to="/hotels"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 self-start sm:self-auto group"
            >
              <span>Explore All Stays</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curated Experiences / Activities */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                <Compass className="w-4 h-4" />
                <span>Immersive Experiences</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                Activities & Local Adventures
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Tea tasting workshops, sunset cruises, mountain trails, and cultural shows.
              </p>
            </div>

            <Link
              to="/activities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 self-start sm:self-auto group"
            >
              <span>View All Experiences</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredActivities.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Grid & Architecture */}
      <FeaturesSection />
    </div>
  );
};
