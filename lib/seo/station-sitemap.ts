import { meetsQualityFloor } from "@/lib/stations/listening-mode";
import type { Station } from "@/lib/stations/types";

/*
 * Which station pages are worth asking a search engine to index.
 *
 * The directory holds around 57,000 stations, and submitting all of them would
 * be a mistake: a large share are dead, duplicated or so obscure that the page
 * carries nothing worth ranking. Thin pages at that volume cost crawl budget
 * and drag on the pages that do deserve to rank. So this takes a bounded,
 * ranked slice rather than the lot.
 */

/**
 * How many station pages go in the sitemap.
 *
 * Not a protocol limit (that is 50,000 per file, so this still fits in one).
 * It is a fetch budget: the directory caps a page at 100 stations, so every
 * thousand here is ten requests each time the sitemap is rebuilt.
 */
export const MAX_SITEMAP_STATIONS = 2000;

/** A station page only earns a place if it has something on it worth reading. */
export function isIndexable(station: Station): boolean {
  if (!station.lastCheckOk) return false; // known to be off the air
  if (!station.countryCode) return false; // no country means a bare page
  if (!meetsQualityFloor(station)) return false;
  if (station.tags.length === 0 && !station.homepageUrl) return false;
  // Nobody has ever voted for or played it: no signal that it is worth a page.
  return station.votes > 0 || station.clickCount > 0;
}

/** Most-wanted first, so the cap keeps the stations people actually look for. */
export function rankForSitemap(stations: Station[]): Station[] {
  return [...stations].sort(
    (a, b) => b.clickCount + b.votes - (a.clickCount + a.votes) || a.id.localeCompare(b.id),
  );
}

export interface SitemapStation {
  path: string;
  lastModified?: Date;
}

/**
 * `lastChangedAt` is when the station's own details changed. We deliberately do
 * not fall back to `lastCheckedAt`, which moves every time the directory probes
 * the stream: reporting that as a change would tell a crawler the page is new
 * when nothing on it moved, and teach it to distrust the field.
 */
export function stationSitemapEntries(
  stations: Station[],
  limit = MAX_SITEMAP_STATIONS,
): SitemapStation[] {
  const seen = new Set<string>();
  const entries: SitemapStation[] = [];
  for (const station of rankForSitemap(stations.filter(isIndexable))) {
    if (entries.length >= limit) break;
    if (seen.has(station.id)) continue;
    seen.add(station.id);
    const changed = station.lastChangedAt ? new Date(station.lastChangedAt) : undefined;
    entries.push({
      path: `/station/${station.id}`,
      lastModified: changed && !Number.isNaN(changed.getTime()) ? changed : undefined,
    });
  }
  return entries;
}
