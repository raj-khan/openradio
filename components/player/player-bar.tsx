"use client";

import { Loader2, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { StationArtwork } from "@/components/stations/station-artwork";
import type { PlayerStatus } from "@/lib/player/machine";
import { usePlayerStore } from "@/lib/player/store";
import { countryFlag } from "@/lib/stations/display";

const PLAYER_SPACE = "5.5rem";

const STATUS_TEXT: Record<PlayerStatus, string> = {
  idle: "",
  loading: "Connecting…",
  buffering: "Buffering…",
  playing: "Live",
  paused: "Paused",
  error: "",
};

export function PlayerBar({ nowPlaying }: { nowPlaying?: ReactNode }) {
  const station = usePlayerStore((s) => s.station);
  const status = usePlayerStore((s) => s.status);
  const error = usePlayerStore((s) => s.error);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const { toggle, stop, setVolume, toggleMute } = usePlayerStore.getState();

  const visible = Boolean(station);

  useEffect(() => {
    document.documentElement.style.setProperty("--player-space", visible ? PLAYER_SPACE : "0px");
  }, [visible]);

  const announcement =
    station && status !== "idle"
      ? status === "error"
        ? `${station.name}: ${error}`
        : `${station.name}: ${STATUS_TEXT[status]}`
      : "";

  const busy = status === "loading" || status === "buffering";
  const playing = status === "playing" || busy;

  return (
    <>
      <p className="sr-only" aria-live="polite" role="status">
        {announcement}
      </p>
      {station && (
        <section
          aria-label="Player"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-surface/90 backdrop-blur-xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex h-[5.5rem] w-full max-w-6xl items-center gap-3 px-4">
            <Link
              href={`/station/${station.id}`}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg"
            >
              <StationArtwork station={station} className="size-12" />
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {station.countryCode && (
                    <span className="mr-1.5" aria-hidden="true">
                      {countryFlag(station.countryCode)}
                    </span>
                  )}
                  {station.name}
                </p>
                <p className="truncate text-sm text-muted" data-testid="player-status">
                  {status === "error" ? (
                    <span className="text-accent-alt">{error}</span>
                  ) : (
                    <>
                      {status === "playing" && (
                        <span className="mr-1.5 inline-block size-2 rounded-full bg-accent align-middle" />
                      )}
                      {nowPlaying && status === "playing" ? nowPlaying : STATUS_TEXT[status]}
                    </>
                  )}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                  className="rounded-full p-2 text-muted hover:text-text"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="size-5" aria-hidden="true" />
                  ) : (
                    <Volume2 className="size-5" aria-hidden="true" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  aria-label="Volume"
                  className="w-24 accent-[var(--accent)]"
                />
              </div>

              <button
                type="button"
                onClick={toggle}
                aria-label={
                  status === "error"
                    ? "Try again"
                    : playing
                      ? `Pause ${station.name}`
                      : `Play ${station.name}`
                }
                className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-contrast transition-transform hover:scale-105"
              >
                {status === "error" ? (
                  <RotateCcw className="size-5" aria-hidden="true" />
                ) : busy ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : playing ? (
                  <Pause className="size-5" aria-hidden="true" />
                ) : (
                  <Play className="size-5 translate-x-px" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={stop}
                aria-label="Close player"
                className="rounded-full p-2 text-muted hover:text-text"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
