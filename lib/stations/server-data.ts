import "server-only";

import { logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import type { Facet, Station, StationQueryInput } from "@/lib/stations/types";
import { stationQuerySchema } from "@/lib/stations/types";

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
