"use client";

import { useEffect } from "react";
import { NOW_PLAYING_INTERVAL_MS, shouldPoll, useNowPlayingStore } from "@/lib/now-playing/store";
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

    void poll();
    const timer = window.setInterval(poll, NOW_PLAYING_INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      controller?.abort();
    };
  }, [active, stationId]);

  return null;
}
