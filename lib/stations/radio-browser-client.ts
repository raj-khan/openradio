import "server-only";

const MIRROR_LIST_URL = "https://all.api.radio-browser.info/json/servers";
const FALLBACK_MIRRORS = ["https://de1.api.radio-browser.info"];
const MIRROR_TTL_MS = 60 * 60 * 1000;
export const REQUEST_TIMEOUT_MS = 8000;
export const USER_AGENT = "RadioAtlas/0.1 (+https://github.com/raj-khan/radio-atlas)";

export type QueryValue = string | number | boolean | undefined;

export interface RadioBrowserRequestOptions {
  /** Seconds the response may be cached by Next.js. 0 disables caching. */
  revalidate?: number;
}

export class RadioBrowserError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "RadioBrowserError";
  }
}

let mirrorCache: { mirrors: string[]; expiresAt: number } | null = null;

/** Reset cached mirrors. Intended for tests. */
export function resetMirrorCache() {
  mirrorCache = null;
}

async function resolveMirrors(): Promise<string[]> {
  const override = process.env.RADIO_BROWSER_BASE_URL?.trim();
  if (override) return [override.replace(/\/+$/, "")];

  if (mirrorCache && mirrorCache.expiresAt > Date.now()) return mirrorCache.mirrors;

  let mirrors = FALLBACK_MIRRORS;
  try {
    const response = await fetch(MIRROR_LIST_URL, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    if (response.ok) {
      const body: unknown = await response.json();
      const names = Array.isArray(body)
        ? body
            .map((item) =>
              item && typeof item === "object" ? (item as { name?: unknown }).name : null,
            )
            .filter(
              (name): name is string => typeof name === "string" && /^[a-z0-9.-]+$/i.test(name),
            )
        : [];
      const unique = [...new Set(names)].map((name) => `https://${name}`);
      if (unique.length > 0) mirrors = unique;
    }
  } catch {
    // Use fallback mirrors.
  }

  mirrorCache = { mirrors, expiresAt: Date.now() + MIRROR_TTL_MS };
  return mirrors;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildUrl(base: string, path: string, params: Record<string, QueryValue> = {}) {
  const url = new URL(path.replace(/^\/+/, ""), `${base}/`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function isRetryable(error: unknown) {
  return !(error instanceof RadioBrowserError) || (error.status ?? 500) >= 500;
}

/**
 * GET a Radio Browser JSON endpoint. Tries a random mirror, and on network
 * errors or 5xx responses retries once on a different mirror.
 */
export async function radioBrowserGet(
  path: string,
  params: Record<string, QueryValue> = {},
  { revalidate = 600 }: RadioBrowserRequestOptions = {},
): Promise<unknown> {
  const mirrors = shuffle(await resolveMirrors());
  const attempts = mirrors.length > 1 ? mirrors.slice(0, 2) : [mirrors[0], mirrors[0]];

  let lastError: unknown;
  for (const mirror of attempts) {
    try {
      const response = await fetch(buildUrl(mirror, path, params), {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        ...(revalidate > 0 ? { next: { revalidate } } : { cache: "no-store" as const }),
      });
      if (!response.ok) {
        throw new RadioBrowserError(`Radio Browser responded ${response.status}`, response.status);
      }
      return (await response.json()) as unknown;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) break;
    }
  }

  if (lastError instanceof RadioBrowserError) throw lastError;
  throw new RadioBrowserError("Radio Browser is unreachable");
}
