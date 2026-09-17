import type { Station } from "@/lib/stations/types";

export const MIN_SURPRISE_BITRATE = 64;

/** Stations good enough to surprise someone with. */
export function surpriseCandidates(stations: Station[], excludeCountry?: string): Station[] {
  const good = stations.filter(
    (s) => s.lastCheckOk && Boolean(s.countryCode) && (s.bitrate ?? 0) >= MIN_SURPRISE_BITRATE,
  );
  const elsewhere = excludeCountry ? good.filter((s) => s.countryCode !== excludeCountry) : good;
  return elsewhere.length > 0 ? elsewhere : good;
}

export function pickRandom<T>(items: T[], random = Math.random): T | undefined {
  return items.length ? items[Math.floor(random() * items.length)] : undefined;
}
