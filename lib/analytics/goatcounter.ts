/**
 * Optional visit counting through GoatCounter: free for open source, no
 * cookies, no personal data, and no database of our own. Disabled unless
 * NEXT_PUBLIC_GOATCOUNTER_URL is set (for example https://openradio.goatcounter.com).
 */
export function goatcounterOrigin(raw = process.env.NEXT_PUBLIC_GOATCOUNTER_URL): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    if (url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Pixel URL that records one page view. No cookies, no identifiers. */
export function countPixelUrl(
  path: string,
  title: string,
  origin = goatcounterOrigin(),
): string | null {
  if (!origin) return null;
  const safePath = path.startsWith("/") ? path.slice(0, 200) : "/";
  const url = new URL("/count", origin);
  url.searchParams.set("p", safePath);
  if (title) url.searchParams.set("t", title.slice(0, 120));
  // Cache buster so repeat views in one session are still counted.
  url.searchParams.set("rnd", Math.random().toString(36).slice(2, 10));
  return url.toString();
}

export interface VisitTotals {
  count: number;
  unique: number;
}

/** Public visit totals. Returns null when disabled or unavailable. */
export async function fetchVisitTotals(origin = goatcounterOrigin()): Promise<VisitTotals | null> {
  if (!origin) return null;
  try {
    const response = await fetch(`${origin}/counter/TOTAL.json`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    return parseTotals(body);
  } catch {
    return null;
  }
}

/** GoatCounter returns formatted strings such as "1,234". */
export function parseTotals(body: unknown): VisitTotals | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as { count?: unknown; count_unique?: unknown };
  const count = toNumber(raw.count);
  if (count === null) return null;
  return { count, unique: toNumber(raw.count_unique) ?? count };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value !== "string") return null;
  const parsed = Number(value.replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Compact display, e.g. 1,234 or 12.3k. */
export function formatVisits(count: number): string {
  if (count < 10_000) return count.toLocaleString("en");
  if (count < 1_000_000) return `${(count / 1000).toFixed(count < 100_000 ? 1 : 0)}k`;
  return `${(count / 1_000_000).toFixed(1)}m`;
}
