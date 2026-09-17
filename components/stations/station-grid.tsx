import type { ReactNode } from "react";
import { StationCard } from "@/components/stations/station-card";
import type { Station } from "@/lib/stations/types";

interface StationGridProps {
  stations: Station[];
  /** Shown when there are no stations. */
  empty?: ReactNode;
  /** Render extra controls for each card. */
  renderActions?: (station: Station) => ReactNode;
  label?: string;
}

export function StationGrid({ stations, empty, renderActions, label }: StationGridProps) {
  if (stations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
        {empty ?? "No stations found."}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" aria-label={label}>
      {stations.map((station) => (
        <li key={station.id}>
          <StationCard station={station} actions={renderActions?.(station)} />
        </li>
      ))}
    </ul>
  );
}

export function StationGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="flex h-20 animate-pulse items-center gap-3 rounded-2xl bg-surface/70 p-3"
        >
          <div className="size-14 rounded-xl bg-surface-strong" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-surface-strong" />
            <div className="h-3 w-1/3 rounded bg-surface-strong" />
          </div>
        </li>
      ))}
    </ul>
  );
}
