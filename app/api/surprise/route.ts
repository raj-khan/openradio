import { NextResponse } from "next/server";
import { PROVIDER_UNAVAILABLE, apiError, logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import { firstReachable } from "@/lib/stations/stream-probe";
import { pickRandom, shuffle, surpriseCandidates } from "@/lib/stations/surprise";
import { stationQuerySchema, type Station } from "@/lib/stations/types";

const SURPRISE_POOL = 4000;
/** Handed to the client so a station that dies mid-connect can be skipped there. */
const MAX_ALTERNATES = 4;

export interface SurpriseResponse {
  station: Station;
  /** Fallbacks, best first, for when the chosen station fails in the browser. */
  alternates: Station[];
}

/** A random, healthy station. `?not=JP` prefers somewhere other than that country. */
export async function GET(request: Request) {
  const not = new URL(request.url).searchParams.get("not")?.toUpperCase();
  const exclude = not && /^[A-Z]{2}$/.test(not) ? not : undefined;

  try {
    // Radio Browser caches order=random results, so jump to a random page of the
    // popular list instead: varied, and still stations people actually listen to.
    const offset = Math.floor(Math.random() * SURPRISE_POOL);
    const stations = await getStationProvider().search(
      stationQuerySchema.parse({ order: "popular", limit: 40, offset }),
    );
    const candidates = shuffle(surpriseCandidates(stations, exclude));
    // Prefer one that answers right now; lastCheckOk alone is often out of date.
    const station = (await firstReachable(candidates)) ?? pickRandom(candidates);
    if (!station) return apiError(404, "Couldn't find a surprise right now. Try again.");
    return NextResponse.json<SurpriseResponse>(
      {
        station,
        alternates: candidates.filter((s) => s.id !== station.id).slice(0, MAX_ALTERNATES),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logError("surprise", error);
    return apiError(502, PROVIDER_UNAVAILABLE);
  }
}
