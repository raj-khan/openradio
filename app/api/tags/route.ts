import { z } from "zod";
import { facetResponse } from "@/lib/api/facets";
import { apiError } from "@/lib/api/responses";
import { getStationProvider } from "@/lib/stations";

const limitSchema = z.coerce.number().int().min(1).max(500).default(100);

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("limit") ?? undefined;
  const limit = limitSchema.safeParse(raw);
  if (!limit.success) return apiError(400, "The tag limit must be between 1 and 500.");

  return facetResponse("facets.tags", () => getStationProvider().getTags(limit.data));
}
