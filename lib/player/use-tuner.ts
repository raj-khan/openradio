"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useListeningMode } from "@/lib/library/listening-mode-store";
import { usePlayerStore } from "@/lib/player/store";
import type { Station } from "@/lib/stations/types";

/*
 * Asking for a station and actually getting one playing.
 *
 * The server hands back a station it just heard answer, plus alternates. A
 * stream can still fail in the browser for reasons the server cannot see:
 * geo-blocked, CORS, a codec this device lacks, or it simply drops in the
 * second between the probe and the play. Both the Surprise button and the home
 * dial need that same recovery, so it lives here rather than in each of them.
 */

export interface TuneResult {
  station: Station;
  alternates: Station[];
  /** Set when the country asked for had none and the search widened. */
  widenedTo?: { language: string };
}

interface TunerState {
  /** The station currently being offered, once one is playing or trying. */
  landed: Station | null;
  /** How many dead stations were stepped over to get here. */
  skipped: number;
  /** Set when the station came from outside the country that was asked for. */
  widenedTo: { language: string } | null;
  loading: boolean;
  error: string | null;
}

export function useTuner() {
  const [state, setState] = useState<TunerState>({
    landed: null,
    skipped: 0,
    widenedTo: null,
    loading: false,
    error: null,
  });
  const alternatesRef = useRef<Station[]>([]);

  const play = useCallback((station: Station) => {
    setState((prev) => ({ ...prev, landed: station, error: null }));
    usePlayerStore.getState().play(station);
  }, []);

  // Watch the station we handed over, and move on if it fails to play.
  useEffect(() => {
    const landed = state.landed;
    if (!landed) return;
    return usePlayerStore.subscribe((player) => {
      if (player.status !== "error" || player.station?.id !== landed.id) return;
      const next = alternatesRef.current.shift();
      if (!next) return; // Out of candidates: the player's own error stands.
      setState((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
      play(next);
    });
  }, [state.landed, play]);

  /**
   * Fetch a station and start it. `search` receives the listener's current mode
   * and the station already playing, so callers can pass both on without
   * reaching into the stores themselves. Sending what is playing is what stops
   * a second press landing on the same station: in a thin pool that happened on
   * 10% of presses in Bangladesh and 30% in Cuba.
   */
  const tune = useCallback(
    async (
      search: (context: {
        mode: ReturnType<typeof useListeningMode.getState>["mode"];
        heard?: string;
      }) => Promise<Response>,
      fallbackError: string,
    ) => {
      setState({ landed: null, skipped: 0, widenedTo: null, loading: true, error: null });
      alternatesRef.current = [];
      try {
        const response = await search({
          mode: useListeningMode.getState().mode,
          heard: usePlayerStore.getState().station?.id,
        });
        const body: Partial<TuneResult> & { error?: string } = await response.json();
        if (!response.ok || !body.station) throw new Error(body.error ?? fallbackError);
        alternatesRef.current = body.alternates ?? [];
        play(body.station);
        if (body.widenedTo) {
          const widenedTo = body.widenedTo;
          setState((prev) => ({ ...prev, widenedTo }));
        }
      } catch (error) {
        // The server's own words when it has them: it knows whether a country
        // has no stations at all or none of the kind that was asked for.
        const message = error instanceof Error && error.message ? error.message : fallbackError;
        setState({ landed: null, skipped: 0, widenedTo: null, loading: false, error: message });
        return;
      }
      setState((prev) => ({ ...prev, loading: false }));
    },
    [play],
  );

  return { ...state, tune };
}
