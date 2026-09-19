import { describe, expect, it } from "vitest";
import {
  isListeningMode,
  isSpeechStation,
  matchesMode,
  meetsQualityFloor,
  MIN_MUSIC_BITRATE,
  MIN_SPEECH_BITRATE,
  minBitrateFor,
  nameSuggestsSpeech,
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

  it("lets a station through when no bitrate was ever recorded", () => {
    // The directory writes 0 when it has nothing on file, which normalizing
    // turns into undefined. Reading that as 0 kbps dropped 43% of Bangladesh's
    // live stations and 50% of Nigeria's, including talk-tagged ones. Unknown
    // is not bad: the stream probe decides whether it actually answers.
    const unknown = makeStation("unknown", {
      countryCode: "BD",
      tags: ["talk"],
      bitrate: undefined,
    });
    expect(meetsQualityFloor(unknown)).toBe(true);
  });

  it("still refuses a bitrate that is on file and below the floor", () => {
    expect(meetsQualityFloor(music("a", 32))).toBe(false);
    expect(meetsQualityFloor(talk("b", 16))).toBe(false);
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

describe("speech stations that are not tagged in English", () => {
  const tagged = (tag: string) => makeStation("a", { tags: [tag] });

  it("recognises the tags these countries actually use", () => {
    // Each of these was returning nothing for Voices before.
    for (const tag of ["noticias", "haber", "haberler", "actualités", "nachrichten", "berita"]) {
      expect(isSpeechStation(tagged(tag)), tag).toBe(true);
    }
    for (const tag of ["اسلامي", "قران كريم", "أخبار", "খবর", "новости", "뉴스"]) {
      expect(isSpeechStation(tagged(tag)), tag).toBe(true);
    }
  });

  it("falls back to the name when the tags say nothing useful", () => {
    // Real stations: tagged with frequencies and network names, or not at all.
    const byName = [
      { name: "88.9 Noticias - 88.9 FM - XHM-FM", tags: ["88.9", "acir", "américa"] },
      { name: "a HABER", tags: [] },
      { name: "Habertürk Radyo", tags: [] },
      { name: "AL-QURAN BANGLA", tags: [] },
      { name: "إذاعة القرآن الكريم من القاهرة", tags: ["classical"] },
    ];
    for (const { name, tags } of byName) {
      expect(isSpeechStation(makeStation("a", { name, tags })), name).toBe(true);
    }
  });

  it("does not mistake music stations for speech", () => {
    for (const name of ["Radio Paradise Main Mix", "Jazz24", "Newcastle Rock FM", "Kiss FM"]) {
      expect(isSpeechStation(makeStation("a", { name, tags: ["pop"] })), name).toBe(false);
    }
  });

  it("matches whole words, so a name that merely contains one does not count", () => {
    expect(nameSuggestsSpeech("Newstalk 106")).toBe(true);
    expect(nameSuggestsSpeech("88.9 Noticias")).toBe(true);
    expect(nameSuggestsSpeech("Renewal FM"), "renewal is not news").toBe(false);
    expect(nameSuggestsSpeech("Talkin' Blues"), "a blues show, not talk radio").toBe(false);
  });

  it("does not pretend to catch every station", () => {
    // Cuba's Radio Reloj is a 24 hour news station that announces itself as a
    // clock. Nothing in its name or tags says news, and we do not guess.
    expect(
      isSpeechStation(makeStation("a", { name: "Radio Reloj Cuba 950 AM", tags: ["icrt"] })),
    ).toBe(false);
  });
});
