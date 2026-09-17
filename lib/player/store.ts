"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clamp } from "@/lib/utils";
import {
  initialPlaybackState,
  isActive,
  transition,
  type PlaybackState,
  type PlayerEvent,
} from "@/lib/player/machine";
import type { Station } from "@/lib/stations/types";

export interface PlayerState extends PlaybackState {
  volume: number;
  muted: boolean;
  /** Start a station, or resume it if it is already selected and paused. */
  play: (station: Station) => void;
  /** Toggle between playing and paused for the current station. */
  toggle: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  /** Feed media events from the audio engine into the state machine. */
  dispatch: (event: PlayerEvent) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => {
      const dispatch = (event: PlayerEvent) =>
        set((state) => transition(state, event) as Partial<PlayerState>);

      return {
        ...initialPlaybackState,
        volume: 0.8,
        muted: false,
        dispatch,
        play: (station) => {
          const { station: current, status } = get();
          if (current?.id === station.id && (status === "paused" || status === "error")) {
            dispatch({ type: "RESUME" });
          } else if (current?.id !== station.id || !isActive(status)) {
            dispatch({ type: "LOAD", station });
          }
        },
        toggle: () => {
          const { status } = get();
          dispatch(isActive(status) ? { type: "PAUSE" } : { type: "RESUME" });
        },
        pause: () => dispatch({ type: "PAUSE" }),
        stop: () => dispatch({ type: "STOP" }),
        setVolume: (volume) =>
          set({ volume: clamp(Number.isFinite(volume) ? volume : 0, 0, 1), muted: false }),
        toggleMute: () => set((state) => ({ muted: !state.muted })),
      };
    },
    {
      name: "radio-atlas:player",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ volume: state.volume, muted: state.muted }),
    },
  ),
);
