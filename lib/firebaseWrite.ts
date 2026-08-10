import { ref, set } from 'firebase/database';
import { database } from './firebase';

/**
 * All Firebase write helpers live here. They use the same `database` instance
 * from firebase.ts — no new connection is created.
 */

function requireDatabase() {
  if (!database) {
    throw new Error('Firebase is not configured. Copy .env.example to .env.local and fill in your project values.');
  }
  return database;
}

/** Save device GPS/map coordinates */
export async function saveDeviceLocation(lat: number, lng: number): Promise<void> {
  const db = requireDatabase();
  await set(ref(db, 'device/latitude'),  lat);
  await set(ref(db, 'device/longitude'), lng);
}

/**
 * Save alert thresholds.
 * Writes both field name formats (warning/danger AND warningLevel/dangerLevel)
 * so the existing listener (which accepts either) stays compatible.
 */
export async function saveThresholds(warning: number, danger: number): Promise<void> {
  const db = requireDatabase();
  await set(ref(db, 'thresholds/warning'),      warning);
  await set(ref(db, 'thresholds/danger'),       danger);
  await set(ref(db, 'thresholds/warningLevel'), warning);
  await set(ref(db, 'thresholds/dangerLevel'),  danger);
}
