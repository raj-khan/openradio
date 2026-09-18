import { comboSlug, MIN_COMBO_STATIONS, PSEO_GENRES } from "@/lib/seo/combos";
import type { Station } from "@/lib/stations/types";

/*
 * Which genre-in-country landing pages belong in the sitemap.
 *
 * The pages themselves set noindex below MIN_COMBO_STATIONS, so listing one we
 * have not checked would submit a URL we have also told Google to ignore, which
 * Search Console reports as an error. The counts have to come from somewhere.
 *
 * Asking the directory per combo would be 192 requests for one sitemap. Instead
 * we sample each featured country once and tally genres across that sample. It
 * is a lower bound: a genre seen often enough inside a country's sample is
 * certainly common enough overall, so this under-includes rather than listing a
 * page that turns out to be thin. Erring that way is the right direction.
 */

export interface CountrySample {
  countryCode: string;
  countryName: string;
  stations: Station[];
}

export function comboSitemapPaths(samples: CountrySample[]): string[] {
  const paths = new Set<string>();
  for (const sample of samples) {
    const tally = new Map<string, number>();
    for (const station of sample.stations) {
      if (!station.lastCheckOk) continue;
      for (const tag of new Set(station.tags.map((t) => t.toLowerCase()))) {
        tally.set(tag, (tally.get(tag) ?? 0) + 1);
      }
    }
    for (const genre of PSEO_GENRES) {
      if ((tally.get(genre.tag) ?? 0) >= MIN_COMBO_STATIONS) {
        paths.add(`/${comboSlug(genre.slug, sample.countryName)}`);
      }
    }
  }
  return [...paths];
}
