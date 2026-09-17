import { NextResponse } from "next/server";
import { PROVIDER_UNAVAILABLE, apiError, cacheFor, logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import { parseStationQuery, type Station } from "@/lib/stations/types";

export interface StationSearchResponse {
  stations: Station[];
}

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = parseStationQuery(params);
  if (!parsed.success) {
    return apiError(400, "Some search filters are invalid. Please adjust them and try again.");
  }

  try {
    const stations = await getStationProvider().search(parsed.data);
    return NextResponse.json<StationSearchResponse>(
      { stations },
      { headers: cacheFor(parsed.data.order === "random" ? 0 : 600) },
    );
  } catch (error) {
    logError("stations.search", error);
    return apiError(502, PROVIDER_UNAVAILABLE);
  }
}
