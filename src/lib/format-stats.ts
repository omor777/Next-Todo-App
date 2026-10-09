// src/lib/format-stats.ts

export function formatCompletionRate(rate: number): string {
  return `${rate}%`;
}

export function formatStreak(streakDays: number): string {
  if (streakDays === 0) return "No streak";
  if (streakDays === 1) return "1 day";
  return `${streakDays} days`;
}

export function formatDayLabel(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
  });
}
