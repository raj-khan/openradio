"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { StationGrid } from "@/components/stations/station-grid";
import { filtersToQueryString, type StationFilters } from "@/lib/stations/query-string";
import type { Station } from "@/lib/stations/types";

interface SearchResultsProps {
  initialStations: Station[];
  filters: StationFilters;
  pageSize: number;
}

export function SearchResults({ initialStations, filters, pageSize }: SearchResultsProps) {
  const [stations, setStations] = useState(initialStations);
  const [hasMore, setHasMore] = useState(
    initialStations.length === pageSize && filters.order !== "random",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = filtersToQueryString(filters, { limit: pageSize, offset: stations.length });
      const response = await fetch(`/api/stations?${qs}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      const next: Station[] = body.stations;
      const known = new Set(stations.map((s) => s.id));
      setStations([...stations, ...next.filter((s) => !known.has(s.id))]);
      setHasMore(next.length === pageSize);
    } catch {
      setError("Couldn't load more stations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <StationGrid
        stations={stations}
        label="Search results"
        empty="No stations match these filters. Try a broader search."
      />
      {error && (
        <p role="alert" className="text-center text-sm text-accent-alt">
          {error}
        </p>
      )}
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-surface disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Load more stations
          </button>
        </div>
      )}
    </div>
  );
}
