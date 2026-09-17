import { facetResponse } from "@/lib/api/facets";
import { getStationProvider } from "@/lib/stations";

export function GET() {
  return facetResponse("facets.languages", () => getStationProvider().getLanguages());
}
