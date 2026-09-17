import "server-only";

import { cache } from "react";
import { logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import type { Facet, Station, StationQueryInput } from "@/lib/stations/types";
import { stationIdSchema, stationQuerySchema } from "@/lib/stations/types";

export type Loaded<T> = { ok: true; data: T } | { ok: false };

/** Search stations for server rendering without throwing. */
export async function loadStations(input: StationQueryInput): Promise<Loaded<Station[]>> {
  try {
    const data = await getStationProvider().search(stationQuerySchema.parse(input));
    return { ok: true, data };
  } catch (error) {
    logError("page.loadStations", error);
    return { ok: false };
  }
}

/** Load a facet list, returning an empty list on failure. */
export async function loadFacets(kind: "countries" | "languages" | "tags"): Promise<Facet[]> {
  const provider = getStationProvider();
  try {
    if (kind === "countries") return await provider.getCountries();
    if (kind === "languages") return await provider.getLanguages();
    return await provider.getTags(300);
  } catch (error) {
    logError(`page.loadFacets.${kind}`, error);
    return [];
  }
}

export type StationResult =
  { status: "found"; station: Station } | { status: "missing" } | { status: "error" };

/** Load one station, deduped per request so metadata and page share the fetch. */
export const loadStation = cache(async (id: string): Promise<StationResult> => {
  if (!stationIdSchema.safeParse(id).success) return { status: "missing" };
  try {
    const station = await getStationProvider().getById(id);
    return station ? { status: "found", station } : { status: "missing" };
  } catch (error) {
    logError("page.loadStation", error);
    return { status: "error" };
  }
});

/** Stations similar to `station`: same primary tag, then same country. */
export async function loadSimilarStations(station: Station, tag?: string, limit = 10) {
  const seen = new Set([station.id]);
  const results: Station[] = [];
  const add = (list: Station[]) => {
    for (const item of list) {
      if (results.length >= limit) break;
      if (!seen.has(item.id)) {
        seen.add(item.id);
        results.push(item);
      }
    }
  };
  if (tag) {
    const byTag = await loadStations({ tag, limit: limit + 1 });
    if (byTag.ok) add(byTag.data);
  }
  if (results.length < limit && station.countryCode) {
    const byCountry = await loadStations({ country: station.countryCode, limit: limit + 1 });
    if (byCountry.ok) add(byCountry.data);
  }
  return results;
}
