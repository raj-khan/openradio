import type { Station } from "@/lib/stations/types";

export const LOAD_TIMEOUT_MS = 15_000;
export const RETRY_DELAY_MS = 1_500;
export const MAX_AUTO_RETRIES = 1;

export const STREAM_ERROR = "This station isn't responding right now. Try another station.";
export const UNSUPPORTED_ERROR = "Your browser can't play this station's stream format.";

export type SourceStrategy = "native" | "hls.js" | "unsupported";

/** Decide how to play a station given browser capabilities. */
export function sourceStrategy(
  station: Pick<Station, "isHls">,
  capabilities: { nativeHls: boolean; hlsJs: boolean },
): SourceStrategy {
  if (!station.isHls || capabilities.nativeHls) return "native";
  return capabilities.hlsJs ? "hls.js" : "unsupported";
}

/** Whether a failed attempt should be retried automatically. */
export function shouldRetry(attempt: number) {
  return attempt < MAX_AUTO_RETRIES;
}

/** Autoplay policies reject play() with NotAllowedError; that is not a stream failure. */
export function isAutoplayBlocked(error: unknown) {
  return error instanceof DOMException && error.name === "NotAllowedError";
}

export function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

/*
 * Stream addresses to try, best first.
 *
 * 44% of stations in the popular pool are filed with an http address. On an
 * https page that is mixed content: Chrome silently upgrades it and logs a
 * warning, Safari and Firefox are stricter, and none of it is under our
 * control. Measured against the live directory, 11 of 12 of those hosts serve
 * the identical stream over https and simply have the old address on file.
 *
 * So https is tried first and the original kept as a fallback, rather than
 * rewriting the address outright: the twelfth station answers only on http, and
 * breaking it to tidy a warning would be a poor trade.
 */
export function streamCandidates(url: string): string[] {
  if (!url.startsWith("http://")) return [url];
  return [`https://${url.slice("http://".length)}`, url];
}
