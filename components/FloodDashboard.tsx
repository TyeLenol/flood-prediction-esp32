'use client';

import { useFirebaseData } from '@/lib/useFirebaseData';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';
import { WaterLevelChart } from './WaterLevelChart';
import { RainfallChart } from './RainfallChart';

export function FloodDashboard() {
  const { reading, history, thresholds, loading, error } = useFirebaseData();

  if (error) {
    return (
      <div className="w-full h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-8 border border-red-200 dark:border-red-800 max-w-md">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
          <p className="text-red-600 dark:text-red-300 text-xs mt-4">
            Make sure your Firebase Realtime Database is properly configured and accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Flood Monitoring Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Real-time monitoring of water levels and environmental conditions
              </p>
            </div>
            {reading && (
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full"></div>
            </div>
          </div>
        ) : reading ? (
          <>
            {/* Status Section */}
            <div className="mb-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Current Status
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {reading.status === 'Normal'
                      ? 'Water levels are within normal range'
                      : reading.status === 'Warning'
                        ? 'Water levels are elevated, monitoring closely'
                        : 'Water levels are dangerously high, take action immediately'}
                  </p>
                </div>
                <StatusBadge status={reading.status} />
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Water Level"
                value={reading.waterLevel}
                unit="cm"
              />
              <StatCard
                title="Rainfall"
                value={reading.rainfall}
                unit="mm"
              />
              <StatCard
                title="Humidity"
                value={reading.humidity}
                unit="%"
              />
              <StatCard
                title="Temperature"
                value={reading.temperature}
                unit="°C"
              />
            </div>

            {/* Threshold Information */}
            {thresholds && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Warning Threshold
                  </p>
                  <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mt-1">
                    {thresholds.warning}
                    <span className="text-sm ml-1">cm</span>
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 p-4">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    Danger Threshold
                  </p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-200 mt-1">
                    {thresholds.danger}
                    <span className="text-sm ml-1">cm</span>
                  </p>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <WaterLevelChart data={history} thresholds={thresholds} />
              <RainfallChart data={history} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              No data available. Please check your Firebase database.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
