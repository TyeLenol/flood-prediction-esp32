'use client';

import { useMemo } from 'react';
import { useFirebaseDataContext } from '@/lib/FirebaseDataContext';

/* ── Alert history computation ─────────────────────────────────────────────── */

interface AlertEvent {
  timestamp: number;
  type: 'Danger Threshold Breach' | 'Warning Threshold Breach';
  level: number;
}

function useAlertHistory(): AlertEvent[] {
  const { history, thresholds } = useFirebaseDataContext();

  return useMemo(() => {
    if (!thresholds || history.length < 2) return [];
    const alerts: AlertEvent[] = [];

    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];

      if (curr.waterLevel >= thresholds.danger && prev.waterLevel < thresholds.danger) {
        alerts.push({ timestamp: curr.timestamp, type: 'Danger Threshold Breach', level: curr.waterLevel });
      } else if (
        curr.waterLevel >= thresholds.warning &&
        prev.waterLevel < thresholds.warning &&
        curr.waterLevel < thresholds.danger
      ) {
        alerts.push({ timestamp: curr.timestamp, type: 'Warning Threshold Breach', level: curr.waterLevel });
      }
    }

    return alerts.reverse().slice(0, 20); // most recent first, cap at 20
  }, [history, thresholds]);
}

/* ── Empty state ──────────────────────────────────────────────────────────── */

function EmptyAlerts() {
  return (
    <div className="
      flex flex-col items-center justify-center
      h-64 rounded-2xl
      border border-dashed border-slate-200 dark:border-white/[0.10]
      bg-slate-50/50 dark:bg-white/[0.02]
    ">
      <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p className="font-display text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
        No threshold breaches recorded
      </p>
      <p className="text-sm text-slate-400 dark:text-muted-foreground max-w-xs text-center">
        Alert events appear here whenever water levels cross a Warning or Danger threshold.
      </p>
    </div>
  );
}

/* ── Alerts tab ───────────────────────────────────────────────────────────── */

export function AlertsTab() {
  const { loading, error } = useFirebaseDataContext();
  const alertHistory = useAlertHistory();

  const warningCount = alertHistory.filter(a => a.type === 'Warning Threshold Breach').length;
  const dangerCount  = alertHistory.filter(a => a.type === 'Danger Threshold Breach').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-2xl skeleton-shimmer h-20" />
        <div className="rounded-2xl skeleton-shimmer h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header + summary */}
      <div className="animate-fade-in-up stagger-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">Alerts</h1>
        <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
          Threshold breach events from sensor history
        </p>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in-up stagger-2">
        <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/15 p-4">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
            Warning Events
          </p>
          <p className="font-display text-3xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
            {warningCount}
          </p>
        </div>
        <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/15 p-4">
          <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">
            Danger Events
          </p>
          <p className="font-display text-3xl font-bold tabular-nums text-red-700 dark:text-red-300">
            {dangerCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-card p-4 col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-1">
            Total Events
          </p>
          <p className="font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {alertHistory.length}
          </p>
        </div>
      </div>

      {/* Alert log */}
      <div className="animate-fade-in-up stagger-3">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
          Event Log
        </h2>

        {alertHistory.length === 0 ? (
          <EmptyAlerts />
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-card overflow-hidden shadow-sm dark:shadow-none">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/[0.06]">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider text-right">
                    Reading
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {alertHistory.map((alert, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          alert.type.includes('Danger')
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          alert.type.includes('Danger') ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-display font-bold tabular-nums text-slate-700 dark:text-slate-200">
                      {alert.level.toFixed(1)}
                      <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground ml-1">cm</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
