import { describe, expect, it } from "vitest";
import { pickRandom, surpriseCandidates } from "@/lib/stations/surprise";
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
