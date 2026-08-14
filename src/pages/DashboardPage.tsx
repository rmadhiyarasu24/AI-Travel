import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Calendar,
  MapPin,
  Hotel,
  Utensils,
  Compass,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { authService } from '../services/authService';
import { destinationService } from '../services/destinationService';
import { hotelService } from '../services/hotelService';
import { restaurantService } from '../services/restaurantService';
import { activityService } from '../services/activityService';
import { mockSampleTrips } from '../data/sampleTrips';
import { Destination, Hotel as HotelType, Restaurant, Activity, TripPlan } from '../types';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { HotelCard } from '../components/hotels/HotelCard';
import { RestaurantCard } from '../components/restaurants/RestaurantCard';
import { ActivityCard } from '../components/activities/ActivityCard';
import { EmptyState } from '../components/common/EmptyState';
import { useSavedItems } from '../hooks/useSavedItems';
import { formatCurrency, formatDateRange } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    savedDestinations,
    savedHotels,
    savedRestaurants,
    savedActivities,
    savedTrips,
    toggleTrip,
    toggleDestination,
    toggleHotel,
    toggleRestaurant,
    toggleActivity
  } = useSavedItems();

  const user = authService.getCurrentUser();
  const activeTab = searchParams.get('tab') || 'saved';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [dList, hList, rList, aList] = await Promise.all([
          destinationService.getAllDestinations(),
          hotelService.getAllHotels(),
          restaurantService.getAllRestaurants(),
          activityService.getAllActivities()
        ]);
        setDestinations(dList);
        setHotels(hList);
        setRestaurants(rList);
        setActivities(aList);
        setTrips(mockSampleTrips);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  const savedDestList = destinations.filter((d) => savedDestinations.includes(d.id));
  const savedHotelList = hotels.filter((h) => savedHotels.includes(h.id));
  const savedRestList = restaurants.filter((r) => savedRestaurants.includes(r.id));
  const savedActList = activities.filter((a) => savedActivities.includes(a.id));
  const savedTripList = trips.filter((t) => savedTrips.includes(t.id));

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hero Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20">
                  Aetheria Explorer
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  {savedDestList.length} Destinations Saved
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {savedHotelList.length + savedRestList.length + savedActList.length} Stays & Cafes
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/planner"
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Itinerary</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'saved', label: 'Saved Trips & Plans', count: savedTripList.length },
            { id: 'destinations', label: 'Destinations', count: savedDestList.length },
            { id: 'hotels', label: 'Stays & Resorts', count: savedHotelList.length },
            { id: 'restaurants', label: 'Dining & Cafes', count: savedRestList.length },
            { id: 'activities', label: 'Activities & Trails', count: savedActList.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Saved Trips */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            {savedTripList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedTripList.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="relative h-48">
                      <img
                        src={trip.heroImage}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => toggleTrip(trip.id)}
                          className="p-2 rounded-full bg-slate-900/60 text-rose-500 hover:bg-rose-500 hover:text-white backdrop-blur-md transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500">
                          {trip.durationDays} Days Itinerary
                        </span>
                        <h3 className="text-lg font-bold font-heading mt-1 line-clamp-1">
                          {trip.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {trip.summary}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Estimated Budget
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                            {formatCurrency(trip.budget.total)}
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/planner?destination=${encodeURIComponent(trip.destination)}`)}
                          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <span>Open Itinerary</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved itineraries yet"
                description="Use our AI Trip Planner to synthesize custom multi-day journeys with interactive maps and save them here."
                actionLabel="Plan a Trip Now"
                onAction={() => navigate('/planner')}
              />
            )}
          </div>
        )}

        {/* Tab 2: Saved Destinations */}
        {activeTab === 'destinations' && (
          <div>
            {savedDestList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDestList.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved destinations"
                description="Explore our curated destinations directory and bookmark places you want to visit."
                actionLabel="Explore Destinations"
                onAction={() => navigate('/destinations')}
              />
            )}
          </div>
        )}

        {/* Tab 3: Saved Hotels */}
        {activeTab === 'hotels' && (
          <div>
            {savedHotelList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedHotelList.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved accommodations"
                description="Browse heritage bungalows, tea estate lodges, and luxury backwater houseboats."
                actionLabel="Browse Hotels"
                onAction={() => navigate('/hotels')}
              />
            )}
          </div>
        )}

        {/* Tab 4: Saved Restaurants */}
        {activeTab === 'restaurants' && (
          <div>
            {savedRestList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedRestList.map((rest) => (
                  <RestaurantCard key={rest.id} restaurant={rest} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved dining spots"
                description="Discover authentic regional eateries, bakeries, and high-altitude mountain cafes."
                actionLabel="Explore Restaurants"
                onAction={() => navigate('/restaurants')}
              />
            )}
          </div>
        )}

        {/* Tab 5: Saved Activities */}
        {activeTab === 'activities' && (
          <div>
            {savedActList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedActList.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved experiences"
                description="Book mountain train rides, tea cupping masterclasses, and coastal tours."
                actionLabel="Discover Experiences"
                onAction={() => navigate('/activities')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
