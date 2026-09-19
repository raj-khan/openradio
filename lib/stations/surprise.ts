import {
  matchesMode,
  meetsQualityFloor,
  MIN_MUSIC_BITRATE,
  type ListeningMode,
} from "@/lib/stations/listening-mode";
import type { Station } from "@/lib/stations/types";

/** @deprecated Judged per station now: see minBitrateFor. Kept for callers. */
export const MIN_SURPRISE_BITRATE = MIN_MUSIC_BITRATE;

/**
 * Stations good enough to surprise someone with.
 *
 * `relaxMode` decides what happens when nothing matches. Drawing from the whole
 * world there is always somewhere else to look, so falling back to any station
 * beats refusing. Pinned to one country there is not, and quietly handing over
 * music after someone asked for voices hides the gap from them: the caller
 * passes false and reports the emptiness instead.
 */
export function surpriseCandidates(
  stations: Station[],
  excludeCountry?: string,
  mode: ListeningMode = "any",
  relaxMode = true,
): Station[] {
  const good = stations.filter(
    (s) => s.lastCheckOk && Boolean(s.countryCode) && meetsQualityFloor(s),
  );
  const wanted = good.filter((s) => matchesMode(s, mode));
  const pool = wanted.length > 0 || !relaxMode ? wanted : good;
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

/*
 * The same station, twice in the pool or twice in a row.
 *
 * Thin pools make repetition obvious. Measured over 200 draws: pinned to
 * Bangladesh with Voices, one station came up 21% of the time and 10% of
 * presses repeated the one before; Cuba was 41% and 30%. Asking for voices in
 * Havana three times running and hearing the same reciter each time reads as
 * broken even though the pick is fair.
 *
 * Two causes, both handled here. A brand filed under several entries gets
 * several chances (AL-QURAN BANGLA is in the Bangladesh list twice on different
 * streams, so deduping by stream misses it), and nothing stops the draw landing
 * on the station already playing.
 */

/**
 * A station's brand for spreading purposes, which is a lighter fold than the
 * one the coverage report uses. That one strips "radio" and "fm" so two
 * directories can be compared; doing that here would merge genuinely different
 * stations ("Radio One" with "One FM") and shrink an already thin pool. This
 * only drops punctuation, accents and a trailing frequency, so "Jago Fm" and
 * "Jago FM 94.4" are one brand while "Radio One" and "One FM" stay two.
 */
export function stationBrand(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+\d+(\s+\d+)?\s*$/, "")
    .trim();
}

/**
 * One entry per brand, and never the station already playing unless it is the
 * only thing on offer. Order is otherwise the caller's, so the shuffle upstream
 * still decides who wins.
 */
export function spreadCandidates(candidates: Station[], heardId?: string): Station[] {
  const seen = new Set<string>();
  const spread: Station[] = [];
  for (const station of candidates) {
    const brand = stationBrand(station.name);
    if (brand && seen.has(brand)) continue;
    if (brand) seen.add(brand);
    spread.push(station);
  }
  if (!heardId) return spread;
  /*
   * Match what was heard by brand rather than by id. A brand filed twice keeps
   * whichever entry the shuffle put first, so the id that was played last time
   * is often not the id that survived this time, and avoiding the id alone
   * still let the same station come round again.
   */
  const heard = candidates.find((station) => station.id === heardId);
  if (!heard) return spread;
  const heardBrand = stationBrand(heard.name);
  const rest = spread.filter((station) => stationBrand(station.name) !== heardBrand);
  // Nothing else to offer: repeating beats refusing.
  if (rest.length === 0) return spread;
  return [...rest, ...spread.filter((station) => stationBrand(station.name) === heardBrand)];
}
