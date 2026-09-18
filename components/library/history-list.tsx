"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FavoriteButton } from "@/components/library/favorite-button";
import { StationCard } from "@/components/stations/station-card";
import { StationGridSkeleton } from "@/components/stations/station-grid";
import { useHistory, relativeTime } from "@/lib/library/history";
import { useHydrated } from "@/lib/library/hydration";

export function HistoryList() {
  const hydrated = useHydrated(useHistory);
  const entries = useHistory((s) => s.entries);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!hydrated) return <StationGridSkeleton count={5} />;

  if (entries.length === 0) {
    return (
      <div className="rounded-[var(--radius-tile)] border border-dashed border-border p-8 text-center text-muted">
        Nothing in the logbook yet. Stations you play show up here.{" "}
        <Link href="/" className="text-text underline underline-offset-4">
          Start tuning
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex max-w-3xl justify-end">
        <button
          type="button"
          onClick={() => useHistory.getState().clear()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-accent hover:text-text"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear history
        </button>
      </div>
      <h2 className="sr-only">Recently played stations</h2>
      <ol className="grid max-w-3xl gap-2" aria-label="Recently played">
        {entries.map(({ station, playedAt }) => (
          // The timestamp sits above the card on a phone: as a fixed side
          // gutter it took a fifth of the width and squeezed names to "CAPI...".
          <li
            key={station.id}
            className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
          >
            <time
              dateTime={new Date(playedAt).toISOString()}
              className="font-mono text-[11px] text-muted uppercase sm:w-20 sm:shrink-0 sm:text-right"
            >
              {relativeTime(playedAt, now)}
            </time>
            <div className="min-w-0 flex-1">
              <StationCard station={station} actions={<FavoriteButton station={station} />} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
