'use client';

import { useMemo, useState } from 'react';
import { useFirebaseDataContext } from '@/lib/FirebaseDataContext';
import { WaterLevelChart } from '@/components/WaterLevelChart';
import { RainfallChart } from '@/components/RainfallChart';
import { CorrelationChart } from '@/components/CorrelationChart';
import { ExportModal } from '@/components/ExportModal';
import type { HistoryEntry } from '@/lib/FirebaseDataContext';

/* ── Skeletons ──────────────────────────────────────────────────────────────── */

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-2xl skeleton-shimmer ${className}`} />;
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-80" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

/* ── Stat callout card ──────────────────────────────────────────────────────── */

interface StatCalloutProps {
  label: string;
  value: string;
  unit: string;
  sub?: string;
  accent: 'teal' | 'blue' | 'amber';
  icon: React.ReactNode;
}

const ACCENT_STYLES: Record<StatCalloutProps['accent'], string> = {
  teal:  'bg-teal-50  dark:bg-teal-900/20  border-teal-200  dark:border-teal-800/50  text-teal-600  dark:text-teal-400',
  blue:  'bg-blue-50  dark:bg-blue-900/20  border-blue-200  dark:border-blue-800/50  text-blue-600  dark:text-blue-400',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400',
};

function StatCallout({ label, value, unit, sub, accent, icon }: StatCalloutProps) {
  return (
    <div className="
      rounded-2xl p-5
      bg-white dark:bg-card
      border border-slate-200 dark:border-white/[0.07]
      shadow-sm dark:shadow-none
      flex flex-col gap-3
    ">
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${ACCENT_STYLES[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
          {value}
          <span className="text-base font-normal text-slate-400 dark:text-muted-foreground ml-1.5">
            {unit}
          </span>
        </p>
        {sub && (
          <p className="text-xs text-slate-400 dark:text-muted-foreground mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ── Time range selector ────────────────────────────────────────────────────── */

type TimeRange = '1h' | '6h' | '24h';

function TimeRangeSelector({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
}) {
  return (
    <div className="flex bg-slate-100 dark:bg-white/[0.06] p-1 rounded-full gap-0.5">
      {(['1h', '6h', '24h'] as const).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`
            px-3 py-1 text-xs font-medium rounded-full transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            ${value === r
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
          `}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

/* ── Analytics tab ──────────────────────────────────────────────────────────── */

export function AnalyticsTab() {
  const { history, thresholds, loading, error } = useFirebaseDataContext();
  const [timeRange, setTimeRange] = useState<TimeRange>('6h');
  const [exportOpen, setExportOpen] = useState(false);

  /* Filtered history for time-range charts.
     Timestamps are Unix seconds, so compare deltas in seconds. */
  const filteredHistory = useMemo((): HistoryEntry[] => {
    if (history.length === 0) return [];
    const latestTs = history[history.length - 1].timestamp;
    const rangeSec: Record<TimeRange, number> = {
      '1h':   1 * 60 * 60,
      '6h':   6 * 60 * 60,
      '24h': 24 * 60 * 60,
    };
    return history.filter(h => latestTs - h.timestamp <= rangeSec[timeRange]);
  }, [history, timeRange]);

  /* Aggregate stats — always computed from full history, not filtered */
  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const waterLevels = history.map(h => h.waterLevel);
    const rainfalls   = history.map(h => h.rainfall);
    return {
      avgWater:    waterLevels.reduce((s, v) => s + v, 0) / waterLevels.length,
      peakWater:   Math.max(...waterLevels),
      totalRainfall: rainfalls.reduce((s, v) => s + v, 0),
      sampleCount: history.length,
    };
  }, [history]);

  if (loading) return <AnalyticsSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page title + export button */}
      <div className="flex items-start justify-between animate-fade-in-up stagger-1">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
            Historical trends and sensor correlation · {stats?.sampleCount ?? 0} readings in database
          </p>
        </div>
        <button
          onClick={() => setExportOpen(true)}
          disabled={!history.length}
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            bg-slate-100 dark:bg-white/[0.06]
            text-slate-700 dark:text-slate-300
            hover:bg-slate-200 dark:hover:bg-white/[0.10]
            disabled:opacity-40 disabled:cursor-not-allowed
            border border-slate-200 dark:border-white/[0.07]
            transition-colors
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        data={history}
        thresholds={thresholds}
        defaultRange={timeRange}
      />

      {/* Stat callout cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up stagger-2">
        <StatCallout
          label="Avg Water Level"
          value={stats ? stats.avgWater.toFixed(1) : '—'}
          unit="cm"
          sub={`from ${stats?.sampleCount ?? 0} readings`}
          accent="teal"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          }
        />
        <StatCallout
          label="Peak Reading"
          value={stats ? stats.peakWater.toFixed(1) : '—'}
          unit="cm"
          sub={thresholds ? `Danger at ${thresholds.danger} cm` : 'all time maximum'}
          accent="amber"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          }
        />
        <StatCallout
          label="Total Rainfall Logged"
          value={stats ? stats.totalRainfall.toFixed(1) : '—'}
          unit="mm"
          sub="cumulative across all readings"
          accent="blue"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
            </svg>
          }
        />
      </div>

      {/* Correlation chart — the key feature */}
      <div className="animate-fade-in-up stagger-3">
        <div className="mb-3">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
            Sensor Correlation
          </h2>
          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Rainfall intensity vs. water level rise — the core of the flood prediction model
          </p>
        </div>
        <CorrelationChart data={history} />
      </div>

      {/* Time-ranged charts */}
      <div className="animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
            Trend Charts
          </h2>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>

        {filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-card flex items-center justify-center h-48">
            <p className="text-slate-400 dark:text-muted-foreground text-sm italic">
              No data in the selected time window
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WaterLevelChart data={filteredHistory} thresholds={thresholds} />
            <RainfallChart data={filteredHistory} />
          </div>
        )}
      </div>

    </div>
  );
}
