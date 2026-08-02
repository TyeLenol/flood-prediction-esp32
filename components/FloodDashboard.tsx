'use client';

import { useFirebaseData } from '@/lib/useFirebaseData';
import { StatusBadge } from './StatusBadge';
import { WaterLevelChart } from './WaterLevelChart';
import { RainfallChart } from './RainfallChart';
import { CircularGauge } from './CircularGauge';
import { RainIndicator } from './RainIndicator';

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

  const getStatusGlow = () => {
    switch (reading?.status) {
      case 'Danger':
        return 'dark:from-red-950/50 dark:to-slate-900';
      case 'Warning':
        return 'dark:from-yellow-950/50 dark:to-slate-900';
      case 'Normal':
      default:
        return 'dark:from-green-950/30 dark:to-slate-900';
    }
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${reading ? getStatusGlow() : 'dark:from-slate-950 dark:to-slate-900'}`}>
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
                <div className="flex items-center gap-2 justify-end">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
                  </p>
                </div>
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

            {/* Circular Gauges - Water Level Hero Section */}
            <div className="mb-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex justify-center">
                <CircularGauge
                  value={reading.waterLevel}
                  max={thresholds?.danger || 200}
                  unit="cm"
                  label="Water Level"
                  color="green-yellow-red"
                  size="large"
                  warningLevel={thresholds?.warning}
                  dangerLevel={thresholds?.danger}
                />
              </div>
            </div>

            {/* Gauge and Indicator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Soil Moisture */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex justify-center items-center">
                <CircularGauge
                  value={reading.soilMoisture}
                  max={100}
                  unit="%"
                  label="Soil Moisture"
                  color="teal"
                  size="small"
                />
              </div>

              {/* Rainfall */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex justify-center items-center">
                <CircularGauge
                  value={reading.rainfall}
                  max={50}
                  unit="mm"
                  label="Rainfall"
                  color="blue"
                  size="small"
                />
              </div>

              {/* Rain Detected */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex justify-center items-center">
                <RainIndicator rainDetected={reading.rainDetected} />
              </div>
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
