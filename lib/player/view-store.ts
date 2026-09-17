"use client";

import { create } from "zustand";

interface NowPlayingViewState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

/** UI state for the full-screen now playing view. Not persisted. */
export const useNowPlayingView = create<NowPlayingViewState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
