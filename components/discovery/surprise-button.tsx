"use client";

import { Loader2, Shuffle } from "lucide-react";
import Link from "next/link";
import { usePlayerStore } from "@/lib/player/store";
import { useTuner } from "@/lib/player/use-tuner";
import { countryFlag, countryName } from "@/lib/stations/display";

interface SurpriseButtonProps {
  variant?: "hero" | "compact";
}

/** Tunes to a random healthy station somewhere else in the world. */
export function SurpriseButton({ variant = "hero" }: SurpriseButtonProps) {
  const tuner = useTuner();

  const surprise = () =>
    tuner.tune(({ mode, heard }) => {
      const query = new URLSearchParams();
      const current = usePlayerStore.getState().station?.countryCode;
      if (current) query.set("not", current);
      if (mode !== "any") query.set("mode", mode);
      if (heard) query.set("heard", heard);
      return fetch(`/api/surprise?${query}`, { cache: "no-store" });
    }, "Couldn't find a surprise right now. Try again.");

  const icon = tuner.loading ? (
    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
  ) : (
    <Shuffle className="size-4" aria-hidden="true" />
  );

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={surprise}
        disabled={tuner.loading}
        aria-label="Surprise me: play a random station"
        title="Surprise me"
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-text disabled:opacity-60"
      >
        {icon}
        <span className="sr-only lg:not-sr-only">Surprise</span>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={surprise}
        disabled={tuner.loading}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-white backdrop-blur-sm hover:bg-white/10 disabled:opacity-70"
      >
        {icon}
        Surprise me
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-white/80">
        {tuner.error ? (
          <span className="text-[var(--accent-alt)]">{tuner.error}</span>
        ) : tuner.landed ? (
          <>
            {tuner.skipped > 0 && <>That one was off the air, so here is another. </>}
            You&apos;re in <span aria-hidden="true">
              {countryFlag(tuner.landed.countryCode)}
            </span>{" "}
            {countryName(tuner.landed.countryCode, tuner.landed.country)}:{" "}
            <Link href={`/station/${tuner.landed.id}`} className="underline underline-offset-4">
              {tuner.landed.name}
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
