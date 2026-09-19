import type { Station } from "@/lib/stations/types";

/*
 * Which stations a country is missing.
 *
 * Radio Browser is community edited, so coverage follows whoever bothered to
 * add entries rather than what is on the air. Bangladesh is the clearest case:
 * 26 entries, against 23 brands Wikidata knows about, and the ones the
 * directory has never heard of are most of the commercial Dhaka dial (Radio
 * Today, ABC Radio, Radio Capital, Radio Ekattor, Colours FM, Radio Aamar).
 *
 * Wikidata is free, keyless and has a real SPARQL endpoint, but it records no
 * stream URLs, so it can never be a source of stations to play. What it can do
 * is say what exists, which turns the seed list from guesswork into a queue.
 */

/**
 * A station's brand, reduced to something two directories can be compared on.
 *
 * Names are written differently everywhere: "Radio Today" against "Radio Today
 * 89.6 FM", "DhakaFM 90.4" against "Dhaka FM". So this drops the decoration
 * (the word radio, FM and AM, frequencies, punctuation, accents) and keeps the
 * part that actually names the station.
 */
export function brandKey(name: string): string {
  return (
    name
      // "DhakaFM" is the same station as "Dhaka FM", but glued together the FM
      // is no longer a word and survives the decoration strip below.
      .replace(/(\p{Ll})(\p{Lu})/gu, "$1 $2")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .replace(/\b\d+(\s*\d+)?\b/g, " ")
      .replace(/\b(radio|fm|am|mhz|the|station)\b/g, " ")
      .replace(/\s+/g, "")
      .trim()
  );
}

export interface KnownStation {
  name: string;
  /** The broadcaster's own site, where a stream can sometimes be found. */
  website?: string;
}

export interface CoverageGap {
  carried: number;
  known: number;
  missing: KnownStation[];
}

/**
 * Brands a reference list knows about that the directory does not carry.
 *
 * A brand with an empty key (a name that was nothing but decoration) is
 * skipped rather than matched against every other empty one.
 */
export function coverageGap(known: KnownStation[], carried: Station[]): CoverageGap {
  const have = new Set(carried.map((station) => brandKey(station.name)).filter(Boolean));
  const seen = new Set<string>();
  const missing: KnownStation[] = [];
  for (const station of known) {
    const key = brandKey(station.name);
    if (!key || have.has(key) || seen.has(key)) continue;
    seen.add(key);
    missing.push(station);
  }
  return { carried: carried.length, known: known.length, missing };
}
