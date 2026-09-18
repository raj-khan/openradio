import "server-only";

import { safeFetch } from "@/lib/security/url-guard";
import { USER_AGENT } from "@/lib/stations/radio-browser-client";
import type { Station } from "@/lib/stations/types";

/*
 * Radio Browser's lastCheckOk goes stale: a station it calls healthy can be off
 * the air right now. Handing one of those to the player costs the listener the
 * full load timeout plus a retry, about thirty seconds, before anything says so.
 * A short probe here turns that into a fraction of a second, so Surprise me can
 * hand over a station that is actually answering.
 */

export const PROBE_TIMEOUT_MS = 2500;
/** Probed together, so the wait is one timeout rather than one per station. */
export const PROBE_WIDTH = 4;

/** Does this stream answer, quickly, with something playable? Never throws. */
export async function probeStream(url: string, timeoutMs = PROBE_TIMEOUT_MS): Promise<boolean> {
  try {
    const response = await safeFetch(url, {
      headers: { "User-Agent": USER_AGENT, "Icy-MetaData": "1" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    await response.body?.cancel();
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * The first station in `candidates` that answers. All are probed at once and
 * the earliest in the list wins, so the caller's ordering still decides.
 * Returns undefined when none of them answer.
 */
export async function firstReachable(
  candidates: Station[],
  probe: (url: string) => Promise<boolean> = (url) => probeStream(url),
): Promise<Station | undefined> {
  const pool = candidates.slice(0, PROBE_WIDTH);
  if (pool.length === 0) return undefined;
  const results = await Promise.all(pool.map((station) => probe(station.streamUrl)));
  const index = results.indexOf(true);
  return index === -1 ? undefined : pool[index];
}
