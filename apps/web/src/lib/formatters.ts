/**
 * Formatting utilities for dates, numbers, and other display values
 */

export type RelativeTimeKey = "justNow" | "minutesAgo" | "hoursAgo" | "daysAgo" | "date";

export interface RelativeTimeResult {
  key: RelativeTimeKey;
  count?: number;
  date?: Date;
}

/**
 * Calculates relative time data from a timestamp.
 * Returns a key and optional count for translation.
 */
export function getRelativeTimeData(timestamp: string): RelativeTimeResult {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return { key: "justNow" };
  }

  if (diffMins < 60) {
    return { key: "minutesAgo", count: diffMins };
  }

  if (diffHours < 24) {
    return { key: "hoursAgo", count: diffHours };
  }

  if (diffDays < 7) {
    return { key: "daysAgo", count: diffDays };
  }

  return { key: "date", date };
}
