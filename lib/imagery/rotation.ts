/*
 * The dial opened on Japan and stepped to Bangladesh on every single visit,
 * because PLACES is a fixed list and the tuner starts at index 0. The list is
 * curated (each place carries its own licensed photograph) so the fix is to
 * vary the way in rather than to add places.
 *
 * Rotating on a clock rather than at random is deliberate: the home page is
 * cached for ten minutes, so a random pick would be frozen into one answer for
 * everyone anyway, and a client-side pick would mismatch the server's HTML. A
 * rotation keyed to the same window the cache uses changes with each new cached
 * render, stays identical for everyone reading that render, and never disagrees
 * with the markup it shipped in.
 */
import type { Place } from "@/lib/imagery/catalog";

/** Matches `revalidate` on the home page, so each cached render rotates once. */
export const ROTATION_WINDOW_MS = 600_000;

/**
 * Steps taken through the list per window. Coprime with the number of places,
 * so consecutive windows land far apart and every place still comes up before
 * any repeats.
 */
export const ROTATION_STRIDE = 7;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Start the list at a different place each cache window, keeping every entry. */
export function rotatePlaces(
  places: Place[],
  at: number = Date.now(),
  windowMs: number = ROTATION_WINDOW_MS,
  stride: number = ROTATION_STRIDE,
): Place[] {
  if (places.length < 2) return [...places];
  // A stride sharing a factor with the length would only ever reach some of
  // the places, so fall back to walking one at a time.
  const step = gcd(stride, places.length) === 1 ? stride : 1;
  const window = Math.floor(at / windowMs);
  const offset = (((window * step) % places.length) + places.length) % places.length;
  return [...places.slice(offset), ...places.slice(0, offset)];
}
