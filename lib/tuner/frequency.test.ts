import { describe, expect, it } from "vitest";
import { FM_MAX, FM_MIN, nearestDialIndex, stationFrequency } from "@/lib/tuner/frequency";

describe("stationFrequency", () => {
  it("is stable and within the FM band", () => {
    const ids = ["042d3140-227c-4fac-9387-4903b692d5f2", "a", "b", "", "zzzz"];
    for (const id of ids) {
      const value = stationFrequency(id);
      expect(stationFrequency(id)).toBe(value);
      expect(value).toMatch(/^\d{2,3}\.\d$/);
      expect(Number(value)).toBeGreaterThanOrEqual(FM_MIN);
      expect(Number(value)).toBeLessThanOrEqual(FM_MAX);
    }
  });

  it("spreads different ids across the band", () => {
    const values = new Set(Array.from({ length: 50 }, (_, i) => stationFrequency(`station-${i}`)));
    expect(values.size).toBeGreaterThan(35);
  });
});

describe("nearestDialIndex", () => {
  it("rounds to the nearest segment and clamps", () => {
    expect(nearestDialIndex(0, 100, 5)).toBe(0);
    expect(nearestDialIndex(149, 100, 5)).toBe(1);
    expect(nearestDialIndex(151, 100, 5)).toBe(2);
    expect(nearestDialIndex(9999, 100, 5)).toBe(4);
    expect(nearestDialIndex(-50, 100, 5)).toBe(0);
    expect(nearestDialIndex(10, 0, 5)).toBe(0);
  });
});
