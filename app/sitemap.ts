import type { MetadataRoute } from "next";
import { PLACES } from "@/lib/imagery/catalog";
import { comboSitemapPaths, type CountrySample } from "@/lib/seo/combo-sitemap";
import { sitemapPaths } from "@/lib/seo/sitemap-entries";
import { MAX_SITEMAP_STATIONS, stationSitemapEntries } from "@/lib/seo/station-sitemap";
import { siteUrl } from "@/lib/site";
import { countryName } from "@/lib/stations/display";
import { loadFacets, loadStations } from "@/lib/stations/server-data";
import { MAX_LIMIT, type Station } from "@/lib/stations/types";

/** Rebuilt every six hours: the directory moves, but not minute to minute. */
export const revalidate = 21_600;

/** Ask for `count` stations in the pages the directory is willing to serve. */
async function collect(count: number): Promise<Station[]> {
  const pages = Math.ceil(count / MAX_LIMIT);
  const results = await Promise.all(
    Array.from({ length: pages }, (_, page) =>
      loadStations({ order: "popular", limit: MAX_LIMIT, offset: page * MAX_LIMIT }),
    ),
  );
  return results.flatMap((result) => (result.ok ? result.data : []));
}

/** One sample per featured country, used to judge which combos are worth listing. */
async function sampleCountries(): Promise<CountrySample[]> {
  const samples = await Promise.all(
    PLACES.map(async (place) => {
      const result = await loadStations({ country: place.countryCode, limit: MAX_LIMIT });
      return {
        countryCode: place.countryCode,
        countryName: countryName(place.countryCode) ?? place.city,
        stations: result.ok ? result.data : [],
      };
    }),
  );
  return samples;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, languages, tags, stations, samples] = await Promise.all([
    loadFacets("countries"),
    loadFacets("languages"),
    loadFacets("tags"),
    collect(MAX_SITEMAP_STATIONS),
    sampleCountries(),
  ]);

  const base = siteUrl();
  const browse = [...sitemapPaths({ countries, languages, tags }), ...comboSitemapPaths(samples)];

  const entries: MetadataRoute.Sitemap = browse.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));

  // Station pages rank below the browse pages that link to them: there are far
  // more of them and each one is about a single station.
  for (const station of stationSitemapEntries(stations)) {
    entries.push({
      url: new URL(station.path, base).toString(),
      changeFrequency: "weekly",
      priority: 0.5,
      ...(station.lastModified ? { lastModified: station.lastModified } : {}),
    });
  }

  return entries;
}
