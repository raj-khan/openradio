"use client";

import { useEffect } from "react";
import { nowPlayingDelay, shouldPoll, useNowPlayingStore } from "@/lib/now-playing/store";
import { usePlayerStore } from "@/lib/player/store";

/** Polls the now playing API for the current station while it plays. */
export function NowPlayingPoller() {
  const station = usePlayerStore((s) => s.station);
  const status = usePlayerStore((s) => s.status);
  const active = shouldPoll(status, station);
  const stationId = station?.id ?? null;

  // Forget the previous station's title as soon as the station changes.
  useEffect(() => {
    const store = useNowPlayingStore.getState();
    if (store.stationId !== stationId) store.set(stationId, null);
  }, [stationId]);

  useEffect(() => {
    if (!active || !stationId) return;
    let controller: AbortController | null = null;
    let timer = 0;
    let stopped = false;

    /*
     * A rescheduling timeout rather than an interval, so the gap is chosen
     * fresh each time from the tab's current visibility. An interval would be
     * stuck with whichever cadence applied when the station started playing.
     */
    const schedule = () => {
      if (stopped) return;
      timer = window.setTimeout(run, nowPlayingDelay(document.hidden));
    };

    const poll = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch(`/api/now-playing/${stationId}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const body: { title: string | null } = await response.json();
        useNowPlayingStore.getState().set(stationId, body.title ?? null);
      } catch {
        // Missing metadata is normal; keep whatever we had.
      }
    };

    const run = async () => {
      await poll();
      schedule();
    };

    // Coming back to the tab should show the current title, not the one from
    // whenever the slow hidden cadence last happened to fire.
    const onVisible = () => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      void run();
    };

    void run();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      controller?.abort();
    };
  }, [active, stationId]);

  return null;
}
