import { describe, expect, it } from "vitest";
import {
  isListeningMode,
  isSpeechStation,
  matchesMode,
  meetsQualityFloor,
  MIN_MUSIC_BITRATE,
  MIN_SPEECH_BITRATE,
  minBitrateFor,
} from "@/lib/stations/listening-mode";
import { surpriseCandidates } from "@/lib/stations/surprise";
import { makeStation } from "@/test/fixtures";

const talk = (id: string, bitrate: number, tag = "talk") =>
  makeStation(id, { countryCode: "GB", bitrate, tags: [tag] });
const music = (id: string, bitrate: number) =>
  makeStation(id, { countryCode: "GB", bitrate, tags: ["jazz"] });

describe("isSpeechStation", () => {
  it("recognises the tags broadcasters actually use", () => {
    for (const tag of ["talk", "news", "public radio", "sports", "quran", "comedy"]) {
      expect(isSpeechStation(makeStation("a", { tags: [tag] })), tag).toBe(true);
    }
  });

  it("is not fooled by music tags, and ignores case", () => {
    expect(isSpeechStation(makeStation("a", { tags: ["jazz", "pop"] }))).toBe(false);
    expect(isSpeechStation(makeStation("a", { tags: ["News Talk"] }))).toBe(true);
    expect(isSpeechStation(makeStation("a", { tags: [] }))).toBe(false);
  });
});

describe("the quality floor", () => {
  it("judges speech and music by different floors", () => {
    expect(minBitrateFor(talk("a", 0))).toBe(MIN_SPEECH_BITRATE);
    expect(minBitrateFor(music("b", 0))).toBe(MIN_MUSIC_BITRATE);
  });

  it("stops excluding the BBC World Service", () => {
    // It streams at 56 kbps, under the old flat 64 floor, so the single most
    // recognisable talk station in the world was being dropped outright.
    const bbc = makeStation("bbc", {
      name: "BBC World Service",
      countryCode: "GB",
      bitrate: 56,
      tags: ["news", "talk"],
    });
    expect(meetsQualityFloor(bbc)).toBe(true);
  });

  it("still holds music to the higher floor", () => {
    expect(meetsQualityFloor(music("a", 56))).toBe(false);
    expect(meetsQualityFloor(music("b", 128))).toBe(true);
  });

  it("does not let a floor of zero through", () => {
    expect(meetsQualityFloor(talk("a", 0))).toBe(false);
  });
});

describe("matchesMode", () => {
  it("filters to what was asked for", () => {
    expect(matchesMode(talk("a", 64), "talk")).toBe(true);
    expect(matchesMode(talk("a", 64), "music")).toBe(false);
    expect(matchesMode(music("b", 128), "music")).toBe(true);
    expect(matchesMode(music("b", 128), "any")).toBe(true);
  });

  it("validates values coming off a query string", () => {
    expect(isListeningMode("talk")).toBe(true);
    expect(isListeningMode("TALK")).toBe(false);
    expect(isListeningMode(null)).toBe(false);
  });
});

describe("surpriseCandidates with a mode", () => {
  const pool = [talk("t1", 48), talk("t2", 128), music("m1", 128), music("m2", 320)];

  it("returns only speech when voices were asked for", () => {
    const picked = surpriseCandidates(pool, undefined, "talk");
    expect(picked.map((s) => s.id).sort()).toEqual(["t1", "t2"]);
  });

  it("returns only music when music was asked for", () => {
    expect(surpriseCandidates(pool, undefined, "music").every((s) => !isSpeechStation(s))).toBe(
      true,
    );
  });

  it("keeps the low bitrate talk station the old floor would have dropped", () => {
    expect(surpriseCandidates(pool, undefined, "talk").map((s) => s.id)).toContain("t1");
  });

  it("falls back rather than returning nothing", () => {
    // Somewhere with no talk station should still play something.
    const musicOnly = [music("m1", 128)];
    expect(surpriseCandidates(musicOnly, undefined, "talk")).toHaveLength(1);
  });
});
