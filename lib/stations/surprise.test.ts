import { describe, expect, it } from "vitest";
import { pickRandom, spreadCandidates, surpriseCandidates } from "@/lib/stations/surprise";
import { makeStation } from "@/test/fixtures";

describe("surpriseCandidates", () => {
  const good = makeStation("good", { countryCode: "JP", bitrate: 128 });
  const low = makeStation("low", { countryCode: "BR", bitrate: 32 });
  const unknownCountry = makeStation("nowhere", { bitrate: 128 });
  const broken = makeStation("broken", { countryCode: "FR", bitrate: 128, lastCheckOk: false });
  const other = makeStation("other", { countryCode: "GE", bitrate: 96 });

  it("keeps healthy, known-country stations with decent bitrate", () => {
    expect(surpriseCandidates([good, low, unknownCountry, broken]).map((s) => s.id)).toEqual([
      "good",
    ]);
  });

  it("prefers a different country when possible", () => {
    expect(surpriseCandidates([good, other], "JP").map((s) => s.id)).toEqual(["other"]);
    expect(surpriseCandidates([good], "JP").map((s) => s.id)).toEqual(["good"]);
  });
});

describe("pickRandom", () => {
  it("picks using the random source", () => {
    expect(pickRandom(["a", "b", "c"], () => 0.99)).toBe("c");
    expect(pickRandom([], () => 0.5)).toBeUndefined();
  });
});

describe("spreadCandidates", () => {
  const named = (id: string, name: string) => makeStation(id, { name, countryCode: "BD" });

  it("gives a brand filed twice only one chance", () => {
    // AL-QURAN BANGLA is in the Bangladesh list twice on different streams, so
    // deduping by stream misses it and it took 21% of the Voices draws.
    const pool = [
      named("a", "AL-QURAN BANGLA"),
      named("b", "AL-QURAN BANGLA"),
      named("c", "Radio Vivid Voice"),
    ];
    expect(spreadCandidates(pool).map((s) => s.id)).toEqual(["a", "c"]);
  });

  it("treats a frequency in the name as the same brand", () => {
    const pool = [named("a", "Jago Fm"), named("b", "Jago FM 94.4")];
    expect(spreadCandidates(pool)).toHaveLength(1);
  });

  it("keeps genuinely different stations apart", () => {
    // A heavier fold would strip "radio" and "fm" and merge these two.
    const pool = [named("a", "Radio One"), named("b", "One FM")];
    expect(spreadCandidates(pool)).toHaveLength(2);
  });

  it("moves the station already playing to the back", () => {
    const pool = [named("a", "First"), named("b", "Second"), named("c", "Third")];
    expect(spreadCandidates(pool, "a").map((s) => s.id)).toEqual(["b", "c", "a"]);
  });

  it("repeats rather than refusing when it is the only station there", () => {
    const pool = [named("only", "Only One")];
    expect(spreadCandidates(pool, "only").map((s) => s.id)).toEqual(["only"]);
  });

  it("ignores an unknown heard id and an empty pool", () => {
    const pool = [named("a", "First")];
    expect(spreadCandidates(pool, "nope").map((s) => s.id)).toEqual(["a"]);
    expect(spreadCandidates([], "a")).toEqual([]);
  });
});

describe("spreadCandidates avoids the brand, not just the id", () => {
  const named = (id: string, name: string) => makeStation(id, { name, countryCode: "BD" });

  it("does not come back with the other entry for the same brand", () => {
    // AL-QURAN BANGLA is filed twice. Whichever entry the shuffle keeps, the
    // listener hears the same station, so avoiding the id alone is not enough.
    const pool = [
      named("a", "AL-QURAN BANGLA"),
      named("b", "AL-QURAN BANGLA"),
      named("c", "Other"),
    ];
    // "b" was heard, but "a" is the entry that survived the fold.
    expect(spreadCandidates(pool, "b")[0].name).toBe("Other");
  });
});
