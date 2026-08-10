'use client';

import { useMemo, useState } from 'react';
import { CircularGauge } from '@/components/CircularGauge';
import { RainIndicator } from '@/components/RainIndicator';
import { WaterLevelChart } from '@/components/WaterLevelChart';
import { StatusBadge } from '@/components/StatusBadge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { calculateTimeToThreshold } from '@/lib/predictionUtils';
import { useFirebaseDataContext } from '@/lib/FirebaseDataContext';
import { ExportModal } from '@/components/ExportModal';

/* ── Skeleton placeholders ─────────────────────────────────────────────────── */

function GaugeSkeleton({ large }: { large?: boolean }) {
  const size = large ? 'w-52 h-52' : 'w-28 h-28';
  return (
    <div className={`${size} rounded-full skeleton-shimmer mx-auto`} />
  );
}

function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl skeleton-shimmer ${className}`} />
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <CardSkeleton className="h-24" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-card p-10 flex items-center justify-center">
          <GaugeSkeleton large />
        </div>
        <div className="space-y-4">
          <CardSkeleton className="h-24" />
          <CardSkeleton className="h-28" />
          <CardSkeleton className="h-20" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-card p-6 flex flex-col items-center gap-4">
            <GaugeSkeleton />
            <CardSkeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <CardSkeleton className="h-80" />
    </div>
  );
}

/* ── Error / no-data states ───────────────────────────────────────────────── */

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center h-80 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
      <div className="text-center px-6">
        <p className="text-red-700 dark:text-red-300 font-semibold mb-1">Connection Error</p>
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    </div>
  );
}

function NoDataState() {
  return (
    <div className="flex items-center justify-center h-80 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-card">
      <p className="text-slate-500 dark:text-muted-foreground text-sm">
        No data available. Check your Firebase configuration.
      </p>
    </div>
  );
}

/* ── Shared card wrapper ──────────────────────────────────────────────────── */

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-200 dark:border-white/[0.07]
        bg-white dark:bg-card shadow-sm dark:shadow-none
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ── Status dot ───────────────────────────────────────────────────────────── */

function LiveDot({ stale }: { stale: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${
          stale ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
        }`}
      />
      <span
        className={`text-xs font-medium ${
          stale
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {stale ? 'Stale' : 'Live'}
      </span>
    </span>
  );
}

/* ── Overview tab ─────────────────────────────────────────────────────────── */

export function OverviewTab() {
  const { reading, history, thresholds, loading, error } = useFirebaseDataContext();
  const [exportOpen, setExportOpen] = useState(false);

  const isStale = reading ? Date.now() - reading.timestamp * 1000 > 120_000 : false;

  const timeToWarning = useMemo(
    () =>
      reading && thresholds?.warning
        ? calculateTimeToThreshold(history, reading.waterLevel, thresholds.warning)
        : null,
    [history, reading, thresholds]
  );

  const timeToDanger = useMemo(
    () =>
      reading && thresholds?.danger
        ? calculateTimeToThreshold(history, reading.waterLevel, thresholds.danger)
        : null,
    [history, reading, thresholds]
  );

  if (error)   return <ErrorState error={error} />;
  if (loading) return <OverviewSkeleton />;
  if (!reading) return <NoDataState />;

  return (
    <div className="space-y-6">

      {/* ① Welcome header ─────────────────────────────────────────────────── */}
      <Card className="p-5 animate-fade-in-up stagger-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              Levee System
            </h1>
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
              Real-time flood monitoring · Monitoring Station Alpha
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LiveDot stale={isStale} />
            <StatusBadge status={reading.status} />
            <button
              onClick={() => setExportOpen(true)}
              disabled={history.length === 0}
              className="
                text-xs px-3 py-1.5 rounded-lg
                bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.07] dark:hover:bg-white/[0.12]
                text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-white/[0.08]
                flex items-center gap-1.5 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-muted-foreground mt-2">
          Last sync: {new Date(reading.timestamp * 1000).toLocaleString()}
          {isStale && (
            <span className="ml-2 text-amber-500">
              — Check sensor power and GSM connectivity
            </span>
          )}
        </p>
      </Card>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        data={history}
        defaultRange="24h"
      />

      {/* ② Main grid: Hero gauge (2/3) + Sidebar (1/3) ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-2">

        {/* Water level hero */}
        <Card className="lg:col-span-2 p-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-display text-base font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-sm">
              Water Level
            </h2>
            <InfoTooltip content="Measured by the JSN-SR04T ultrasonic sensor. Rising water level is the primary flood risk indicator — the gauge shows level as a % of the danger threshold." />
          </div>
          <CircularGauge
            value={reading.waterLevel}
            max={thresholds?.danger || 200}
            unit="cm"
            label="Current Level"
            color="green-yellow-red"
            size="large"
            warningLevel={thresholds?.warning}
            dangerLevel={thresholds?.danger}
          />
          <p className="mt-4 text-xs text-slate-400 dark:text-muted-foreground">
            JSN-SR04T Ultrasonic Distance Sensor
          </p>
        </Card>

        {/* Sidebar: status + thresholds + prediction */}
        <div className="flex flex-col gap-4">

          {/* Current status */}
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-2">
              Station Status
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge status={reading.status} />
              <span className="text-xs text-slate-400 dark:text-muted-foreground">
                {reading.status === 'Normal'
                  ? 'All clear'
                  : reading.status === 'Warning'
                  ? 'Monitor closely'
                  : 'Take action now'}
              </span>
            </div>
          </Card>

          {/* Thresholds */}
          {thresholds && (
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
                Thresholds
                <InfoTooltip content="Warning and Danger levels are configured in Firebase. They determine when status changes from Normal → Warning → Danger and trigger alert log entries." />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Warning</span>
                </div>
                <span className="font-display text-xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                  {thresholds.warning}<span className="text-sm font-normal ml-1">cm</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Danger</span>
                </div>
                <span className="font-display text-xl font-bold tabular-nums text-red-600 dark:text-red-400">
                  {thresholds.danger}<span className="text-sm font-normal ml-1">cm</span>
                </span>
              </div>
            </Card>
          )}

          {/* Flood Prediction Alert */}
          <Card className="p-4">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-3">
              Flood Projection
              <InfoTooltip content="Estimated time to threshold based on the rate of change across recent readings. This is a statistical projection — not a guarantee. Only shown when water level has a genuine sustained upward trend." />
            </div>
            {timeToDanger !== null ? (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">Danger level approaching</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">~{timeToDanger} min to danger level</p>
                </div>
              </div>
            ) : timeToWarning !== null ? (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Rising trend detected</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">~{timeToWarning} min to warning level</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Stable — no immediate risk</span>
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* ③ Secondary sensor grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up stagger-3">

        {/* Soil Moisture */}
        <Card className="p-6 flex flex-col items-center relative">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-medium text-slate-400 dark:text-muted-foreground bg-slate-50 dark:bg-white/[0.05] px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/[0.06]">
              Active
            </span>
          </div>
          <div className="flex items-center gap-1 mb-4 self-start">
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
              Soil Moisture
            </p>
            <InfoTooltip content="High soil saturation means the ground can't absorb more rainwater, increasing surface runoff and flood risk significantly — even at moderate rainfall levels." />
          </div>
          <CircularGauge
            value={reading.soilMoisture}
            max={100}
            unit="%"
            label="Saturation"
            color="teal"
            size="small"
          />
          <p className="text-[10px] text-slate-400 dark:text-muted-foreground mt-3">Capacitive Soil Sensor</p>
        </Card>

        {/* Rainfall */}
        <Card className="p-6 flex flex-col items-center relative">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-medium text-slate-400 dark:text-muted-foreground bg-slate-50 dark:bg-white/[0.05] px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/[0.06]">
              Active
            </span>
          </div>
          <div className="flex items-center gap-1 mb-4 self-start">
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
              Rainfall
            </p>
            <InfoTooltip content="Cumulative rainfall volume measured by an analog tipping-bucket gauge. Combined with soil moisture, heavy rainfall on saturated ground is the primary flood trigger." />
          </div>
          <CircularGauge
            value={reading.rainfall}
            max={50}
            unit="mm"
            label="Volume"
            color="blue"
            size="small"
          />
          <p className="text-[10px] text-slate-400 dark:text-muted-foreground mt-3">Analog Tipping Bucket</p>
        </Card>

        {/* Rain Detected */}
        <Card className="p-6 flex flex-col items-center relative">
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
              reading.rainDetected
                ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50'
                : 'text-slate-400 dark:text-muted-foreground bg-slate-50 dark:bg-white/[0.05] border-slate-200 dark:border-white/[0.06]'
            }`}>
              {reading.rainDetected ? 'Detecting' : 'Idle'}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-4 self-start">
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
              Rain Detected
            </p>
            <InfoTooltip content="Binary digital sensor — outputs YES or NO. Separate from the analog rainfall gauge. Useful for instant rain-start detection; doesn't measure volume." />
          </div>
          <RainIndicator rainDetected={reading.rainDetected} />
          <p className="text-[10px] text-slate-400 dark:text-muted-foreground mt-3">Digital Rain Sensor</p>
        </Card>

      </div>

      {/* ④ Water level trend chart ─────────────────────────────────────────── */}
      <div className="animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
            Water Level Trend
          </h2>
          <span className="text-xs text-slate-400 dark:text-muted-foreground">
            Last {Math.min(history.length, 50)} readings
          </span>
        </div>
        <WaterLevelChart data={history.slice(-50)} thresholds={thresholds} />
      </div>

    </div>
  );
}
