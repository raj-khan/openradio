import { after } from "next/server";
import { apiError, logError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";
import { stationIdSchema } from "@/lib/stations/types";

/**
 * Report a play to Radio Browser, as its API guidelines ask. The report runs
 * after the response is sent so it can never delay playback.
 */
export async function POST(_request: Request, ctx: RouteContext<"/api/stations/[id]/click">) {
  const { id } = await ctx.params;
  if (!stationIdSchema.safeParse(id).success) {
    return apiError(404, "We couldn't find that station.");
  }

  after(async () => {
    try {
      await getStationProvider().reportClick(id);
    } catch (error) {
      logError("stations.reportClick", error);
    }
  });

  return new Response(null, { status: 202, headers: { "Cache-Control": "no-store" } });
}
