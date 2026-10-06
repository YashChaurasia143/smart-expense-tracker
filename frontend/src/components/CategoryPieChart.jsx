import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_COLORS = {
  Food: '#f97316', // Orange
  Travel: '#0ea5e9', // Sky Blue
  Shopping: '#ec4899', // Pink
  Bills: '#eab308', // Amber/Yellow
  Education: '#8b5cf6', // Purple
  Health: '#10b981', // Emerald
  Other: '#64748b' // Slate
};

const CustomTooltip = ({ active, payload, currency = '₹', isDark }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`px-3 py-2 rounded-xl text-xs shadow-xl border ${
        isDark
          ? 'bg-slate-800 text-white border-slate-700'
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <p className="font-semibold text-slate-200">{data.category}</p>
        <p className="font-bold text-sm text-emerald-400 mt-0.5">
          {currency}
          {data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-slate-400 text-[11px] mt-0.5">
          {data.percentage}% of total spending ({data.count} items)
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart = ({ data = [], currency = '₹' }) => {
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        <p>No expense data available for category breakdown</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.category}`}
                fill={CATEGORY_COLORS[entry.category] || '#94a3b8'}
                stroke={isDark ? '#0f172a' : '#ffffff'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} isDark={isDark} />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
