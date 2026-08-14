import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  Compass,
  Hotel,
  Utensils,
  Maximize2,
  Minimize2,
  MapPin,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../../types';
import { aiService } from '../../services/aiService';
import { AIMessageBubble } from './AIMessageBubble';
import { AIThinkingIndicator } from './AIThinkingIndicator';

export const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: 'Just now',
      content: "Hello! I'm your AI Travel Concierge. I can formulate full itineraries, check real-time weather, recommend boutique stays, and find hidden regional restaurants. Where are you planning to travel?",
      suggestedActions: [
        { label: '🌿 Plan trip to Ooty', actionType: 'plan_trip', payload: { destination: 'Ooty' } },
        { label: '🛶 Plan trip to Kerala', actionType: 'plan_trip', payload: { destination: 'Kerala' } },
        { label: '🏨 Curated Hotels', actionType: 'open_destination', payload: { path: '/hotels' } },
        { label: '🍽️ Top Restaurants', actionType: 'open_destination', payload: { path: '/restaurants' } }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, currentThinkingStep]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setCurrentThinkingStep('✨ Initializing travel intelligence models...');
    setCompletedSteps([]);

    try {
      const response = await aiService.chatAssistant(text, (step) => {
        setCompletedSteps((prev) => [...prev, step]);
        setCurrentThinkingStep(step);
      });

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: "I couldn't process your request right now. Let's try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
      setCurrentThinkingStep('');
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedActions']>[0]) => {
    if (action.actionType === 'plan_trip') {
      const dest = action.payload?.destination || 'Ooty';
      setIsOpen(false);
      navigate(`/planner?destination=${encodeURIComponent(dest)}`);
    } else if (action.actionType === 'open_destination' && action.payload?.path) {
      setIsOpen(false);
      navigate(action.payload.path);
    } else if (action.actionType === 'view_hotel') {
      setIsOpen(false);
      navigate('/hotels');
    } else if (action.actionType === 'view_restaurant') {
      setIsOpen(false);
      navigate('/restaurants');
    } else if (action.actionType === 'view_activity') {
      setIsOpen(false);
      navigate('/activities');
    }
  };

  const presetPills = [
    { label: '🏔️ Plan Ooty 4 Days', prompt: 'Plan a 4-day trip to Ooty with budget and tea estates' },
    { label: '🛶 Kerala Houseboat', prompt: 'Recommend a 5-day itinerary in Kerala with Alleppey houseboat' },
    { label: '🏨 Heritage Hotels', prompt: 'Find luxury boutique heritage hotels in South India' },
    { label: '🍽️ Local Cuisine', prompt: 'Recommend top local restaurants and authentic regional food' }
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="ai-assistant-toggle-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white font-semibold text-sm shadow-xl hover:shadow-2xl hover:shadow-sky-500/30 transition-all duration-300 border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <span className="font-heading">AI Travel Assistant</span>
        </motion.button>
      </div>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-24 right-6 z-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col transition-all duration-300 ${
              isExpanded
                ? 'w-[90vw] md:w-[620px] h-[80vh] max-h-[750px]'
                : 'w-[92vw] sm:w-[410px] h-[550px]'
            }`}
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-base leading-tight">
                      Aetheria AI
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Your personal travel companion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
                  title={isExpanded ? 'Minimize size' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Suggested quick pills */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {presetPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(pill.prompt)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors shadow-xs"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Chat Conversation Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
              {messages.map((msg) => (
                <AIMessageBubble
                  key={msg.id}
                  message={msg}
                  onActionClick={handleActionClick}
                />
              ))}

              {isLoading && (
                <AIThinkingIndicator
                  currentStep={currentThinkingStep}
                  completedSteps={completedSteps}
                />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything (e.g. Plan 5 days in Kerala)..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
