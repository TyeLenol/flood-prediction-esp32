'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  LineChart,
  Line,
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

const chartConfig = {
  rainfall: {
    label: 'Rainfall',
    color: 'hsl(var(--chart-2))',
  },
};

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
    time: new Date(entry.timestamp).toLocaleTimeString(),
  }));

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Rainfall Trend
      </h3>
      <ChartContainer config={chartConfig} className="w-full h-80">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="rainfall"
            stroke="var(--color-rainfall)"
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
