import "server-only";

import { normalizeFacets, normalizeStations } from "@/lib/stations/normalize";
import { radioBrowserGet, type QueryValue } from "@/lib/stations/radio-browser-client";
import type { Facet, Station, StationProvider, StationQuery } from "@/lib/stations/types";
import { stationIdSchema } from "@/lib/stations/types";

const ORDER_MAP: Record<StationQuery["order"], { order: string; reverse: boolean }> = {
  popular: { order: "clickcount", reverse: true },
  votes: { order: "votes", reverse: true },
  name: { order: "name", reverse: false },
  random: { order: "random", reverse: false },
};

const SEARCH_TTL = 600;
const STATION_TTL = 3600;
const FACET_TTL = 86_400;

/** Map an internal query to Radio Browser `/json/stations/search` params. */
export function toSearchParams(query: StationQuery): Record<string, QueryValue> {
  const { order, reverse } = ORDER_MAP[query.order];
  return {
    name: query.text,
    countrycode: query.country,
    language: query.language,
    languageExact: query.language ? true : undefined,
    tag: query.tag,
    tagExact: query.tag ? true : undefined,
    order,
    reverse,
    limit: query.limit,
    offset: query.offset,
    hidebroken: true,
  };
}

export class RadioBrowserProvider implements StationProvider {
  async search(query: StationQuery): Promise<Station[]> {
    const raw = await radioBrowserGet("/json/stations/search", toSearchParams(query), {
      revalidate: query.order === "random" ? 0 : SEARCH_TTL,
    });
    return normalizeStations(raw);
  }

  async getById(id: string): Promise<Station | null> {
    if (!stationIdSchema.safeParse(id).success) return null;
    const raw = await radioBrowserGet(
      `/json/stations/byuuid/${id}`,
      {},
      { revalidate: STATION_TTL },
    );
    return normalizeStations(raw)[0] ?? null;
  }

  async getCountries(): Promise<Facet[]> {
    const raw = await radioBrowserGet(
      "/json/countries",
      { hidebroken: true },
      { revalidate: FACET_TTL },
    );
    return normalizeFacets(raw).filter((facet) => facet.code && /^[A-Z]{2}$/.test(facet.code));
  }

  async getLanguages(): Promise<Facet[]> {
    const raw = await radioBrowserGet(
      "/json/languages",
      { hidebroken: true },
      { revalidate: FACET_TTL },
    );
    return normalizeFacets(raw).map(({ name, stationCount }) => ({
      name: name.toLowerCase(),
      stationCount,
    }));
  }

  async getTags(limit = 100): Promise<Facet[]> {
    const raw = await radioBrowserGet(
      "/json/tags",
      { order: "stationcount", reverse: true, hidebroken: true, limit },
      { revalidate: FACET_TTL },
    );
    return normalizeFacets(raw).slice(0, limit);
  }

  async reportClick(id: string): Promise<void> {
    if (!stationIdSchema.safeParse(id).success) return;
    await radioBrowserGet(`/json/url/${id}`, {}, { revalidate: 0 });
  }
}
