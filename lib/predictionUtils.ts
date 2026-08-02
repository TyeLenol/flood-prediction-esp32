import { HistoryEntry } from './useFirebaseData';

/**
 * Calculates the estimated time to reach a specific water level threshold
 * using simple linear regression on the most recent data points.
 *
 * @param history Array of historical data points
 * @param currentLevel The most recent water level reading
 * @param threshold The target water level threshold
 * @returns Estimated minutes until threshold reached, or null if not rising or insufficient data
 */
export function calculateTimeToThreshold(
  history: HistoryEntry[],
  currentLevel: number,
  threshold: number
): number | null {
  if (history.length < 3 || currentLevel >= threshold) return null;

  // Take the last 5 readings for a more stable rate calculation
  const recentData = history.slice(-5);

  // Require a genuine upward trend: the last reading must be higher than the
  // first reading in the window by at least 0.5 cm. This prevents flat or
  // oscillating data from producing misleading ETAs.
  const firstLevel = recentData[0].waterLevel;
  const lastLevel = recentData[recentData.length - 1].waterLevel;
  if (lastLevel - firstLevel < 0.5) return null;

  // Simple average rate-of-change (x = time in minutes, y = water level).
  // Skip intervals with timestamps < 30 seconds apart — these can inflate
  // the rate to near-infinity, causing ETA to collapse to ~0 minutes.
  let totalRate = 0;
  let intervals = 0;

  for (let i = 1; i < recentData.length; i++) {
    const timeDiff = (recentData[i].timestamp - recentData[i - 1].timestamp) / (1000 * 60); // minutes
    const levelDiff = recentData[i].waterLevel - recentData[i - 1].waterLevel;

    if (timeDiff >= 0.5) { // enforce ≥ 30-second minimum between readings
      totalRate += levelDiff / timeDiff;
      intervals++;
    }
  }

  if (intervals === 0) return null;

  const avgRate = totalRate / intervals;

  // Water level must be rising at a meaningful pace
  if (avgRate <= 0.01) return null;

  const remainingLevel = threshold - currentLevel;
  const minutesToThreshold = remainingLevel / avgRate;

  // Clamp: must be at least 1 minute, and cap at 24 hours for realism
  if (minutesToThreshold < 1 || minutesToThreshold > 1440) return null;

  return Math.round(minutesToThreshold);
}
