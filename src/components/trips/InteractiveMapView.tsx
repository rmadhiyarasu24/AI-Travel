import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Car,
  Clock,
  Compass
} from 'lucide-react';
import { ItineraryDay, ItineraryItem } from '../../types';

interface InteractiveMapViewProps {
  days: ItineraryDay[];
  destinationName: string;
  className?: string;
  onSelectItem?: (item: ItineraryItem) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  days,
  destinationName,
  className = '',
  onSelectItem
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number | 'all'>('all');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Extract all points with coordinates
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

  // SVG coordinate mapping normalization
  // Center roughly in simulated bounding box
  const lats = allItemsWithCoords.map((p) => p.coordinates.lat);
  const lngs = allItemsWithCoords.map((p) => p.coordinates.lng);
  const minLat = lats.length ? Math.min(...lats) : 10;
  const maxLat = lats.length ? Math.max(...lats) : 11;
  const minLng = lngs.length ? Math.min(...lngs) : 76;
  const maxLng = lngs.length ? Math.max(...lngs) : 77;

  const latRange = Math.max(maxLat - minLat, 0.05);
  const lngRange = Math.max(maxLng - minLng, 0.05);

  const getSvgCoordinates = (lat: number, lng: number, width: number = 800, height: number = 420) => {
    const pad = 60;
    const x = pad + ((lng - minLng) / lngRange) * (width - pad * 2);
    // Invert Y since SVG origin is top
    const y = height - (pad + ((lat - minLat) / latRange) * (height - pad * 2));
    return { x, y };
  };

  // Generate SVG path string connecting checkpoints in sequence
  const svgWidth = 800;
  const svgHeight = 420;
  const routePoints = allItemsWithCoords.map((p) => getSvgCoordinates(p.coordinates.lat, p.coordinates.lng, svgWidth, svgHeight));
  
  let pathD = '';
  if (routePoints.length > 0) {
    pathD = `M ${routePoints[0].x} ${routePoints[0].y}`;
    for (let i = 1; i < routePoints.length; i++) {
      const prev = routePoints[i - 1];
      const curr = routePoints[i];
      // Subtle smooth curve
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2 - 15;
      pathD += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`;
    }
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md ${className}`}
    >
      {/* Top Map Header & Day Selector Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-white shadow-lg">
          <Navigation className="w-4 h-4 text-sky-400" />
          <span className="font-heading font-bold text-xs">
            {destinationName} Route Map
          </span>
          <span className="text-[11px] text-slate-400">
            • {allItemsWithCoords.length} Waypoints
          </span>
        </div>

        {/* Filter by Day */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg">
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

      {/* Interactive Map Visual Vector Canvas */}
      <div className="relative w-full h-[420px] bg-radial from-slate-800/90 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Contour elevation line decorative visual */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <circle cx="200" cy="180" r="140" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="180" r="220" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="600" cy="260" r="160" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 6" />
        </svg>

        {/* Dynamic Route SVG */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full relative z-10"
        >
          {/* Animated Waypoint Route Path */}
          {pathD && (
            <>
              {/* Outer glow stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="6"
                strokeOpacity="0.3"
                strokeLinecap="round"
              />
              {/* Main animated dash route */}
              <path
                d={pathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </>
          )}

          {/* Interactive Checkpoint Markers */}
          {allItemsWithCoords.map((item, index) => {
            const coords = getSvgCoordinates(item.coordinates.lat, item.coordinates.lng, svgWidth, svgHeight);
            const isSelected = selectedPoint?.id === item.id;

            return (
              <g
                key={item.id}
                onClick={() => {
                  setSelectedPointId(item.id);
                  if (onSelectItem) onSelectItem(item);
                }}
                className="cursor-pointer group"
              >
                {/* Outer Ripple on select */}
                {isSelected && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="22"
                    fill="#38bdf8"
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Marker Body */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? 14 : 11}
                  fill={isSelected ? '#0284c7' : '#0f172a'}
                  stroke={isSelected ? '#ffffff' : '#38bdf8'}
                  strokeWidth={isSelected ? 2.5 : 2}
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Marker Number */}
                <text
                  x={coords.x}
                  y={coords.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isSelected ? '10px' : '9px'}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {index + 1}
                </text>

                {/* Marker Label */}
                <g transform={`translate(${coords.x}, ${coords.y - 18})`}>
                  <rect
                    x={-((item.title.length * 3.2) + 12)}
                    y="-16"
                    width={(item.title.length * 6.4) + 24}
                    height="18"
                    rx="9"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke="rgba(56, 189, 248, 0.4)"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="9px"
                    fontWeight="500"
                  >
                    {item.title.length > 20 ? `${item.title.slice(0, 18)}...` : item.title}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
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
