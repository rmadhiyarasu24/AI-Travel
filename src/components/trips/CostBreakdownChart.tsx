import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { Hotel, Utensils, Car, Sparkles, MoreHorizontal, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { TripBudgetBreakdown } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CostBreakdownChartProps {
  budget: TripBudgetBreakdown;
  travelersCount?: number;
  durationDays?: number;
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({
  budget,
  travelersCount = 2,
  durationDays = 4
}) => {
  const [viewType, setViewType] = useState<'pie' | 'bar'>('pie');

  const data = [
    { name: 'Accommodations', key: 'hotel', value: budget.hotel, color: '#0ea5e9', icon: Hotel },
    { name: 'Food & Dining', key: 'food', value: budget.food, color: '#f59e0b', icon: Utensils },
    { name: 'Transport & Cab', key: 'transport', value: budget.transport, color: '#6366f1', icon: Car },
    { name: 'Activities & Passes', key: 'activities', value: budget.activities, color: '#10b981', icon: Sparkles },
    { name: 'Other & Souvenirs', key: 'other', value: budget.other, color: '#8b5cf6', icon: MoreHorizontal }
  ];

  const total = budget.total || data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Intelligent Budget Allocation
          </span>
          <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Estimated Cost Breakdown
          </h3>
        </div>

        {/* Toggle View */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setViewType('pie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewType === 'pie'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Distribution</span>
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewType === 'bar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Comparison</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Chart View */}
        <div className="lg:col-span-5 h-64 relative flex items-center justify-center">
          {viewType === 'pie' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Estimated']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Estimated']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Center text for pie */}
          {viewType === 'pie' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                {formatCurrency(total)}
              </span>
            </div>
          )}
        </div>

        {/* Breakdown List */}
        <div className="lg:col-span-7 space-y-2.5">
          {data.map((item) => {
            const percentage = Math.round((item.value / total) * 100) || 0;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {percentage}% of overall trip budget
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Per person est: {formatCurrency(Math.round(total / (travelersCount || 1)))}</span>
            <span>Per day est: {formatCurrency(Math.round(total / (durationDays || 1)))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
