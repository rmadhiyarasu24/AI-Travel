import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, User, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../../types';

interface AIMessageBubbleProps {
  message: ChatMessage;
  onActionClick?: (action: NonNullable<ChatMessage['suggestedActions']>[0]) => void;
}

export const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({
  message,
  onActionClick
}) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      {isAssistant && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
            : 'bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-tr-sm shadow-md'
        }`}
      >
        <p className="whitespace-pre-line">{message.content}</p>

        {/* Suggested Actions buttons */}
        {isAssistant && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
            {message.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onActionClick && onActionClick(action)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-colors"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-1 text-[10px] text-right opacity-60">
          {message.timestamp}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </motion.div>
  );
};
