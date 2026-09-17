"use client";

import { Loader2, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { StationArtwork } from "@/components/stations/station-artwork";
import { EqualizerBars } from "@/components/tuner/equalizer-bars";
import { FrequencyReadout } from "@/components/tuner/frequency-readout";
import type { PlayerStatus } from "@/lib/player/machine";
import { usePlayerStore } from "@/lib/player/store";
import { useNowPlayingView } from "@/lib/player/view-store";
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
          data-status={status}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Tuning scale along the top edge; the needle glows while on air. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-px h-2 bg-[repeating-linear-gradient(to_right,var(--border)_0_1px,transparent_1px_12px)] opacity-70"
          />
          <div
            aria-hidden="true"
            className={`absolute -top-1 left-1/2 h-3 w-[2px] -translate-x-1/2 transition-colors ${
              status === "playing" ? "bg-accent shadow-[0_0_10px_var(--accent)]" : "bg-muted"
            }`}
          />
          <div
            aria-hidden="true"
            className="grille pointer-events-none absolute inset-0 opacity-60"
          />
          <div className="relative mx-auto flex h-[5.5rem] w-full max-w-6xl items-center gap-3 px-4">
            <button
              type="button"
              onClick={useNowPlayingView.getState().show}
              aria-label={`Open now playing: ${station.name}`}
              aria-haspopup="dialog"
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
            >
              <StationArtwork
                station={station}
                className="size-12 shadow-[0_6px_20px_rgb(0_0_0/0.5)] ring-1 ring-border"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-mono text-[11px] text-muted">
                  <FrequencyReadout stationId={station.id} size="sm" className="text-accent-alt" />
                  <EqualizerBars active={status === "playing"} className="h-2.5" />
                </p>
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
                    <>{nowPlaying && status === "playing" ? nowPlaying : STATUS_TEXT[status]}</>
                  )}
                </p>
              </div>
            </button>

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
                className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_40%,transparent),inset_0_-3px_0_rgb(0_0_0/0.25)] transition-transform hover:scale-105"
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
