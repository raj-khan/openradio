"use client";

import { create } from "zustand";

interface NowPlayingState {
  stationId: string | null;
  title: string | null;
  set: (stationId: string | null, title: string | null) => void;
}

export const useNowPlayingStore = create<NowPlayingState>()((set) => ({
  stationId: null,
  title: null,
  set: (stationId, title) => set({ stationId, title }),
}));

/** Now playing title for the current station, or null. */
export function useNowPlayingTitle(stationId: string | undefined) {
  return useNowPlayingStore((s) => (stationId && s.stationId === stationId ? s.title : null));
}

/*
 * How often to ask what is playing.
 *
 * One listener polling every 30 seconds is 120 requests an hour, and the cache
 * header on the route only earns its keep when several people are on the same
 * station, which is true of very few of them. Radio is mostly left running in a
 * background tab, and a title that is two minutes stale there is not something
 * anyone notices: it reaches the lock screen and nothing else. So the visible
 * tab stays responsive and the hidden one drops to a trickle.
 */
export const NOW_PLAYING_INTERVAL_MS = 60_000;
export const NOW_PLAYING_HIDDEN_INTERVAL_MS = 180_000;

/** How long to wait before the next poll, given whether the page is visible. */
export function nowPlayingDelay(hidden: boolean): number {
  return hidden ? NOW_PLAYING_HIDDEN_INTERVAL_MS : NOW_PLAYING_INTERVAL_MS;
}

/** Whether now playing should be polled for the current player state. */
export function shouldPoll(status: string, station: { isHls: boolean } | null) {
  return status === "playing" && Boolean(station) && !station!.isHls;
}
