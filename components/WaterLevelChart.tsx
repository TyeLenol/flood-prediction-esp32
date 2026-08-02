'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HistoryEntry, Thresholds } from '@/lib/useFirebaseData';

interface WaterLevelChartProps {
  data: HistoryEntry[];
  thresholds?: Thresholds | null;
}

export function WaterLevelChart({ data, thresholds }: WaterLevelChartProps) {
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
    time: new Date(entry.timestamp).toLocaleTimeString(),
  }));

  // Calculate Y-axis domain to include thresholds
  const minThreshold = Math.min(thresholds?.warning || 0, thresholds?.danger || 0);
  const maxThreshold = Math.max(thresholds?.warning || 0, thresholds?.danger || 0);
  const minData = Math.min(...chartData.map((d) => d.waterLevel), minThreshold);
  const maxData = Math.max(...chartData.map((d) => d.waterLevel), maxThreshold);
  
  // Add 20% padding to show thresholds clearly
  const yDomain = [Math.floor(minData * 0.8), Math.ceil(maxData * 1.2)];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Water Level Trend
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 150, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: 'rgb(100, 116, 139)' }}
          />
          <YAxis
            domain={yDomain}
            label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft' }}
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

          {/* Reference lines for thresholds */}
          {thresholds?.danger && (
            <ReferenceLine
              y={thresholds.danger}
              stroke="hsl(0, 84%, 60%)"
              strokeDasharray="5 5"
              label={{
                value: `Danger: ${thresholds.danger}cm`,
                position: 'right',
                fill: 'hsl(0, 84%, 60%)',
                fontSize: 12,
              }}
            />
          )}
          {thresholds?.warning && (
            <ReferenceLine
              y={thresholds.warning}
              stroke="hsl(38, 92%, 50%)"
              strokeDasharray="5 5"
              label={{
                value: `Warning: ${thresholds.warning}cm`,
                position: 'right',
                fill: 'hsl(38, 92%, 50%)',
                fontSize: 12,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="waterLevel"
            stroke="hsl(217, 91%, 60%)"
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
