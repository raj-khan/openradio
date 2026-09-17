"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { usePlayerStore } from "@/lib/player/store";
import type { Station } from "@/lib/stations/types";

interface PlayButtonProps {
  station: Station;
  size?: "md" | "lg";
  className?: string;
}

/** Play or pause a specific station, reflecting its state in the global player. */
export function PlayButton({ station, size = "md", className = "" }: PlayButtonProps) {
  const isCurrent = usePlayerStore((s) => s.station?.id === station.id);
  const status = usePlayerStore((s) => (s.station?.id === station.id ? s.status : "idle"));

  const busy = isCurrent && (status === "loading" || status === "buffering");
  const playing = isCurrent && (status === "playing" || busy);

  const onClick = () => {
    const player = usePlayerStore.getState();
    if (playing) player.pause();
    else player.play(station);
  };

  const dimension = size === "lg" ? "size-14" : "size-10";
  const icon = size === "lg" ? "size-6" : "size-4";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${playing ? "Pause" : "Play"} ${station.name}`}
      aria-pressed={playing}
      className={`flex shrink-0 items-center justify-center rounded-full transition ${dimension} ${
        playing || size === "lg"
          ? "bg-accent text-accent-contrast shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_40%,transparent)]"
          : "bg-surface-strong text-text hover:bg-accent hover:text-accent-contrast"
      } ${className}`}
    >
      {busy ? (
        <Loader2 className={`${icon} animate-spin`} aria-hidden="true" />
      ) : playing ? (
        <Pause className={icon} aria-hidden="true" />
      ) : (
        <Play className={`${icon} translate-x-px`} aria-hidden="true" />
      )}
    </button>
  );
}
