import Link from "next/link";
import type { ReactNode } from "react";
import { PlayButton } from "@/components/stations/play-button";
import { StationArtwork } from "@/components/stations/station-artwork";
import { countryFlag, stationSubtitle } from "@/lib/stations/display";
import type { Station } from "@/lib/stations/types";

interface StationCardProps {
  station: Station;
  /** Extra controls, e.g. a favorite toggle. */
  actions?: ReactNode;
}

export function StationCard({ station, actions }: StationCardProps) {
  const subtitle = stationSubtitle(station);

  return (
    <article className="group relative flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/70 p-3 transition-colors hover:border-border hover:bg-surface">
      <StationArtwork station={station} className="size-14" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">
          <Link
            href={`/station/${station.id}`}
            className="rounded outline-offset-4 hover:underline"
            prefetch={false}
          >
            {station.countryCode && (
              <span className="mr-1.5" aria-hidden="true">
                {countryFlag(station.countryCode)}
              </span>
            )}
            {station.name}
          </Link>
        </h3>
        {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        {station.tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1" aria-label="Tags">
            {station.tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tag/${encodeURIComponent(tag)}`}
                  prefetch={false}
                  className="block max-w-32 truncate rounded-full bg-surface-strong px-2 py-0.5 text-xs text-muted hover:text-text"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-1">
        {actions}
        <PlayButton station={station} />
      </div>
    </article>
  );
}
