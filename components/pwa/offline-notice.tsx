"use client";

import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

export function OfflineNotice() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-14 z-20 flex items-center justify-center gap-2 border-b border-border bg-surface-strong px-4 py-2 text-center text-sm"
    >
      <WifiOff className="size-4 shrink-0 text-accent-alt" aria-hidden="true" />
      Offline: browsing saved stations. Live audio needs a connection.
    </div>
  );
}
