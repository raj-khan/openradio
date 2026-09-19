import { describe, expect, it } from "vitest";
import { brandKey, coverageGap } from "@/lib/stations/coverage";
import { makeStation } from "@/test/fixtures";

describe("brandKey", () => {
  it("matches the same station written two ways", () => {
    // Real pairs: Wikidata's spelling against the directory's.
    expect(brandKey("Radio Today")).toBe(brandKey("Radio Today 89.6 FM"));
    expect(brandKey("DhakaFM 90.4")).toBe(brandKey("Dhaka FM"));
    expect(brandKey("Peoples Radio 91.6 FM")).toBe(brandKey("peoples radio"));
  });

  it("ignores accents and punctuation", () => {
    expect(brandKey("Rádio Comercial")).toBe(brandKey("Radio Comercial"));
    expect(brandKey("Habertürk Radyo")).toBe(brandKey("Haberturk Radyo"));
  });

  it("keeps genuinely different stations apart", () => {
    expect(brandKey("Radio Today")).not.toBe(brandKey("Radio Foorti"));
    expect(brandKey("ABC Radio")).not.toBe(brandKey("BBC Radio"));
  });

  it("reduces a name that is nothing but decoration to an empty key", () => {
    expect(brandKey("Radio FM 101.5")).toBe("");
  });
});

describe("coverageGap", () => {
  const known = [
    { name: "Radio Today", website: "https://radiotodaydhaka.com" },
    { name: "ABC Radio" },
    { name: "Radio Foorti" },
  ];

  it("reports the brands the directory has never heard of", () => {
    const carried = [makeStation("a", { name: "Radio Foorti" })];
    const gap = coverageGap(known, carried);
    expect(gap.missing.map((s) => s.name)).toEqual(["Radio Today", "ABC Radio"]);
    expect(gap).toMatchObject({ carried: 1, known: 3 });
  });

  it("matches across spelling differences rather than reporting a false gap", () => {
    const carried = [makeStation("a", { name: "Radio Today 89.6 FM" })];
    expect(coverageGap(known, carried).missing.map((s) => s.name)).not.toContain("Radio Today");
  });

  it("reports nothing when the directory carries everything", () => {
    const carried = known.map((s, i) => makeStation(String(i), { name: s.name }));
    expect(coverageGap(known, carried).missing).toEqual([]);
  });

  it("does not report one brand twice", () => {
    const gap = coverageGap([{ name: "ABC Radio" }, { name: "ABC Radio 89.2" }], []);
    expect(gap.missing).toHaveLength(1);
  });
});
