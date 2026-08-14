import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  MapPin,
  Car,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lightbulb,
  Coins,
  Utensils,
  Camera,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { ItineraryDay, ItineraryItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ItineraryTimelineProps {
  days: ItineraryDay[];
  onSelectItem?: (item: ItineraryItem) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  days,
  onSelectItem
}) => {
  const [expandedDays, setExpandedDays] = useState<number[]>(days.map((d) => d.dayNumber));

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case 'food':
        return { label: 'Dining Stop', icon: Utensils, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' };
      case 'activity':
        return { label: 'Activity', icon: Sparkles, color: 'text-sky-600 bg-sky-500/10 border-sky-500/20' };
      case 'stay':
        return { label: 'Stay / Check-in', icon: Coffee, color: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20' };
      case 'relaxation':
        return { label: 'Scenic Stroll', icon: Camera, color: 'text-teal-600 bg-teal-500/10 border-teal-500/20' };
      default:
        return { label: 'Attraction', icon: MapPin, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      {days.map((day) => {
        const isExpanded = expandedDays.includes(day.dayNumber);

        return (
          <div
            key={day.dayNumber}
            className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all"
          >
            {/* Day Header Accordion Toggle */}
            <button
              onClick={() => toggleDay(day.dayNumber)}
              className="w-full p-5 flex items-center justify-between text-left bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white font-heading font-extrabold flex items-center justify-center shadow-sm">
                  {day.dayNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      {day.date || `Day ${day.dayNumber}`}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {day.theme}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                    {day.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                  Est. {formatCurrency(day.dayEstimatedCost)}
                </span>
                <div className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </button>

            {/* Day Items Timeline */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-6"
                >
                  <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
                    {day.items.map((item, index) => {
                      const badge = getItemTypeBadge(item.type);
                      const BadgeIcon = badge.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectItem && onSelectItem(item)}
                          className="relative group cursor-pointer"
                        >
                          {/* Timeline Node Icon Pin */}
                          <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-500 group-hover:bg-sky-500 group-hover:border-white transition-all flex items-center justify-center shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-sky-500 group-hover:bg-white transition-colors" />
                          </div>

                          {/* Transit Info if coming from previous stop */}
                          {item.distanceFromPrevKm > 0 && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 -mt-5 mb-3 border border-slate-200/50 dark:border-slate-700/50">
                              <Car className="w-3 h-3 text-sky-500" />
                              <span>
                                {item.travelDurationMin} min transit • {item.distanceFromPrevKm} km from previous stop
                              </span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 group-hover:border-sky-300 dark:group-hover:border-sky-800 group-hover:shadow-md transition-all">
                            {/* Item Photo */}
                            {item.image && (
                              <div className="md:col-span-4 h-32 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}

                            {/* Item Details */}
                            <div className={`${item.image ? 'md:col-span-8' : 'md:col-span-12'} space-y-2`}>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white font-mono">
                                    {item.time}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
                                    <BadgeIcon className="w-3 h-3" />
                                    {badge.label}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Est. {formatCurrency(item.estimatedCost)}
                                </span>
                              </div>

                              <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                {item.title}
                              </h4>

                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="line-clamp-1">{item.location}</span>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {item.description}
                              </p>

                              {item.tips && (
                                <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/20 p-2 rounded-lg border border-amber-500/20">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{item.tips}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
