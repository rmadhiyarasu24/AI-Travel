import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check } from 'lucide-react';

interface AIThinkingIndicatorProps {
  currentStep: string;
  completedSteps?: string[];
}

export const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({
  currentStep,
  completedSteps = []
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/50 space-y-2 text-xs"
    >
      <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-semibold">
        <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
        <span>Aetheria Intelligence Core</span>
      </div>

      {completedSteps.map((step, idx) => (
        <div key={idx} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 pl-1">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="line-clamp-1">{step.replace(/^[✓✨]\s*/, '')}</span>
        </div>
      ))}

      {currentStep && (
        <div className="flex items-center gap-2 text-sky-800 dark:text-sky-200 pl-1 font-medium animate-pulse">
          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
          <span className="line-clamp-1">{currentStep.replace(/^[✓✨]\s*/, '')}</span>
        </div>
      )}
    </motion.div>
  );
};
