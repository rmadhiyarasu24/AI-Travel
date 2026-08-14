import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export function useSavedItems() {
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);
  const [savedHotels, setSavedHotels] = useState<string[]>([]);
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>([]);
  const [savedActivities, setSavedActivities] = useState<string[]>([]);
  const [savedTrips, setSavedTrips] = useState<string[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setSavedDestinations(user.savedDestinationIds || []);
    setSavedHotels(user.savedHotelIds || []);
    setSavedRestaurants(user.savedRestaurantIds || []);
    setSavedActivities(user.savedActivityIds || []);
    setSavedTrips(user.savedTripIds || []);
  }, []);

  const toggleDestination = useCallback((id: string) => {
    setSavedDestinations((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      authService.updateCurrentUser({ savedDestinationIds: next });
      return next;
    });
  }, []);

  const toggleHotel = useCallback((id: string) => {
    setSavedHotels((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      authService.updateCurrentUser({ savedHotelIds: next });
      return next;
    });
  }, []);

  const toggleRestaurant = useCallback((id: string) => {
    setSavedRestaurants((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      authService.updateCurrentUser({ savedRestaurantIds: next });
      return next;
    });
  }, []);

  const toggleActivity = useCallback((id: string) => {
    setSavedActivities((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      authService.updateCurrentUser({ savedActivityIds: next });
      return next;
    });
  }, []);

  const toggleTrip = useCallback((id: string) => {
    setSavedTrips((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      authService.updateCurrentUser({ savedTripIds: next });
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (type: 'destination' | 'hotel' | 'restaurant' | 'activity' | 'trip', id: string) => {
      switch (type) {
        case 'destination':
          return savedDestinations.includes(id);
        case 'hotel':
          return savedHotels.includes(id);
        case 'restaurant':
          return savedRestaurants.includes(id);
        case 'activity':
          return savedActivities.includes(id);
        case 'trip':
          return savedTrips.includes(id);
        default:
          return false;
      }
    },
    [savedDestinations, savedHotels, savedRestaurants, savedActivities, savedTrips]
  );

  const totalSavedCount =
    savedDestinations.length +
    savedHotels.length +
    savedRestaurants.length +
    savedActivities.length +
    savedTrips.length;

  return {
    savedDestinations,
    savedHotels,
    savedRestaurants,
    savedActivities,
    savedTrips,
    toggleDestination,
    toggleHotel,
    toggleRestaurant,
    toggleActivity,
    toggleTrip,
    isSaved,
    totalSavedCount
  };
}
