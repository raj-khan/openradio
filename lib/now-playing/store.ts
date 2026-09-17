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

export const NOW_PLAYING_INTERVAL_MS = 30_000;

/** Whether now playing should be polled for the current player state. */
export function shouldPoll(status: string, station: { isHls: boolean } | null) {
  return status === "playing" && Boolean(station) && !station!.isHls;
}
