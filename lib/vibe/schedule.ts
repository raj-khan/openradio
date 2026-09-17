export const MIN_VIBE_INTERVAL_MS = 30_000;

/**
 * Decide whether to apply a new vibe now. Station changes apply immediately;
 * other changes (now playing text) at most once per interval.
 */
export function shouldApplyVibe(
  previous: { stationId: string | null; mood: string; appliedAt: number },
  next: { stationId: string | null; mood: string },
  now: number,
): boolean {
  if (previous.stationId !== next.stationId) return true;
  if (previous.mood === next.mood) return false;
  return now - previous.appliedAt >= MIN_VIBE_INTERVAL_MS;
}
