import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-0 shadow-sm animate-pulse"
        >
          <div className="w-full h-52 bg-slate-200 dark:bg-slate-800" />
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
            </div>
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-full h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
};
