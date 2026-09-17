import { NextResponse } from "next/server";

export const PROVIDER_UNAVAILABLE =
  "The station directory isn't responding right now. Please try again shortly.";

export interface ApiErrorBody {
  error: string;
}

/** CDN cache header: fresh for `seconds`, then served stale while revalidating. */
export function cacheFor(seconds: number): HeadersInit {
  if (seconds <= 0) return { "Cache-Control": "no-store" };
  return {
    "Cache-Control": `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 6}`,
  };
}

export function apiError(status: number, message: string, headers?: HeadersInit) {
  return NextResponse.json<ApiErrorBody>(
    { error: message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

/** Log an unexpected server error without leaking details to the client. */
export function logError(operation: string, error: unknown) {
  console.error(
    JSON.stringify({
      level: "error",
      operation,
      error: error instanceof Error ? error.message : String(error),
    }),
  );
}
