"use client";

import { Loader2, Shuffle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useListeningMode } from "@/lib/library/listening-mode-store";
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
  const [skipped, setSkipped] = useState(0);
  // Fallbacks from the API, used when a station dies after we hand it over.
  const alternatesRef = useRef<Station[]>([]);

  const tune = (station: Station) => {
    setLanded(station);
    usePlayerStore.getState().play(station);
  };

  /*
   * The server hands us a station it just heard answer, but a stream can still
   * fail in the browser: geo-blocked, CORS, a codec this device lacks, or it
   * drops in the second between the probe and the play. Rather than leaving the
   * listener on a dead end, move to the next candidate we were given.
   */
  useEffect(() => {
    if (!landed) return;
    return usePlayerStore.subscribe((state) => {
      if (state.status !== "error" || state.station?.id !== landed.id) return;
      const next = alternatesRef.current.shift();
      if (!next) return; // Out of candidates: the player's own error stands.
      setSkipped((count) => count + 1);
      tune(next);
    });
  }, [landed]);

  const surprise = async () => {
    setLoading(true);
    setError(null);
    setSkipped(0);
    alternatesRef.current = [];
    try {
      const current = usePlayerStore.getState().station?.countryCode;
      const query = new URLSearchParams();
      if (current) query.set("not", current);
      const mode = useListeningMode.getState().mode;
      if (mode !== "any") query.set("mode", mode);
      const response = await fetch(`/api/surprise?${query}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      alternatesRef.current = body.alternates ?? [];
      tune(body.station);
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
            {skipped > 0 && <>That one was off the air, so here is another. </>}
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
