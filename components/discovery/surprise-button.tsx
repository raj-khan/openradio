"use client";

import { Loader2, Shuffle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePlayerStore } from "@/lib/player/store";
import { countryFlag, countryName } from "@/lib/stations/display";
import type { Station } from "@/lib/stations/types";

interface SurpriseButtonProps {
  variant?: "hero" | "compact";
}

/** Tunes to a random healthy station somewhere else in the world. */
export function SurpriseButton({ variant = "hero" }: SurpriseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [landed, setLanded] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);

  const surprise = async () => {
    setLoading(true);
    setError(null);
    try {
      const current = usePlayerStore.getState().station?.countryCode;
      const response = await fetch(`/api/surprise${current ? `?not=${current}` : ""}`, {
        cache: "no-store",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      usePlayerStore.getState().play(body.station);
      setLanded(body.station);
    } catch {
      setError("Couldn't find a surprise right now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const icon = loading ? (
    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
  ) : (
    <Shuffle className="size-4" aria-hidden="true" />
  );

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={surprise}
        disabled={loading}
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
        disabled={loading}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-white backdrop-blur-sm hover:bg-white/10 disabled:opacity-70"
      >
        {icon}
        Surprise me
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-white/80">
        {error ? (
          <span className="text-[var(--accent-alt)]">{error}</span>
        ) : landed ? (
          <>
            You&apos;re in <span aria-hidden="true">{countryFlag(landed.countryCode)}</span>{" "}
            {countryName(landed.countryCode, landed.country)}:{" "}
            <Link href={`/station/${landed.id}`} className="underline underline-offset-4">
              {landed.name}
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
