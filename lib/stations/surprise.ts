import {
  matchesMode,
  meetsQualityFloor,
  MIN_MUSIC_BITRATE,
  type ListeningMode,
} from "@/lib/stations/listening-mode";
import type { Station } from "@/lib/stations/types";

/** @deprecated Judged per station now: see minBitrateFor. Kept for callers. */
export const MIN_SURPRISE_BITRATE = MIN_MUSIC_BITRATE;

/** Stations good enough to surprise someone with. */
export function surpriseCandidates(
  stations: Station[],
  excludeCountry?: string,
  mode: ListeningMode = "any",
): Station[] {
  const good = stations.filter(
    (s) => s.lastCheckOk && Boolean(s.countryCode) && meetsQualityFloor(s),
  );
  // Asking for voices and getting none is worse than hearing the same country
  // twice, so the mode holds even when it leaves us little to choose from.
  const wanted = good.filter((s) => matchesMode(s, mode));
  const pool = wanted.length > 0 ? wanted : good;
  const elsewhere = excludeCountry ? pool.filter((s) => s.countryCode !== excludeCountry) : pool;
  return elsewhere.length > 0 ? elsewhere : pool;
}

export function pickRandom<T>(items: T[], random = Math.random): T | undefined {
  return items.length ? items[Math.floor(random() * items.length)] : undefined;
}

/** Fisher-Yates copy, so the order itself carries the randomness. */
export function shuffle<T>(items: T[], random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
