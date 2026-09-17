import { NextResponse } from "next/server";
import { PROVIDER_UNAVAILABLE, apiError, cacheFor, logError } from "@/lib/api/responses";
import type { Facet } from "@/lib/stations/types";

export interface FacetResponse {
  items: Facet[];
}

export const FACET_CACHE_SECONDS = 86_400;

/** Shared handler body for facet endpoints. */
export async function facetResponse(operation: string, load: () => Promise<Facet[]>) {
  try {
    const items = await load();
    return NextResponse.json<FacetResponse>({ items }, { headers: cacheFor(FACET_CACHE_SECONDS) });
  } catch (error) {
    logError(operation, error);
    return apiError(502, PROVIDER_UNAVAILABLE);
  }
}
