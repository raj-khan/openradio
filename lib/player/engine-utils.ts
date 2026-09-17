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
