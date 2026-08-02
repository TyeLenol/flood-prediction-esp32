'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from './firebase';

export interface Reading {
  waterLevel: number;
  rainfall: number;
  humidity: number;
  temperature: number;
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

export function useFirebaseData() {
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

      // Listen to history
      const historyRef = ref(database, 'history');
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
                .slice(-100) // Keep last 100 entries
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
              warning: data.warning || data.warningLevel,
              danger: data.danger || data.dangerLevel,
            };
            setThresholds(thresholdData);
          }
        },
        (err) => {
          console.error('[v0] Firebase thresholds error:', err);
        }
      );

      // Cleanup subscriptions
      return () => {
        off(readingsRef, 'value', unsubscribeReadings);
        off(historyRef, 'value', unsubscribeHistory);
        off(thresholdsRef, 'value', unsubscribeThresholds);
      };
    } catch (err) {
      setError(`Error initializing Firebase: ${err}`);
      console.error('[v0] Firebase initialization error:', err);
      setLoading(false);
    }
  }, []);

  return { reading, history, thresholds, loading, error };
}
