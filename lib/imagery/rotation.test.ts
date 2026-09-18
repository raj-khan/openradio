import { describe, expect, it } from "vitest";
import { PLACES } from "@/lib/imagery/catalog";
import { ROTATION_STRIDE, ROTATION_WINDOW_MS, rotatePlaces } from "@/lib/imagery/rotation";

const W = ROTATION_WINDOW_MS;
const slugs = (places: { slug: string }[]) => places.map((p) => p.slug);

describe("rotatePlaces", () => {
  it("keeps every place, exactly once", () => {
    const rotated = rotatePlaces(PLACES, 42 * W);
    expect(rotated).toHaveLength(PLACES.length);
    expect([...slugs(rotated)].sort()).toEqual([...slugs(PLACES)].sort());
  });

  it("opens somewhere different in the next window", () => {
    const first = rotatePlaces(PLACES, 0)[0].slug;
    const second = rotatePlaces(PLACES, W)[0].slug;
    expect(second).not.toBe(first);
  });

  it("is stable inside one window, so the dial cannot reshuffle under the user", () => {
    // Also what makes it safe to render on the server and hydrate on the client.
    expect(slugs(rotatePlaces(PLACES, W))).toEqual(slugs(rotatePlaces(PLACES, W + W - 1)));
  });

  it("reaches every place before repeating any", () => {
    const openings = new Set<string>();
    for (let window = 0; window < PLACES.length; window++) {
      openings.add(rotatePlaces(PLACES, window * W)[0].slug);
    }
    expect(openings.size).toBe(PLACES.length);
  });

  it("steps far enough to feel different, not just to the next neighbour", () => {
    const order = slugs(PLACES);
    const a = order.indexOf(rotatePlaces(PLACES, 0)[0].slug);
    const b = order.indexOf(rotatePlaces(PLACES, W)[0].slug);
    expect(Math.abs(b - a)).toBeGreaterThan(1);
  });

  it("falls back to single steps when the stride would skip places", () => {
    // A stride sharing a factor with the length only ever visits some of them.
    const four = PLACES.slice(0, 4);
    const openings = new Set<string>();
    for (let window = 0; window < 4; window++) {
      openings.add(rotatePlaces(four, window * W, W, 2)[0].slug);
    }
    expect(openings.size).toBe(4);
  });

  it("survives a list too short to rotate", () => {
    expect(rotatePlaces([], 0)).toEqual([]);
    expect(slugs(rotatePlaces(PLACES.slice(0, 1), 5 * W))).toEqual([PLACES[0].slug]);
  });

  it("uses a stride coprime with the curated list", () => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    expect(gcd(ROTATION_STRIDE, PLACES.length)).toBe(1);
  });
});
