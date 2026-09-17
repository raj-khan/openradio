import { PLACES, MOODS } from "@/lib/imagery/catalog";
import type { Facet } from "@/lib/stations/types";

/** Only index browse pages with enough stations to be useful (no thin pages). */
export const MIN_STATIONS = 20;

export interface SitemapInput {
  countries: Facet[];
  languages: Facet[];
  tags: Facet[];
}

export function sitemapPaths({ countries, languages, tags }: SitemapInput): string[] {
  const paths = new Set<string>(["/", "/search", "/discover", "/about"]);
  for (const place of PLACES) paths.add(`/country/${place.countryCode.toLowerCase()}`);
  for (const mood of MOODS) paths.add(`/tag/${encodeURIComponent(mood.primaryTag)}`);
  countries
    .filter((c) => c.code && c.stationCount >= MIN_STATIONS)
    .slice(0, 80)
    .forEach((c) => paths.add(`/country/${c.code!.toLowerCase()}`));
  languages
    .filter((l) => l.stationCount >= MIN_STATIONS && /^[\p{L} -]+$/u.test(l.name))
    .slice(0, 40)
    .forEach((l) => paths.add(`/language/${encodeURIComponent(l.name)}`));
  tags
    .filter((t) => t.stationCount >= MIN_STATIONS && /^[\p{L}\p{N} &'-]+$/u.test(t.name))
    .slice(0, 60)
    .forEach((t) => paths.add(`/tag/${encodeURIComponent(t.name)}`));
  return [...paths];
}
