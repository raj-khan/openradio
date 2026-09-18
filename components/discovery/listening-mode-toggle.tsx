"use client";

import { useListeningMode } from "@/lib/library/listening-mode-store";
import { LISTENING_MODES, MODE_LABELS } from "@/lib/stations/listening-mode";

/**
 * Music or voices. Without this there was no way to ask for talk radio at all,
 * and every default path through the site led to music.
 */
export function ListeningModeToggle({ className = "" }: { className?: string }) {
  const mode = useListeningMode((s) => s.mode);
  const setMode = useListeningMode((s) => s.setMode);

  return (
    <div
      role="radiogroup"
      // The discover field below already announces "What do you want to hear?",
      // so this needs a name of its own to be distinguishable by screen reader.
      aria-label="Music or voices"
      className={`inline-flex rounded-full border border-white/30 bg-black/20 p-1 backdrop-blur-sm ${className}`}
    >
      {LISTENING_MODES.map((value) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              active ? "bg-white text-black" : "text-white/80 hover:text-white"
            }`}
          >
            {MODE_LABELS[value]}
          </button>
        );
      })}
    </div>
  );
}
