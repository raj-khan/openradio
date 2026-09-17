"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PlayButton } from "@/components/stations/play-button";
import { StationArtwork } from "@/components/stations/station-artwork";
import { EqualizerBars } from "@/components/tuner/equalizer-bars";
import { FrequencyReadout } from "@/components/tuner/frequency-readout";
import { usePlayerStore } from "@/lib/player/store";
import { countryFlag, countryName, primaryTag } from "@/lib/stations/display";
import type { Station } from "@/lib/stations/types";

interface TunerCardProps {
  station: Station;
  actions?: ReactNode;
}

/** Station tile styled like a radio preset: frequency, artwork label, play knob. */
export function TunerCard({ station, actions }: TunerCardProps) {
  const current = usePlayerStore((s) => s.station?.id === station.id);
  const playing = usePlayerStore((s) => s.station?.id === station.id && s.status === "playing");
  const tag = primaryTag(station);
  const quality = [station.codec, station.bitrate ? `${station.bitrate}k` : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-tile)] border bg-surface transition-colors ${
        current ? "border-accent/70" : "border-border/70 hover:border-border"
      }`}
    >
      <div className="grille relative flex aspect-[4/3] items-start justify-center bg-surface-strong pt-9 sm:items-center sm:pt-0">
        <div className="absolute inset-x-3 top-3 flex items-center justify-between text-muted">
          <FrequencyReadout stationId={station.id} size="sm" />
          {current ? (
            <EqualizerBars active={playing} className="h-3.5" />
          ) : (
            quality && <span className="font-mono text-[10px] uppercase">{quality}</span>
          )}
        </div>
        <StationArtwork
          station={station}
          className="size-14 rounded-2xl shadow-[0_8px_30px_rgb(0_0_0/0.45)] transition-transform group-hover:scale-105 sm:size-20 lg:size-24"
        />
        <div className="absolute right-2 bottom-2 z-10 flex items-center gap-1 sm:right-3 sm:bottom-3">
          {actions}
          <PlayButton station={station} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 leading-snug font-medium">
          <Link
            href={`/station/${station.id}`}
            prefetch={false}
            className="rounded outline-offset-2 after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {station.name}
          </Link>
        </h3>
        <p className="truncate text-xs text-muted">
          {station.countryCode && (
            <span className="mr-1" aria-hidden="true">
              {countryFlag(station.countryCode)}
            </span>
          )}
          {countryName(station.countryCode, station.country) ?? "Worldwide"}
          {tag && <span> · {tag}</span>}
        </p>
      </div>
    </article>
  );
}
