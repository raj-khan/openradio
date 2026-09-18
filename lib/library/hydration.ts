"use client";

import { useSyncExternalStore } from "react";
import { useFavorites } from "@/lib/library/favorites";
import { useHistory } from "@/lib/library/history";
import { useListeningMode } from "@/lib/library/listening-mode-store";

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
    rehydrate: () => Promise<void> | void;
  };
};

export const LIBRARY_STORES: PersistedStore[] = [useFavorites, useHistory, useListeningMode];

/** True once the given persisted store has loaded from localStorage. */
export function useHydrated(store: PersistedStore) {
  return useSyncExternalStore(
    (listener) => store.persist.onFinishHydration(listener),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
