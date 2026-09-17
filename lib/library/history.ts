"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Station } from "@/lib/stations/types";

export const MAX_HISTORY = 50;

export interface HistoryEntry {
  station: Station;
  playedAt: number;
}

export interface HistoryState {
  entries: HistoryEntry[];
  record: (station: Station, playedAt?: number) => void;
  clear: () => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      record: (station, playedAt = Date.now()) =>
        set((state) => ({
          entries: [
            { station, playedAt },
            ...state.entries.filter((entry) => entry.station.id !== station.id),
          ].slice(0, MAX_HISTORY),
        })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "openradio:history",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ entries: state.entries }),
      skipHydration: true,
    },
  ),
);

/** Short relative label such as "just now", "5 min ago", "yesterday". */
export function relativeTime(timestamp: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString("en", { month: "short", day: "numeric" });
}
