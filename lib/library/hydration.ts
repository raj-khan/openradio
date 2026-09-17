"use client";

import { useSyncExternalStore } from "react";
import { useFavorites } from "@/lib/library/favorites";

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
    rehydrate: () => Promise<void> | void;
  };
};

export const LIBRARY_STORES: PersistedStore[] = [useFavorites];

/** True once the given persisted store has loaded from localStorage. */
export function useHydrated(store: PersistedStore) {
  return useSyncExternalStore(
    (listener) => store.persist.onFinishHydration(listener),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
