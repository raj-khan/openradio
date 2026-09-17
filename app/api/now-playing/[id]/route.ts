import { NextResponse } from "next/server";
import { apiError, logError } from "@/lib/api/responses";
import { fetchNowPlaying } from "@/lib/now-playing/fetch-title";
import { clientKey, createRateLimiter, retryAfterSeconds } from "@/lib/security/rate-limit";
import { getStationProvider } from "@/lib/stations";
import { stationIdSchema } from "@/lib/stations/types";

export interface NowPlayingResponse {
  title: string | null;
}

const limiter = createRateLimiter({ limit: 30, windowMs: 60_000 });

/**
 * Now playing text for a known station. The stream URL always comes from the
 * station directory, never from the client.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/now-playing/[id]">) {
  const { id } = await ctx.params;
  if (!stationIdSchema.safeParse(id).success)
    return apiError(404, "We couldn't find that station.");

  const limit = limiter(clientKey(request));
  if (!limit.ok) {
    return apiError(429, "Too many requests. Please slow down.", {
      "Retry-After": String(retryAfterSeconds(limit)),
    });
  }

  try {
    const station = await getStationProvider().getById(id);
    if (!station) return apiError(404, "We couldn't find that station.");
    const title = await fetchNowPlaying(station);
    return NextResponse.json<NowPlayingResponse>(
      { title },
      { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } },
    );
  } catch (error) {
    logError("nowPlaying", error);
    return NextResponse.json<NowPlayingResponse>(
      { title: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
