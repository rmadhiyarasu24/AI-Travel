import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  Car,
  Clock,
  ExternalLink,
  MapPin,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ItineraryDay, ItineraryItem } from '../../types';
import { generateGoogleMapsDirUrl } from '../../utils/googleMapsUrl';

// Fix Leaflet default icon paths in React bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom category markers
const createCustomMarker = (number: number, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#0284c7' : '#0f172a'};
        border: 2px solid ${isSelected ? '#ffffff' : '#38bdf8'};
        color: #ffffff;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Helper component to dynamically re-center map bounds when active day changes
const ChangeMapView: React.FC<{ bounds: L.LatLngBoundsExpression }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

interface InteractiveMapViewProps {
  days: ItineraryDay[];
  destinationName: string;
  className?: string;
  onSelectItem?: (item: ItineraryItem) => void;
  osrmRouteCoordinates?: [number, number][];
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  days,
  destinationName,
  className = '',
  onSelectItem,
  osrmRouteCoordinates = []
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number | 'all'>('all');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Extract all itinerary items with coordinates for the selected day filter
  const activeItemsWithCoords: (ItineraryItem & { dayNum: number; dayTitle: string })[] = [];
  days.forEach((day) => {
    day.items.forEach((item) => {
      if (item.coordinates && (activeDayIndex === 'all' || activeDayIndex === day.dayNumber)) {
        activeItemsWithCoords.push({
          ...item,
          dayNum: day.dayNumber,
          dayTitle: day.title
        });
      }
    });
  });

  const selectedPoint = activeItemsWithCoords.find((p) => p.id === selectedPointId) || activeItemsWithCoords[0];

  // Default Center (Ooty, Tamil Nadu coordinates if no points)
  const centerLat = activeItemsWithCoords.length ? activeItemsWithCoords[0].coordinates.lat : 11.4102;
  const centerLng = activeItemsWithCoords.length ? activeItemsWithCoords[0].coordinates.lng : 76.6950;

  // Build Leaflet LatLng bounds
  const lats = activeItemsWithCoords.map((p) => p.coordinates.lat);
  const lngs = activeItemsWithCoords.map((p) => p.coordinates.lng);
  const bounds: L.LatLngBoundsExpression = lats.length > 0
    ? [
        [Math.min(...lats) - 0.02, Math.min(...lngs) - 0.02],
        [Math.max(...lats) + 0.02, Math.max(...lngs) + 0.02]
      ]
    : [[11.40, 76.68], [11.45, 76.72]];

  // Generate Polyline points for selected day's route
  const polylinePositions: [number, number][] = osrmRouteCoordinates.length > 0 && activeDayIndex === 'all'
    ? osrmRouteCoordinates
    : activeItemsWithCoords.map((p) => [p.coordinates.lat, p.coordinates.lng]);

  // Calculate day-specific route totals
  const totalDayDistanceKm = activeItemsWithCoords.reduce((sum, item) => sum + (item.distanceFromPrevKm || 0), 0);
  const totalDayTravelMins = activeItemsWithCoords.reduce((sum, item) => sum + (item.travelDurationMin || 0), 0);

  // Generate Google Maps Directions URL for selected day's stops
  const googleMapsStops = activeItemsWithCoords.map((item) => ({
    latitude: item.coordinates.lat,
    longitude: item.coordinates.lng,
    name: item.title
  }));

  const googleMapsDirUrl = generateGoogleMapsDirUrl(googleMapsStops);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md ${className}`}>
      {/* Top Map Bar & Day Selector Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-white shadow-lg">
          <Navigation className="w-4 h-4 text-sky-400" />
          <span className="font-heading font-bold text-xs">
            {destinationName} {activeDayIndex === 'all' ? 'Full Route' : `Day ${activeDayIndex}`} Map
          </span>
          <span className="text-[11px] text-slate-400">
            • {activeItemsWithCoords.length} Stops
          </span>
        </div>

        {/* Day Selector Pills */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveDayIndex('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              activeDayIndex === 'all'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Route
          </button>
          {days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(day.dayNumber)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                activeDayIndex === day.dayNumber
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet + OpenStreetMap Map Canvas */}
      <div className="relative w-full h-[420px]">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
        >
          <ChangeMapView bounds={bounds} />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* OSRM Route Polyline Overlay */}
          {polylinePositions.length > 1 && (
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#0284c7',
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 8'
              }}
            />
          )}

          {/* Day-specific POI Markers */}
          {activeItemsWithCoords.map((item, index) => {
            const isSelected = selectedPoint?.id === item.id;
            return (
              <Marker
                key={item.id}
                position={[item.coordinates.lat, item.coordinates.lng]}
                icon={createCustomMarker(index + 1, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedPointId(item.id);
                    if (onSelectItem) onSelectItem(item);
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1">
                    <span className="text-[10px] uppercase font-bold text-sky-500">
                      Day {item.dayNum} • Stop {index + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{item.location}</p>
                    <p className="text-[11px] text-slate-500 mt-1 italic">{item.description}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Day-Wise Route Summary & Google Maps Navigation Redirection Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 z-20 relative">
        {/* Left: Day Metrics & Ordered Stops Trail */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold">
              <Compass className="w-4 h-4" />
              <span>{activeDayIndex === 'all' ? 'Full Trip Metrics' : `Day ${activeDayIndex} Metrics`}:</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Car className="w-3.5 h-3.5 text-sky-400" />
              <span>{totalDayDistanceKm.toFixed(1)} km total</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{totalDayTravelMins} mins transit</span>
            </div>
          </div>

          {/* Ordered Stops Trail */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto py-0.5">
            <span className="font-semibold text-slate-300 shrink-0">Stops:</span>
            {activeItemsWithCoords.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-[11px] shrink-0">
                  {idx + 1}. {item.title.length > 20 ? `${item.title.slice(0, 18)}...` : item.title}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: External Google Maps Redirection Button */}
        <a
          href={googleMapsDirUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shrink-0"
        >
          <span>Open {activeDayIndex === 'all' ? 'All Stops' : `Day ${activeDayIndex}`} in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
