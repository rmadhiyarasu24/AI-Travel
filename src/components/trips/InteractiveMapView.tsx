import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  Car,
  Clock,
  MapPin,
  Layers,
  Sparkles
} from 'lucide-react';
import { ItineraryDay, ItineraryItem } from '../../types';

// Fix Leaflet default icon paths in React bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom category icons
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

  // Extract all itinerary items with coordinates
  const allItemsWithCoords: (ItineraryItem & { dayNum: number; dayTitle: string })[] = [];
  days.forEach((day) => {
    day.items.forEach((item) => {
      if (item.coordinates && (activeDayIndex === 'all' || activeDayIndex === day.dayNumber)) {
        allItemsWithCoords.push({
          ...item,
          dayNum: day.dayNumber,
          dayTitle: day.title
        });
      }
    });
  });

  const selectedPoint = allItemsWithCoords.find((p) => p.id === selectedPointId) || allItemsWithCoords[0];

  // Default Center (Ooty, Tamil Nadu coordinates if no points)
  const centerLat = allItemsWithCoords.length ? allItemsWithCoords[0].coordinates.lat : 11.4102;
  const centerLng = allItemsWithCoords.length ? allItemsWithCoords[0].coordinates.lng : 76.6950;

  // Build Leaflet LatLng bounds
  const lats = allItemsWithCoords.map((p) => p.coordinates.lat);
  const lngs = allItemsWithCoords.map((p) => p.coordinates.lng);
  const bounds: L.LatLngBoundsExpression = lats.length > 0
    ? [
        [Math.min(...lats) - 0.02, Math.min(...lngs) - 0.02],
        [Math.max(...lats) + 0.02, Math.max(...lngs) + 0.02]
      ]
    : [[11.40, 76.68], [11.45, 76.72]];

  // Generate Polyline points for route
  const polylinePositions: [number, number][] = osrmRouteCoordinates.length > 0
    ? osrmRouteCoordinates
    : allItemsWithCoords.map((p) => [p.coordinates.lat, p.coordinates.lng]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md ${className}`}>
      {/* Top Map Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-white shadow-lg">
          <Navigation className="w-4 h-4 text-sky-400" />
          <span className="font-heading font-bold text-xs">
            {destinationName} Live Map (OpenStreetMap)
          </span>
          <span className="text-[11px] text-slate-400">
            • {allItemsWithCoords.length} Places
          </span>
        </div>

        {/* Day Selector Filter */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveDayIndex('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
              activeDayIndex === 'all'
                ? 'bg-sky-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Route
          </button>
          {days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(day.dayNumber)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                activeDayIndex === day.dayNumber
                  ? 'bg-sky-500 text-white'
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

          {/* POI Markers */}
          {allItemsWithCoords.map((item, index) => {
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
                      Day {item.dayNum} • {item.time}
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

      {/* Selected Point Bottom Detail Bar */}
      {selectedPoint && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 font-bold font-heading">
              {allItemsWithCoords.findIndex((p) => p.id === selectedPoint.id) + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-400">
                  Day {selectedPoint.dayNum} • {selectedPoint.time}
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {selectedPoint.type}
                </span>
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-100 line-clamp-1">
                {selectedPoint.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-1">
                {selectedPoint.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
            {selectedPoint.travelDurationMin > 0 && (
              <div className="flex items-center gap-1 text-slate-300">
                <Car className="w-3.5 h-3.5 text-sky-400" />
                <span>{selectedPoint.travelDurationMin} min transit ({selectedPoint.distanceFromPrevKm} km)</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{selectedPoint.durationHours} hrs duration</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
