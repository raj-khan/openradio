import type { Station } from "@/lib/stations/types";

/*
 * What a country actually broadcasts in, taken from its own stations.
 *
 * Used to widen a search that came back empty: somewhere with no talk radio of
 * its own is better served by a station in its language than by a refusal.
 *
 * Read naively this goes badly wrong. Tiny territories carry one or two entries
 * each, often a relayed Quran channel, so the single most common language in
 * Tuvalu, Nauru, Liberia and a dozen others comes out as Arabic. Offering
 * Arabic talk radio to someone who asked for Tuvalu is worse than saying there
 * is none. So a language has to genuinely dominate before it counts.
 */

/** A language has to carry this many of a country's stations to speak for it. */
export const MIN_LANGUAGE_STATIONS = 3;
/** And this share of them, so one relay in a five station country does not win. */
export const MIN_LANGUAGE_SHARE = 0.25;

/**
 * The language that speaks for this set of stations, or undefined when none
 * does clearly enough to be worth acting on.
 */
export function dominantLanguage(stations: Station[]): string | undefined {
  if (stations.length === 0) return undefined;
  const tally = new Map<string, number>();
  for (const station of stations) {
    for (const language of station.languages) {
      tally.set(language, (tally.get(language) ?? 0) + 1);
    }
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [language, count] of tally) {
    // Ties go to the alphabetically earlier name so the result is stable.
    if (count > bestCount || (count === bestCount && best !== undefined && language < best)) {
      best = language;
      bestCount = count;
    }
  }
  if (best === undefined) return undefined;
  if (bestCount < MIN_LANGUAGE_STATIONS) return undefined;
  if (bestCount / stations.length < MIN_LANGUAGE_SHARE) return undefined;
  return best;
}
