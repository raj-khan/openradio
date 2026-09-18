"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isListeningMode, type ListeningMode } from "@/lib/stations/listening-mode";

interface ListeningModeState {
  mode: ListeningMode;
  setMode: (mode: ListeningMode) => void;
}

/** Remembered per device: someone who came for talk radio wants it next time. */
export const useListeningMode = create<ListeningModeState>()(
  persist(
    (set) => ({
      mode: "any",
      setMode: (mode) => set({ mode: isListeningMode(mode) ? mode : "any" }),
    }),
    {
      name: "openradio:listening-mode",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Read after mount so the server and client render the same first HTML.
      skipHydration: true,
    },
  ),
);
