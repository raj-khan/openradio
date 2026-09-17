import type { StationQuery } from "@/lib/stations/types";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Take the first value of each search param. */
export function firstValues(params: SearchParamsRecord): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) result[key] = first;
  }
  return result;
}

const FILTER_KEYS = ["text", "country", "language", "tag", "order"] as const;
export type StationFilters = Partial<Pick<StationQuery, (typeof FILTER_KEYS)[number]>>;

/** Serialize filters to a query string, omitting empty values and the default order. */
export function filtersToQueryString(
  filters: StationFilters,
  extra: Record<string, string | number | undefined> = {},
): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (!value) continue;
    if (key === "order" && value === "popular") continue;
    params.set(key, value);
  }
  for (const [key, value] of Object.entries(extra)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  return params.toString();
}

export function hasFilters(filters: StationFilters) {
  return Boolean(filters.text || filters.country || filters.language || filters.tag);
}
