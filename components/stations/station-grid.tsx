import type { ReactNode } from "react";
import { TunerCard } from "@/components/stations/tuner-card";
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
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-label={label}
    >
      {stations.map((station) => (
        <li key={station.id}>
          <TunerCard station={station} actions={renderActions?.(station)} />
        </li>
      ))}
    </ul>
  );
}

export function StationGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="animate-pulse overflow-hidden rounded-[var(--radius-tile)] bg-surface"
        >
          <div className="grille aspect-[4/3] bg-surface-strong" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 rounded bg-surface-strong" />
            <div className="h-3 w-1/2 rounded bg-surface-strong" />
          </div>
        </li>
      ))}
    </ul>
  );
}
