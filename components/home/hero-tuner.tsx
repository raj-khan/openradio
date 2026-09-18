"use client";

import { ArrowRight, Loader2, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DiscoverForm } from "@/components/discover/discover-form";
import { ListeningModeToggle } from "@/components/discovery/listening-mode-toggle";
import { CountryPicker } from "@/components/discovery/country-picker";
import { SurpriseButton } from "@/components/discovery/surprise-button";
import { FrequencyDial } from "@/components/tuner/frequency-dial";
import { EqualizerBars } from "@/components/tuner/equalizer-bars";
import type { Place } from "@/lib/imagery/catalog";
import type { Facet } from "@/lib/stations/types";
import { usePlayerStore } from "@/lib/player/store";
import { useTuner } from "@/lib/player/use-tuner";
import { countryFlag, countryName } from "@/lib/stations/display";
import { stationFrequency } from "@/lib/tuner/frequency";

interface HeroTunerProps {
  places: Place[];
  counts: Record<string, number>;
  /** Every country in the directory, for the picker behind "All countries". */
  countries: Facet[];
}

export function HeroTuner({ places, counts, countries }: HeroTunerProps) {
  const [index, setIndex] = useState(0);
  const tuner = useTuner();
  const playing = usePlayerStore((s) => s.status === "playing");
  const currentCountry = usePlayerStore((s) => s.station?.countryCode);

  const place = places[index];
  const count = counts[place.countryCode];
  const onAir = playing && currentCountry === place.countryCode;

  const tuneIn = () =>
    tuner.tune((mode) => {
      const query = new URLSearchParams({ country: place.countryCode });
      if (mode !== "any") query.set("mode", mode);
      // Same endpoint Surprise uses, so the dial gets the same reachability
      // check and the same list of alternates to fall back on.
      return fetch(`/api/surprise?${query}`, { cache: "no-store" });
    }, `Couldn't find a live station in ${place.city} right now. Try another place.`);

  const visible = new Set([index - 1, index, index + 1]);

  return (
    <section
      aria-label="Tune the world"
      className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden"
    >
      {/* Atmosphere: current place photo crossfades as you tune. */}
      <div className="grain absolute inset-0 -z-10" style={{ backgroundColor: place.image.color }}>
        {places.map((p, i) =>
          visible.has(i) ? (
            <Image
              key={p.slug}
              src={p.image.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end gap-8 px-4 pt-10 pb-6 sm:justify-center">
        <div className="max-w-2xl space-y-5 text-white">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-white/70 uppercase">
            <EqualizerBars active={onAir} className="h-3" />
            {onAir ? "On air" : "Live radio from everywhere"}
          </p>
          <h1 className="text-5xl leading-[0.95] font-semibold sm:text-7xl">
            Tune the
            <br />
            world.
          </h1>

          <div aria-live="polite" className="space-y-1">
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-3xl tracking-[-0.06em] text-[var(--accent-alt)] tabular-nums sm:text-4xl">
                {stationFrequency(place.slug)}
              </span>
              <span className="font-mono text-xs text-white/60">MHz</span>
            </p>
            <p className="font-display text-2xl font-semibold sm:text-3xl">
              <span aria-hidden="true" className="mr-2">
                {countryFlag(place.countryCode)}
              </span>
              {place.city}, {countryName(place.countryCode)}
            </p>
            {count !== undefined && (
              <p className="text-sm text-white/70">{count.toLocaleString("en")} live stations</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={tuneIn}
              disabled={tuner.loading}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-medium text-accent-contrast shadow-[0_0_30px_color-mix(in_oklab,var(--accent)_45%,transparent)] transition hover:scale-[1.02] disabled:opacity-70"
            >
              {tuner.loading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="size-5" aria-hidden="true" />
              )}
              Tune in to {place.city}
            </button>
            <Link
              href={`/country/${place.countryCode.toLowerCase()}`}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-white backdrop-blur-sm hover:bg-white/10"
            >
              Explore stations
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <CountryPicker countries={countries} />
          </div>
          <ListeningModeToggle />
          <SurpriseButton />
          {tuner.error && (
            <p role="alert" className="text-sm text-[var(--accent-alt)]">
              {tuner.error}
            </p>
          )}
          {tuner.skipped > 0 && !tuner.error && (
            <p aria-live="polite" className="text-sm text-white/70">
              {tuner.skipped === 1
                ? "That one was off the air, so here is another."
                : `Stepped past ${tuner.skipped} stations that were off the air.`}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <FrequencyDial
            entries={places.map((p) => ({
              id: p.slug,
              label: p.city,
              sublabel: stationFrequency(p.slug),
            }))}
            value={index}
            onChange={setIndex}
            label="Tune to a city"
            className="[&_.dial-surface]:border-white/15 [&_.dial-surface]:bg-black/45 [&_.dial-surface]:backdrop-blur-md"
          />
          <DiscoverForm />
        </div>
      </div>
    </section>
  );
}
