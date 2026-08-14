import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Coins,
  Compass,
  Hotel,
  Utensils,
  Share2,
  Download,
  Bookmark,
  CheckCircle,
  Clock,
  ArrowRight,
  CloudSun,
  ShieldCheck,
  RotateCcw,
  Coffee,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TripPlan, PlanTripRequest, ItineraryItem } from '../types';
import { aiService } from '../services/aiService';
import { destinationService } from '../services/destinationService';
import { ItineraryTimeline } from '../components/trips/ItineraryTimeline';
import { InteractiveMapView } from '../components/trips/InteractiveMapView';
import { CostBreakdownChart } from '../components/trips/CostBreakdownChart';
import { AIThinkingIndicator } from '../components/ai/AIThinkingIndicator';
import { formatCurrency, formatDateRange } from '../utils/formatters';
import { useSavedItems } from '../hooks/useSavedItems';
import { useToast } from '../hooks/useToast';

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSaved, toggleTrip } = useSavedItems();
  const { showToast } = useToast();

  // Form State initialized with URL params if available
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Ooty');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '2026-09-12');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '2026-09-15');
  const [travelers, setTravelers] = useState(Number(searchParams.get('travelers')) || 2);
  const [budget, setBudget] = useState(Number(searchParams.get('budget')) || 24000);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Tea & Nature',
    'Scenic Viewpoints',
    'Local Dining'
  ]);
  const [accommodationStyle, setAccommodationStyle] = useState('Heritage Resort');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'fast-paced'>('balanced');
  const [dietary, setDietary] = useState('Any');

  // Generation & Status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [generatedTrip, setGeneratedTrip] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'budget' | 'weather'>('itinerary');

  const availableInterests = [
    'Tea & Nature',
    'Scenic Viewpoints',
    'Local Dining',
    'Heritage & History',
    'Trekking & Trails',
    'Wildlife & Safari',
    'Water Activities',
    'Photography & Sunset',
    'Relaxation & Spa'
  ];

  const popularDestinations = ['Ooty', 'Kerala', 'Leh Ladakh', 'Jaipur', 'Coorg', 'Goa'];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStep('✨ Initializing AI Travel Reasoning Engine...');
    setCompletedSteps([]);
    setGeneratedTrip(null);

    const planReq: PlanTripRequest = {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      budgetTier,
      interests: selectedInterests,
      accommodationStyle,
      pace,
      dietaryPreference: dietary
    };

    try {
      const trip = await aiService.generateTripPlan(planReq, (step) => {
        setCompletedSteps((prev) => [...prev, step]);
        setCurrentStep(step);
      });

      setGeneratedTrip(trip);
      setIsGenerating(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }

      showToast('Trip itinerary synthesized successfully!', 'success');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      showToast('Failed to generate trip. Please retry.', 'error');
    }
  };

  const handleExportJSON = () => {
    if (!generatedTrip) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generatedTrip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${generatedTrip.destination}-Aetheria-Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Itinerary JSON exported!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Top Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>AI Itinerary Architect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Personalized Trip Planner
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Select your destination and preferences. Our intelligence core builds a synchronized day-by-day plan with GPS waypoints, weather forecasts, and cost breakdown.
          </p>
        </div>

        {/* Form Container */}
        {!generatedTrip && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl"
          >
            <form onSubmit={handleGeneratePlan} className="space-y-8">
              {/* Step 1: Destination */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  1. Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter city, state, or region (e.g. Ooty, Kerala, Ladakh...)"
                    className="w-full px-4 py-3.5 text-base font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                {/* Popular fast chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs text-slate-400 font-medium">Quick Pick:</span>
                  {popularDestinations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDestination(d)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        destination.toLowerCase() === d.toLowerCase()
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Dates & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-500" />
                    Travelers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full px-3.5 py-3 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={1}>1 Solo Explorer</option>
                    <option value={2}>2 Travelers (Couple / Pair)</option>
                    <option value={3}>3 Small Group</option>
                    <option value={4}>4 Family / Friends</option>
                    <option value={6}>6+ Group</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Budget Range & Tier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-sky-500" />
                      Target Total Budget
                    </label>
                    <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 font-heading">
                      {formatCurrency(budget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="2500"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹5,000 (Backpacker)</span>
                    <span>₹1,00,000+ (Luxury)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Budget Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'budget', label: 'Budget', desc: 'Hostels & Local' },
                      { id: 'moderate', label: 'Moderate', desc: 'Boutique Stays' },
                      { id: 'luxury', label: 'Luxury', desc: '5★ & Private' }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setBudgetTier(tier.id as any)}
                        className={`p-2.5 rounded-xl text-center border transition-all ${
                          budgetTier === tier.id
                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-xs font-bold">{tier.label}</span>
                        <span className="block text-[10px] opacity-80">{tier.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Interests & Travel Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-500" />
                  Travel Interests & Focus Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Pace & Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Itinerary Pace
                  </label>
                  <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="relaxed">Relaxed (2-3 stops/day)</option>
                    <option value="balanced">Balanced (3-4 stops/day)</option>
                    <option value="fast-paced">Fast-paced (5+ stops/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Accommodation Style
                  </label>
                  <select
                    value={accommodationStyle}
                    onChange={(e) => setAccommodationStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Heritage Resort">Heritage Resort / Bungalow</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Eco Lodge">Eco Plantation Lodge</option>
                    <option value="Houseboat">Backwater Houseboat</option>
                    <option value="Homestay">Local Homestay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Dietary Preference
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Any">All Regional Cuisine</option>
                    <option value="Vegetarian">Pure Vegetarian</option>
                    <option value="Vegan">Vegan Friendly</option>
                    <option value="Halal">Halal</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  id="generate-itinerary-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-heading font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 shadow-xl hover:shadow-2xl hover:shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Synthesize Personalized Itinerary</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Loading / Progress State */}
        {isGenerating && (
          <div className="max-w-xl mx-auto py-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-sky-500/20 mb-6 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-2">
              Synthesizing {destination} Itinerary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Analyzing elevation routes, opening hours, local tea estates, weather forecasts and budget constraints...
            </p>

            <AIThinkingIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>
        )}

        {/* Generated Itinerary Display View */}
        {generatedTrip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Trip Hero Card */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-12 shadow-2xl border border-slate-800">
              <img
                src={generatedTrip.heroImage}
                alt={generatedTrip.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-xs">
                      AI Synthesized Plan
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-slate-200 border border-white/10">
                      {generatedTrip.durationDays} Days & {generatedTrip.durationDays - 1} Nights
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-slate-200 border border-white/10">
                      {generatedTrip.travelers} Guests
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                    {generatedTrip.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {generatedTrip.summary}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold pt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateRange(generatedTrip.startDate, generatedTrip.endDate)}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{generatedTrip.interests.join(', ')}</span>
                  </div>
                </div>

                {/* Right Hero Stats & Action Toolbar */}
                <div className="flex flex-col gap-4 shrink-0">
                  <div className="bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400 uppercase font-semibold block">
                      Total Estimated Budget
                    </span>
                    <span className="text-2xl font-extrabold font-heading text-white">
                      {formatCurrency(generatedTrip.budget.total)}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ₹{Math.round(generatedTrip.budget.total / generatedTrip.travelers)} per traveler
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTrip(generatedTrip.id)}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                        isSaved('trip', generatedTrip.id)
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved('trip', generatedTrip.id) ? 'fill-white' : ''}`} />
                      <span>{isSaved('trip', generatedTrip.id) ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      onClick={handleExportJSON}
                      className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>

                    <button
                      onClick={() => {
                        setGeneratedTrip(null);
                      }}
                      className="p-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Re-plan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Itinerary, Interactive Map, Cost Breakdown, Weather) */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'itinerary', label: 'Day-by-Day Timeline', count: `${generatedTrip.days.length} Days` },
                { id: 'map', label: 'Route & Waypoints Map', count: 'Interactive' },
                { id: 'budget', label: 'Cost Breakdown', count: formatCurrency(generatedTrip.budget.total) },
                { id: 'weather', label: 'Weather & Packing', count: `${generatedTrip.weatherForecast?.tempAvg || 19}°C` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Views */}
            {activeTab === 'itinerary' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <ItineraryTimeline days={generatedTrip.days} />
                </div>
                <div className="lg:col-span-4 space-y-6">
                  {/* Map Snapshot */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Route Map Preview
                      </span>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                      >
                        Expand Map
                      </button>
                    </div>
                    <InteractiveMapView
                      days={generatedTrip.days}
                      destinationName={generatedTrip.destination}
                      className="h-64"
                    />
                  </div>

                  {/* Packing & Guidance Snippet */}
                  {generatedTrip.weatherForecast && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <CloudSun className="w-4 h-4 text-sky-500" />
                        Climate Guidance
                      </span>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">
                          {generatedTrip.weatherForecast.condition}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {generatedTrip.weatherForecast.tempAvg}°C Avg
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Recommended Packing:
                        </span>
                        {generatedTrip.weatherForecast.packingRecommendations.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 py-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-6">
                <InteractiveMapView
                  days={generatedTrip.days}
                  destinationName={generatedTrip.destination}
                  className="h-[520px]"
                />
              </div>
            )}

            {activeTab === 'budget' && (
              <CostBreakdownChart
                budget={generatedTrip.budget}
                travelersCount={generatedTrip.travelers}
                durationDays={generatedTrip.durationDays}
              />
            )}

            {activeTab === 'weather' && generatedTrip.weatherForecast && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400">
                    Destination Climate Analysis
                  </span>
                  <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
                    {generatedTrip.destination} Weather Forecast
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                    <span className="text-xs text-sky-600 dark:text-sky-400 uppercase font-semibold">
                      Condition
                    </span>
                    <h4 className="text-xl font-bold text-sky-950 dark:text-sky-100 mt-1">
                      {generatedTrip.weatherForecast.condition}
                    </h4>
                    <p className="text-xs text-sky-700 dark:text-sky-300 mt-1">
                      Elevation: ~2,240m above sea level
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span className="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold">
                      Temperature Range
                    </span>
                    <h4 className="text-xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                      {generatedTrip.weatherForecast.tempLow}°C - {generatedTrip.weatherForecast.tempHigh}°C
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Average day temperature {generatedTrip.weatherForecast.tempAvg}°C
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">
                      Rainfall Probability
                    </span>
                    <h4 className="text-xl font-bold text-blue-950 dark:text-blue-100 mt-1">
                      {generatedTrip.weatherForecast.rainProbability}% Chance
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Occasional afternoon mountain mist
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-3">
                    Packing Checklist for this Journey
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {generatedTrip.weatherForecast.packingRecommendations.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
