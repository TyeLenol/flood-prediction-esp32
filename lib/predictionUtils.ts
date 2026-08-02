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
  
  // Simple linear regression (x = time in minutes, y = water level)
  // To keep it simple and effective for this project, we'll calculate average rate of change
  let totalRate = 0;
  let intervals = 0;

  for (let i = 1; i < recentData.length; i++) {
    const timeDiff = (recentData[i].timestamp - recentData[i-1].timestamp) / (1000 * 60); // in minutes
    const levelDiff = recentData[i].waterLevel - recentData[i-1].waterLevel;
    
    if (timeDiff > 0) {
      totalRate += levelDiff / timeDiff;
      intervals++;
    }
  }

  const avgRate = intervals > 0 ? totalRate / intervals : 0;

  // If rate is not positive, water level is not rising
  if (avgRate <= 0.01) return null; // Using a small epsilon

  const remainingLevel = threshold - currentLevel;
  const minutesToThreshold = remainingLevel / avgRate;

  // Cap at 24 hours to avoid unrealistic projections
  if (minutesToThreshold > 1440) return null;

  return Math.round(minutesToThreshold);
}
