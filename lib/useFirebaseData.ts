'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';

export interface Reading {
  waterLevel: number;
  rainfall: number;
  soilMoisture: number;
  rainDetected: boolean;
  status: 'Normal' | 'Warning' | 'Danger';
  timestamp: number;
}

export interface HistoryEntry {
  waterLevel: number;
  rainfall: number;
  timestamp: number;
}

export interface Thresholds {
  warning: number;
  danger: number;
}

export interface DeviceLocation {
  latitude: number | null;
  longitude: number | null;
}

export function useFirebaseData() {
  const [reading, setReading]           = useState<Reading | null>(null);
  const [history, setHistory]           = useState<HistoryEntry[]>([]);
  const [thresholds, setThresholds]     = useState<Thresholds | null>(null);
  const [deviceLocation, setDeviceLoc] = useState<DeviceLocation>({ latitude: null, longitude: null });
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !database) {
      setError('Firebase is not configured. Copy .env.example to .env.local and fill in your project values.');
      setLoading(false);
      return;
    }

    try {
      // Listen to current readings
      const readingsRef = ref(database, 'readings');
      const unsubscribeReadings = onValue(
        readingsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setReading(snapshot.val() as Reading);
          }
        },
        (err) => {
          setError(`Error reading current data: ${err.message}`);
          console.error('[v0] Firebase readings error:', err);
        }
      );

      // Listen to history — limitToLast(2880) fetches only the last 24 h of readings
      // server-side (2880 × 30-second interval = 86 400 s = 24 h).
      // This keeps bandwidth low while making the 1 h / 6 h / 24 h filters meaningful.
      const historyRef = query(ref(database, 'history'), limitToLast(2880));
      const unsubscribeHistory = onValue(
        historyRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // Convert object to array if needed, or use directly if already an array
            const historyArray = Array.isArray(data)
              ? data
              : Object.values(data);
            setHistory(
              historyArray
                .sort((a: any, b: any) => a.timestamp - b.timestamp)
            );
          }
          setLoading(false);
        },
        (err) => {
          setError(`Error reading history: ${err.message}`);
          setLoading(false);
          console.error('[v0] Firebase history error:', err);
        }
      );

      // Listen to thresholds
      const thresholdsRef = ref(database, 'thresholds');
      const unsubscribeThresholds = onValue(
        thresholdsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // Handle both formats: {warning, danger} and {warningLevel, dangerLevel}
            const thresholdData: Thresholds = {
              warning: data.warning ?? data.warningLevel,
              danger: data.danger ?? data.dangerLevel,
            };
            setThresholds(thresholdData);
          }
        },
        (err) => {
          console.error('[v0] Firebase thresholds error:', err);
        }
      );

      // Listen to device location
      const deviceRef = ref(database, 'device');
      const unsubscribeDevice = onValue(
        deviceRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setDeviceLoc({
              latitude:  data.latitude  ?? null,
              longitude: data.longitude ?? null,
            });
          }
        },
        (err) => {
          console.warn('[Levee] Firebase /device error:', err.message);
        }
      );

      // Cleanup subscriptions
      return () => {
        unsubscribeReadings();
        unsubscribeHistory();
        unsubscribeThresholds();
        unsubscribeDevice();
      };
    } catch (err) {
      setError(`Error initializing Firebase: ${err}`);
      console.error('[v0] Firebase initialization error:', err);
      setLoading(false);
    }
  }, []);

  return { reading, history, thresholds, deviceLocation, loading, error };
}
