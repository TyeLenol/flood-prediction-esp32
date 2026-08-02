'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { HistoryEntry } from '@/lib/useFirebaseData';

interface CorrelationChartProps {
  data: HistoryEntry[];
}

export function CorrelationChart({ data }: CorrelationChartProps) {
  if (data.length === 0) {
    return (
      <div className="w-full h-80 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((entry) => ({
    ...entry,
    time: new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Sensor Correlation (Rainfall vs. Water Level)
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 italic">
          Demonstrates prediction logic relationship
        </span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: 'rgb(100, 116, 139)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'hsl(217, 91%, 60%)' }}
            tick={{ fontSize: 10, fill: 'hsl(217, 91%, 60%)' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight', fontSize: 12, fill: 'hsl(200, 95%, 45%)' }}
            tick={{ fontSize: 10, fill: 'hsl(200, 95%, 45%)' }}
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
          <Legend verticalAlign="top" height={36}/>
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="waterLevel"
            name="Water Level"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rainfall"
            name="Rainfall"
            stroke="hsl(200, 95%, 45%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
