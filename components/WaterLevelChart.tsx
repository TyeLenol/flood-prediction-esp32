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
  ReferenceLine,
} from 'recharts';
import { HistoryEntry, Thresholds } from '@/lib/useFirebaseData';

interface WaterLevelChartProps {
  data: HistoryEntry[];
  thresholds?: Thresholds | null;
}

const chartConfig = {
  waterLevel: {
    label: 'Water Level',
    color: 'hsl(var(--chart-1))',
  },
};

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

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Water Level Trend
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
            label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          
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
            stroke="var(--color-waterLevel)"
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
