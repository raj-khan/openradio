"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  isConsentChoice,
  type ConsentChoice,
} from "@/lib/analytics/google-analytics";

type Gtag = (...args: unknown[]) => void;

function update(choice: ConsentChoice) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("consent", "update", { analytics_storage: choice });
}

function read(): ConsentChoice | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    return isConsentChoice(stored) ? stored : null;
  } catch {
    // Private windows and blocked site data both throw. No answer stored means
    // no consent, which is the safe reading anyway.
    return null;
  }
}

/**
 * Asks once, remembers the answer, and asks again only if it was never given.
 * The page renders and plays radio regardless: this never blocks anything.
 */
export function AnalyticsConsent({ enabled }: { enabled: boolean }) {
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const stored = read();
    if (stored) {
      update(stored);
      return;
    }
    // Asked for on the next frame rather than inside the effect: the prompt is
    // the least urgent thing on the page, and it should not make the first
    // paint render twice.
    const frame = requestAnimationFrame(() => setAsking(true));
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  const answer = (choice: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Not being able to remember is not a reason to ignore the answer.
    }
    update(choice);
    setAsking(false);
  };

  if (!enabled || !asking) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics cookies"
      className="fixed inset-x-3 z-40 rounded-2xl border border-border bg-surface/95 p-4 shadow-lg backdrop-blur-md sm:right-4 sm:left-auto sm:max-w-sm"
      style={{ bottom: "calc(var(--player-space) + 0.75rem)" }}
    >
      <p className="text-sm text-text">
        Can we count this visit with Google Analytics? It sets cookies. Say no and the site works
        exactly the same.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => answer("granted")}
          className="rounded-full bg-accent px-4 py-1.5 text-sm text-accent-contrast"
        >
          Allow
        </button>
        <button
          type="button"
          onClick={() => answer("denied")}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-text"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
