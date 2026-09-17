import type { Facet, Station } from "@/lib/stations/types";

/** Subset of the Radio Browser station JSON we rely on. Every field may be missing. */
export interface RawRadioBrowserStation {
  stationuuid?: unknown;
  name?: unknown;
  url?: unknown;
  url_resolved?: unknown;
  homepage?: unknown;
  favicon?: unknown;
  country?: unknown;
  countrycode?: unknown;
  state?: unknown;
  language?: unknown;
  tags?: unknown;
  codec?: unknown;
  bitrate?: unknown;
  hls?: unknown;
  votes?: unknown;
  clickcount?: unknown;
  lastcheckok?: unknown;
  lastchecktime_iso8601?: unknown;
}

export interface RawRadioBrowserFacet {
  name?: unknown;
  iso_3166_1?: unknown;
  stationcount?: unknown;
}

const MAX_TAGS = 12;

function text(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function count(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** Return the URL if it is a well formed http(s) URL, otherwise undefined. */
export function httpUrl(value: unknown): string | undefined {
  const raw = text(value);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Split a comma separated list, lowercase, trim and dedupe. */
export function splitList(value: unknown, max = Number.POSITIVE_INFINITY): string[] {
  const raw = text(value);
  if (!raw) return [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const item = part.trim().toLowerCase().replace(/\s+/g, " ");
    if (item && item.length <= 40) seen.add(item);
    if (seen.size >= max) break;
  }
  return [...seen];
}

function knownCodec(value: unknown): string | undefined {
  const codec = text(value)?.toUpperCase();
  return codec && codec !== "UNKNOWN" ? codec.slice(0, 12) : undefined;
}

function isHlsStream(raw: RawRadioBrowserStation, streamUrl: string): boolean {
  if (raw.hls === 1 || raw.hls === "1" || raw.hls === true) return true;
  try {
    return new URL(streamUrl).pathname.toLowerCase().endsWith(".m3u8");
  } catch {
    return false;
  }
}

/** Convert raw Radio Browser JSON into a Station, or null if it is unusable. */
export function normalizeStation(raw: RawRadioBrowserStation): Station | null {
  const id = text(raw.stationuuid);
  const name = text(raw.name);
  const streamUrl = httpUrl(raw.url_resolved) ?? httpUrl(raw.url);
  if (!id || !name || !streamUrl) return null;

  const countryCode = text(raw.countrycode)?.toUpperCase();
  const bitrate = count(raw.bitrate);

  return {
    id,
    name: name.replace(/\s+/g, " ").slice(0, 120),
    streamUrl,
    homepageUrl: httpUrl(raw.homepage),
    faviconUrl: httpUrl(raw.favicon),
    country: text(raw.country),
    countryCode: countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : undefined,
    state: text(raw.state),
    languages: splitList(raw.language),
    tags: splitList(raw.tags, MAX_TAGS),
    codec: knownCodec(raw.codec),
    bitrate: bitrate > 0 ? bitrate : undefined,
    isHls: isHlsStream(raw, streamUrl),
    votes: count(raw.votes),
    clickCount: count(raw.clickcount),
    lastCheckOk: raw.lastcheckok === 1 || raw.lastcheckok === "1" || raw.lastcheckok === true,
    lastCheckedAt: text(raw.lastchecktime_iso8601),
    source: "radio-browser",
  };
}

/** Normalize a list, dropping unusable entries and duplicate ids. */
export function normalizeStations(raw: unknown): Station[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const stations: Station[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const station = normalizeStation(item as RawRadioBrowserStation);
    if (station && !seen.has(station.id)) {
      seen.add(station.id);
      stations.push(station);
    }
  }
  return stations;
}

/** Normalize facet lists (countries, languages, tags), sorted by station count. */
export function normalizeFacets(raw: unknown): Facet[] {
  if (!Array.isArray(raw)) return [];
  const byKey = new Map<string, Facet>();
  for (const item of raw as RawRadioBrowserFacet[]) {
    if (!item || typeof item !== "object") continue;
    const name = text(item.name);
    const stationCount = count(item.stationcount);
    if (!name || stationCount === 0) continue;
    const code = text(item.iso_3166_1)?.toUpperCase();
    const key = code ?? name.toLowerCase();
    const existing = byKey.get(key);
    if (existing) {
      existing.stationCount += stationCount;
    } else {
      byKey.set(key, { name, ...(code ? { code } : {}), stationCount });
    }
  }
  return [...byKey.values()].sort(
    (a, b) => b.stationCount - a.stationCount || a.name.localeCompare(b.name),
  );
}
