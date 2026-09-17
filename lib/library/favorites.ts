"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Station } from "@/lib/stations/types";

export const MAX_FAVORITES = 500;

export interface FavoritesState {
  stations: Station[];
  toggle: (station: Station) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      stations: [],
      toggle: (station) =>
        set((state) =>
          state.stations.some((s) => s.id === station.id)
            ? { stations: state.stations.filter((s) => s.id !== station.id) }
            : { stations: [station, ...state.stations].slice(0, MAX_FAVORITES) },
        ),
      remove: (id) => set((state) => ({ stations: state.stations.filter((s) => s.id !== id) })),
      clear: () => set({ stations: [] }),
    }),
    {
      name: "radio-atlas:favorites",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ stations: state.stations }),
      // Rehydrated after mount by LibraryHydrator to keep server and client HTML identical.
      skipHydration: true,
    },
  ),
);

export function useIsFavorite(id: string) {
  return useFavorites((state) => state.stations.some((s) => s.id === id));
}
