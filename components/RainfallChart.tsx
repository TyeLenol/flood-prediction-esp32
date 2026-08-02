'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HistoryEntry } from '@/lib/useFirebaseData';

interface RainfallChartProps {
  data: HistoryEntry[];
}

export function RainfallChart({ data }: RainfallChartProps) {
  if (data.length === 0) {
    return (
      <div className="w-full h-80 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  // Format data for chart (limit to last 50 points for clarity)
  const chartData = data.slice(-50).map((entry) => ({
    ...entry,
    time: new Date(entry.timestamp * 1000).toLocaleTimeString(),
  }));

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Rainfall Trend
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: 'rgb(100, 116, 139)' }}
          />
          <YAxis
            label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12, fill: 'rgb(100, 116, 139)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: 'none',
              borderRadius: '6px',
              color: 'rgb(248, 250, 252)',
            }}
            labelStyle={{ color: 'rgb(248, 250, 252)' }}
          />
          <Area
            type="monotone"
            dataKey="rainfall"
            stroke="hsl(199, 89%, 48%)"
            fill="url(#rainfallGradient)"
            strokeWidth={2}
            isAnimationActive={true}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
