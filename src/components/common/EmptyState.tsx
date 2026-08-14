import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your travel story starts here',
  description = "You haven't saved any items or created trips yet.",
  actionText = 'Plan Your First Trip',
  actionHref = '/planner',
  onActionClick,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto my-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 shadow-inner">
        {icon || <Compass className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      {actionHref && !onActionClick ? (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          {actionText}
        </Link>
      ) : onActionClick ? (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          {actionText}
        </button>
      ) : null}
    </div>
  );
};
