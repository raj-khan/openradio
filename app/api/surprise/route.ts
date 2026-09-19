import { NextResponse } from "next/server";
import { PROVIDER_UNAVAILABLE, apiError, logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import { dominantLanguage } from "@/lib/stations/languages";
import { isListeningMode, MODE_LABELS, type ListeningMode } from "@/lib/stations/listening-mode";
import { firstReachable } from "@/lib/stations/stream-probe";
import { pickRandom, shuffle, surpriseCandidates } from "@/lib/stations/surprise";
import { MAX_LIMIT, stationQuerySchema, type Station } from "@/lib/stations/types";

const SURPRISE_POOL = 4000;
/** Handed to the client so a station that dies mid-connect can be skipped there. */
const MAX_ALTERNATES = 4;

export interface SurpriseResponse {
  station: Station;
  /** Fallbacks, best first, for when the chosen station fails in the browser. */
  alternates: Station[];
  /**
   * Set when the chosen country had nothing of the kind asked for and the
   * search widened to its language. The listener asked for one place and is
   * being given another, so the UI has to say so rather than quietly swap it.
   */
  widenedTo?: { language: string };
}

/**
 * A healthy station, checked against its own stream before we hand it over.
 *
 * `?country=BD` keeps to one place, which is how the home dial asks; without it
 * the choice is drawn from anywhere. `?not=JP` prefers somewhere other than that
 * country, and `?mode=talk` asks for voices rather than music.
 *
 * The dial used to take its pick straight from the station search, so a dead
 * stream cost the listener the full load timeout with nothing to fall back to.
 * Routing it through here means one probe and one skip list for both callers.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const not = params.get("not")?.toUpperCase();
  const exclude = not && /^[A-Z]{2}$/.test(not) ? not : undefined;
  const wanted = params.get("country")?.toUpperCase();
  const country = wanted && /^[A-Z]{2}$/.test(wanted) ? wanted : undefined;
  const requested = params.get("mode");
  const mode: ListeningMode = isListeningMode(requested) ? requested : "any";

  try {
    const stations = country
      ? // One place, so take the whole page the directory will serve.
        await getStationProvider().search(
          stationQuerySchema.parse({ country, order: "popular", limit: MAX_LIMIT }),
        )
      : // Radio Browser caches order=random, so jump to a random page of the
        // popular list instead: varied, and still stations people listen to.
        await getStationProvider().search(
          stationQuerySchema.parse({
            order: "popular",
            limit: 40,
            offset: Math.floor(Math.random() * SURPRISE_POOL),
          }),
        );

    // Within one country the mode is a promise, not a preference: being handed
    // music after asking for voices hides the gap instead of reporting it.
    let candidates = shuffle(
      country
        ? surpriseCandidates(stations, undefined, mode, false)
        : surpriseCandidates(stations, exclude, mode),
    );

    /*
     * Nothing of that kind there. Before refusing, try the country's own
     * language somewhere else: 27% of countries with stations have no voice
     * radio on file at all, and for a fifth of those the language finds real
     * ones (Burkina Faso to French, Kosovo to Albanian, San Marino to Italian).
     * Where no language clearly speaks for the country the refusal stands,
     * which is why most tiny territories keep it.
     */
    let widenedTo: SurpriseResponse["widenedTo"];
    if (country && mode !== "any" && candidates.length === 0) {
      const language = dominantLanguage(stations);
      if (language) {
        const spoken = await getStationProvider().search(
          stationQuerySchema.parse({ language, order: "popular", limit: MAX_LIMIT }),
        );
        const widened = surpriseCandidates(spoken, country, mode, false);
        if (widened.length > 0) {
          candidates = shuffle(widened);
          widenedTo = { language };
        }
      }
    }

    if (candidates.length === 0) {
      const label = MODE_LABELS[mode].toLowerCase();
      return apiError(
        404,
        country && mode !== "any"
          ? `No ${label} stations there right now. Try another place, or switch to Anything.`
          : "Couldn't find a station right now. Try again.",
      );
    }

    // Prefer one that answers right now; lastCheckOk alone is often out of date.
    const station = (await firstReachable(candidates)) ?? pickRandom(candidates);
    if (!station) return apiError(404, "Couldn't find a station right now. Try again.");

    return NextResponse.json<SurpriseResponse>(
      {
        station,
        alternates: candidates.filter((s) => s.id !== station.id).slice(0, MAX_ALTERNATES),
        ...(widenedTo ? { widenedTo } : {}),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logError("surprise", error);
    return apiError(502, PROVIDER_UNAVAILABLE);
  }
}
