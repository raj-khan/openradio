import "server-only";

import { readIcyTitle } from "@/lib/now-playing/icy";
import { safeFetch } from "@/lib/security/url-guard";
import { USER_AGENT } from "@/lib/stations/radio-browser-client";
import type { Station } from "@/lib/stations/types";

const TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 20_000;
const MAX_CACHE = 500;

const cache = new Map<string, { title: string | null; expiresAt: number }>();

/** Current ICY StreamTitle for a station, or null. Never throws. */
export async function fetchNowPlaying(station: Station, now = Date.now()): Promise<string | null> {
  if (station.isHls) return null;

  const cached = cache.get(station.id);
  if (cached && cached.expiresAt > now) return cached.title;

  let title: string | null = null;
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  try {
    const response = await safeFetch(station.streamUrl, {
      headers: { "Icy-MetaData": "1", "User-Agent": USER_AGENT },
      signal,
    });
    const metaint = Number(response.headers.get("icy-metaint"));
    if (response.ok && response.body && metaint > 0) {
      title = await readIcyTitle(response.body as ReadableStream<Uint8Array>, metaint);
    } else {
      await response.body?.cancel();
    }
  } catch {
    title = null;
  }

  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string);
  cache.set(station.id, { title, expiresAt: now + CACHE_TTL_MS });
  return title;
}

export function clearNowPlayingCache() {
  cache.clear();
}
