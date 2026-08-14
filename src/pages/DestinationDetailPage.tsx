import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin,
  Calendar,
  Sparkles,
  CloudSun,
  Coins,
  Heart,
  ArrowRight,
  ChevronLeft,
  Hotel as HotelIcon,
  Utensils,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Destination, Hotel, Restaurant, Activity, WeatherInfo } from '../types';
import { destinationService } from '../services/destinationService';
import { hotelService } from '../services/hotelService';
import { restaurantService } from '../services/restaurantService';
import { activityService } from '../services/activityService';
import { weatherService } from '../services/weatherService';
import { HotelCard } from '../components/hotels/HotelCard';
import { RestaurantCard } from '../components/restaurants/RestaurantCard';
import { ActivityCard } from '../components/activities/ActivityCard';
import { RatingStars } from '../components/common/RatingStars';
import { DetailSkeleton } from '../components/common/SkeletonLoader';
import { formatCurrency } from '../utils/formatters';
import { useSavedItems } from '../hooks/useSavedItems';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggleDestination } = useSavedItems();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const dest = await destinationService.getDestinationById(id);
        if (dest) {
          setDestination(dest);
          const [hList, rList, aList, wInfo] = await Promise.all([
            hotelService.getHotelsByDestination(dest.name),
            restaurantService.getRestaurantsByDestination(dest.name),
            activityService.getActivitiesByDestination(dest.name),
            weatherService.getWeatherForDestination(dest.name)
          ]);
          setHotels(hList);
          setRestaurants(rList);
          setActivities(aList);
          setWeather(wInfo);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <DetailSkeleton />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Destination Not Found</h2>
        <Link to="/destinations" className="mt-4 inline-block text-sky-500 font-semibold">
          Return to Destinations
        </Link>
      </div>
    );
  }

  const saved = isSaved('destination', destination.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Cinematic Hero */}
      <div className="relative h-[480px] w-full bg-slate-900">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Overlay Content */}
        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white">
                  {destination.region}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/10">
                  {destination.climate}
                </span>
                <div className="bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/10">
                  <RatingStars rating={destination.rating} reviewCount={destination.reviewCount} size="sm" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white">
                {destination.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{destination.stateOrCountry}</span>
                <span className="text-slate-500">•</span>
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Best time: {destination.bestTimeToVisit}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleDestination(destination.id)}
                className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold ${
                  saved
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => navigate(`/planner?destination=${encodeURIComponent(destination.name)}`)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-heading font-bold shadow-xl flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan Trip to {destination.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Overview & Climate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Overview text */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                Destination Overview
              </h2>
              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                About {destination.name}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {destination.description}
            </p>

            {/* Highlights Grid */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-3">
                Key Experiences & Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destination.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Widget Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4" />
                  Live Climate
                </span>
                <span className="text-xs text-slate-400">Current Season</span>
              </div>

              {weather && (
                <>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                        {weather.tempAvg}°C
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">
                        {weather.condition}
                      </span>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <div>High: {weather.tempHigh}°C</div>
                      <div>Low: {weather.tempLow}°C</div>
                      <div>Rain: {weather.rainProbability}%</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold block text-slate-700 dark:text-slate-200 mb-1">
                      Packing Essentials:
                    </span>
                    <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                      {weather.packingRecommendations.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Budget Est */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm space-y-3">
              <span className="text-xs uppercase font-bold text-sky-400">Starting Budget</span>
              <div className="text-2xl font-extrabold font-heading">
                {formatCurrency(destination.startingBudget)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Covers average 3-day stay, transport, activities, and dining for two travelers.
              </p>
            </div>
          </div>
        </div>

        {/* Hotels Section */}
        {hotels.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  Boutique Stays in {destination.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Curated eco-lodges, tea bungalows, and luxury resorts.
                </p>
              </div>
              <Link to="/hotels" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                View All Hotels →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        )}

        {/* Restaurants Section */}
        {restaurants.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  Where to Eat in {destination.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Signature regional delicacies, vegetarian specialties, and bakery cafes.
                </p>
              </div>
              <Link to="/restaurants" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                View All Restaurants →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurants.map((rest) => (
                <RestaurantCard key={rest.id} restaurant={rest} />
              ))}
            </div>
          </div>
        )}

        {/* Activities Section */}
        {activities.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  Top Experiences in {destination.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Outdoor trails, heritage tours, and scenic viewpoints.
                </p>
              </div>
              <Link to="/activities" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                View All Activities →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
