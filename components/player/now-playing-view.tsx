"use client";

import {
  ChevronDown,
  ExternalLink,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { FavoriteButton } from "@/components/library/favorite-button";
import { StationArtwork } from "@/components/stations/station-artwork";
import { EqualizerBars } from "@/components/tuner/equalizer-bars";
import { FrequencyReadout } from "@/components/tuner/frequency-readout";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { atmosphereFor } from "@/lib/imagery/atmosphere";
import { usePlayerStore } from "@/lib/player/store";
import { useNowPlayingView } from "@/lib/player/view-store";
import { countryFlag, countryName, primaryTag } from "@/lib/stations/display";

export function NowPlayingView({ nowPlaying = null }: { nowPlaying?: string | null }) {
  const open = useNowPlayingView((s) => s.open);
  const hide = useNowPlayingView((s) => s.hide);
  const station = usePlayerStore((s) => s.station);
  const status = usePlayerStore((s) => s.status);
  const error = usePlayerStore((s) => s.error);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const dialogRef = useRef<HTMLDivElement>(null);

  const visible = open && Boolean(station);
  const onEscape = useCallback(() => hide(), [hide]);
  useFocusTrap(dialogRef, visible, onEscape);

  if (!visible || !station) return null;

  const { toggle, stop, setVolume, toggleMute } = usePlayerStore.getState();
  const busy = status === "loading" || status === "buffering";
  const playing = status === "playing";
  const active = playing || busy;
  const image = atmosphereFor(station);
  const tag = primaryTag(station);
  const country = countryName(station.countryCode, station.country);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="now-playing-title"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background text-white"
    >
      <div className="grain fixed inset-0 -z-0" style={{ backgroundColor: image.color }}>
        <Image
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/90" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/70 uppercase">
            <EqualizerBars active={playing} className="h-3" />
            {playing ? "On air" : busy ? "Tuning" : status === "error" ? "Signal lost" : "Paused"}
          </p>
          <button
            type="button"
            onClick={hide}
            data-autofocus
            aria-label="Close now playing"
            className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md hover:bg-white/10"
          >
            <ChevronDown className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 md:flex-row md:gap-14">
          {/* Record disc with the station artwork as its label. */}
          <div className="relative aspect-square w-64 shrink-0 sm:w-80" aria-hidden="true">
            <div
              className="disc absolute inset-0 rounded-full shadow-[0_30px_80px_rgb(0_0_0/0.6)]"
              data-spinning={playing}
              style={{
                background:
                  "repeating-radial-gradient(circle at center, #0d0c0b 0 2px, #1b1815 2px 4px)",
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgb(255_255_255/0.08)_40deg,transparent_90deg,transparent_180deg,rgb(255_255_255/0.06)_220deg,transparent_270deg)]" />
              <div className="absolute inset-[30%] overflow-hidden rounded-full ring-4 ring-black/60">
                <StationArtwork station={station} className="size-full rounded-full" />
              </div>
              <div className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-2 ring-white/30" />
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col items-center gap-5 text-center md:items-start md:text-left">
            <FrequencyReadout
              stationId={station.id}
              size="xl"
              className="text-[var(--accent-alt)] [&_span:last-child]:text-white/60"
            />
            <div className="space-y-2">
              <h2
                id="now-playing-title"
                className="text-3xl leading-tight font-semibold sm:text-4xl"
              >
                {station.name}
              </h2>
              <p className="text-white/75">
                {station.countryCode && (
                  <span className="mr-1.5" aria-hidden="true">
                    {countryFlag(station.countryCode)}
                  </span>
                )}
                {[
                  country,
                  tag,
                  station.codec && station.bitrate
                    ? `${station.codec} ${station.bitrate}k`
                    : station.codec,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {nowPlaying && playing && (
                <p className="font-mono text-sm text-white/85" data-testid="now-playing-title">
                  {nowPlaying}
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="text-[var(--accent-alt)]">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={stop}
                aria-label="Stop"
                className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md hover:bg-white/10"
              >
                <Square className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={toggle}
                aria-label={status === "error" ? "Try again" : active ? "Pause" : "Play"}
                className="flex size-20 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-[0_0_40px_color-mix(in_oklab,var(--accent)_50%,transparent)] transition hover:scale-105"
              >
                {status === "error" ? (
                  <RotateCcw className="size-7" aria-hidden="true" />
                ) : busy ? (
                  <Loader2 className="size-7 animate-spin" aria-hidden="true" />
                ) : active ? (
                  <Pause className="size-7" aria-hidden="true" />
                ) : (
                  <Play className="size-7 translate-x-0.5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                aria-pressed={muted}
                className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md hover:bg-white/10"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="size-5" aria-hidden="true" />
                ) : (
                  <Volume2 className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>

            <label className="flex w-full max-w-xs items-center gap-3 text-xs text-white/60">
              <span className="font-mono uppercase">Vol</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Volume"
                className="w-full accent-[var(--accent)]"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <FavoriteButton station={station} variant="glass" />
              <Link
                href={`/station/${station.id}`}
                onClick={hide}
                className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/10"
              >
                Station details
              </Link>
              {station.homepageUrl && (
                <a
                  href={station.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/10"
                >
                  Website
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/45">
          Photo by{" "}
          <a
            href={image.credit.photoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {image.credit.photographer}
          </a>{" "}
          on Unsplash
        </p>
      </div>
    </div>
  );
}
