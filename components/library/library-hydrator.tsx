"use client";

import { useEffect } from "react";
import { LIBRARY_STORES } from "@/lib/library/hydration";

/** Loads on-device library data (favorites, history) after the first render. */
export function LibraryHydrator() {
  useEffect(() => {
    for (const store of LIBRARY_STORES) void store.persist.rehydrate();
  }, []);
  return null;
}
