import { ref, set } from 'firebase/database';
import { database } from './firebase';

/**
 * All Firebase write helpers live here. They use the same `database` instance
 * from firebase.ts — no new connection is created.
 */

/** Save device GPS/map coordinates */
export async function saveDeviceLocation(lat: number, lng: number): Promise<void> {
  await set(ref(database, 'device/latitude'),  lat);
  await set(ref(database, 'device/longitude'), lng);
}

/**
 * Save alert thresholds.
 * Writes both field name formats (warning/danger AND warningLevel/dangerLevel)
 * so the existing listener (which accepts either) stays compatible.
 */
export async function saveThresholds(warning: number, danger: number): Promise<void> {
  await set(ref(database, 'thresholds/warning'),      warning);
  await set(ref(database, 'thresholds/danger'),       danger);
  await set(ref(database, 'thresholds/warningLevel'), warning);
  await set(ref(database, 'thresholds/dangerLevel'),  danger);
}
