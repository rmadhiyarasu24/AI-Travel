import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, CheckCircle, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../utils/formatters';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemType: 'hotel' | 'activity' | 'restaurant' | 'trip';
  subtitle?: string;
  pricePerUnit: number;
  unitLabel: string;
  image?: string;
  onSuccess?: (details: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  title,
  itemType,
  subtitle,
  pricePerUnit,
  unitLabel,
  image,
  onSuccess
}) => {
  const [checkIn, setCheckIn] = useState('2026-09-12');
  const [checkOut, setCheckOut] = useState('2026-09-15');
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const estimatedTotal = pricePerUnit * guests * (itemType === 'hotel' ? 3 : 1);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setIsConfirmed(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (onSuccess) {
      onSuccess({ title, guests, checkIn, checkOut, estimatedTotal });
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="relative h-32 bg-slate-900 flex items-end p-6">
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10">
                <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                  Instant Reservation Inquiry
                </span>
                <h3 className="text-xl font-bold text-white leading-snug font-heading line-clamp-1">
                  {title}
                </h3>
                {subtitle && <p className="text-xs text-slate-300 line-clamp-1">{subtitle}</p>}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {isConfirmed ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Reservation Request Confirmed!
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
                    A confirmation voucher and itinerary sync details have been routed to your traveler profile.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dates:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{checkIn} to {checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Party Size:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{guests} Traveler(s)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                      <span className="text-slate-800 dark:text-slate-100">Estimated Total:</span>
                      <span className="text-sky-600 dark:text-sky-400">{formatCurrency(estimatedTotal)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors"
                  >
                    Done & Return to Travel Plan
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirm} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        {itemType === 'hotel' ? 'Check-in Date' : 'Preferred Date'}
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    {itemType === 'hotel' ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-500" />
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-sky-500" />
                          Travelers
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value={1}>1 Guest</option>
                          <option value={2}>2 Guests</option>
                          <option value={3}>3 Guests</option>
                          <option value={4}>4 Guests</option>
                          <option value={6}>6+ Group</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Special Requests / Dietary Preferences (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="e.g. Quiet upper floor, vegetarian breakfast, late arrival..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatCurrency(pricePerUnit)} {unitLabel}
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(estimatedTotal)}{' '}
                        <span className="text-xs font-normal text-slate-500">Est. Total</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      Free cancellation
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Securing Reservation...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Reserve with Aetheria Guarantee
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
