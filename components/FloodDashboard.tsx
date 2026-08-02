'use client';

import { useFirebaseData } from '@/lib/useFirebaseData';
import { StatusBadge } from './StatusBadge';
import { WaterLevelChart } from './WaterLevelChart';
import { RainfallChart } from './RainfallChart';
import { CircularGauge } from './CircularGauge';
import { RainIndicator } from './RainIndicator';
import { CorrelationChart } from './CorrelationChart';
import { calculateTimeToThreshold } from '@/lib/predictionUtils';
import { exportToCSV } from '@/lib/exportUtils';
import { useState, useMemo } from 'react';

export function FloodDashboard() {
  const { reading, history, thresholds, loading, error } = useFirebaseData();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  const timeToWarning = reading && thresholds?.warning 
    ? calculateTimeToThreshold(history, reading.waterLevel, thresholds.warning)
    : null;

  const timeToDanger = reading && thresholds?.danger
    ? calculateTimeToThreshold(history, reading.waterLevel, thresholds.danger)
    : null;

  const isStale = reading ? (Date.now() - reading.timestamp > 120000) : false; // 2 minutes

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const rangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
    }[timeRange];
    return history.filter(h => now - h.timestamp <= rangeMs);
  }, [history, timeRange]);

  const alertHistory = useMemo(() => {
    const alerts: { timestamp: number; type: string; level: number }[] = [];
    if (!thresholds) return alerts;
    
    for (let i = 1; i < history.length; i++) {
      const prev = history[i-1];
      const curr = history[i];
      
      if (curr.waterLevel >= thresholds.danger && prev.waterLevel < thresholds.danger) {
        alerts.push({ timestamp: curr.timestamp, type: 'Danger Threshold Breach', level: curr.waterLevel });
      } else if (curr.waterLevel >= thresholds.warning && prev.waterLevel < thresholds.warning && curr.waterLevel < thresholds.danger) {
        alerts.push({ timestamp: curr.timestamp, type: 'Warning Threshold Breach', level: curr.waterLevel });
      }
    }
    return alerts.reverse().slice(0, 5); // Last 5 alerts
  }, [history, thresholds]);

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
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 justify-end">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 ${isStale ? 'bg-amber-500' : 'bg-green-500'} rounded-full ${!isStale && 'animate-pulse'}`}></div>
                    <span className={`text-xs font-medium ${isStale ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                      {isStale ? 'Stale Data' : 'Live'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Last sync: {new Date(reading.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button 
                  onClick={() => exportToCSV(history)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded border border-slate-200 dark:border-slate-600 flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Export CSV
                </button>
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
            {isStale && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Connection Alert:</strong> Showing last known data from {new Date(reading.timestamp).toLocaleTimeString()}. Check sensor power and GSM connectivity.
                </p>
              </div>
            )}
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
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    Active
                  </span>
                </div>
                <CircularGauge
                  value={reading.soilMoisture}
                  max={100}
                  unit="%"
                  label="Soil Moisture"
                  color="teal"
                  size="small"
                />
                <p className="text-[10px] text-slate-400 mt-2">Capacitive Soil Sensor</p>
              </div>

              {/* Rainfall */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    Active
                  </span>
                </div>
                <CircularGauge
                  value={reading.rainfall}
                  max={50}
                  unit="mm"
                  label="Rainfall"
                  color="blue"
                  size="small"
                />
                <p className="text-[10px] text-slate-400 mt-2">Analog Tipping Bucket</p>
              </div>

              {/* Rain Detected */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-medium ${reading.rainDetected ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'} px-1.5 py-0.5 rounded border`}>
                    {reading.rainDetected ? 'Detecting' : 'Idle'}
                  </span>
                </div>
                <RainIndicator rainDetected={reading.rainDetected} />
                <p className="text-[10px] text-slate-400 mt-2">Digital Rain Sensor</p>
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

            {/* Prediction Section */}
            {(timeToWarning !== null || timeToDanger !== null) && (
              <div className="mb-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Flood Prediction Alert</h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      {timeToDanger !== null 
                        ? `At current rate, Danger level will be reached in ~${timeToDanger} minutes.`
                        : `At current rate, Warning level will be reached in ~${timeToWarning} minutes.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Charts & Controls */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Historical Trends</h2>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  {(['1h', '6h', '24h'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        timeRange === range
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <WaterLevelChart data={filteredHistory} thresholds={thresholds} />
                <RainfallChart data={filteredHistory} />
              </div>
              <CorrelationChart data={filteredHistory} />
            </div>

            {/* Alert History */}
            <div className="mb-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Alert History Log</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Recent threshold breach events</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Event Type</th>
                      <th className="px-6 py-3 text-right">Reading</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {alertHistory.length > 0 ? (
                      alertHistory.map((alert, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {new Date(alert.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              alert.type.includes('Danger') 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {alert.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-300">
                            {alert.level} cm
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                          No recent alerts recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-8">
              <details className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">System Architecture & Prediction Logic</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Click to expand technical details</p>
                  </div>
                  <span className="transition-transform group-open:rotate-180">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">JSN-SR04T Ultrasonic Sensor</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Measures water level by calculating the time-of-flight of ultrasonic pulses reflected off the water surface. 
                        Waterproof design allows for reliable operation in harsh environments.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Capacitive Soil Moisture</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Indicates ground saturation. Saturated soil (high moisture %) causes faster runoff during rainfall, 
                        significantly increasing flood risk even at lower precipitation levels.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Rainfall Monitoring</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Uses a combination of digital rain detection for immediate alerts and analog tipping bucket measurement 
                        for cumulative rainfall volume tracking.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Prediction Engine</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Employs linear regression on recent water level trends to project "Time to Threshold" alerts. 
                        Correlation analysis between rainfall intensity and water level rise enables early warning capabilities.
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Footer */}
            <footer className="mt-12 pb-8 border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {['ESP32-WROOM', 'JSN-SR04T', 'SIM7600 GSM', 'Firebase RTDB'].map(tech => (
                  <span key={tech} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Flood Prediction & Monitoring System &copy; 2024 • Embedded Systems Course Project
              </p>
            </footer>
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
