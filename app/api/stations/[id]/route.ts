import { NextResponse } from "next/server";
import { PROVIDER_UNAVAILABLE, apiError, cacheFor, logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import { stationIdSchema, type Station } from "@/lib/stations/types";

export interface StationResponse {
  station: Station;
}

const NOT_FOUND = "We couldn't find that station.";

export async function GET(_request: Request, ctx: RouteContext<"/api/stations/[id]">) {
  const { id } = await ctx.params;
  if (!stationIdSchema.safeParse(id).success) return apiError(404, NOT_FOUND);

  try {
    const station = await getStationProvider().getById(id);
    if (!station) return apiError(404, NOT_FOUND);
    return NextResponse.json<StationResponse>({ station }, { headers: cacheFor(3600) });
  } catch (error) {
    logError("stations.getById", error);
    return apiError(502, PROVIDER_UNAVAILABLE);
  }
}
