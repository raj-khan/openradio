import { describe, expect, it } from "vitest";
import {
  httpUrl,
  normalizeFacets,
  normalizeStation,
  normalizeStations,
  splitList,
} from "@/lib/stations/normalize";

const base = {
  stationuuid: "042d3140-227c-4fac-9387-4903b692d5f2",
  name: "  Radio  Example ",
  url: "http://stream.example.com/live",
  url_resolved: "https://stream.example.com/live.mp3",
  homepage: "https://example.com",
  favicon: "https://example.com/icon.png",
  country: "Bangladesh",
  countrycode: "bd",
  state: "Dhaka",
  language: "Bengali, English",
  tags: "Music,pop, music ,",
  codec: "mp3",
  bitrate: 128,
  hls: 0,
  votes: 10,
  clickcount: "25",
  lastcheckok: 1,
  lastchecktime_iso8601: "2026-09-16T13:32:14Z",
};

describe("normalizeStation", () => {
  it("normalizes a complete station", () => {
    expect(normalizeStation(base)).toEqual({
      id: base.stationuuid,
      name: "Radio Example",
      streamUrl: "https://stream.example.com/live.mp3",
      homepageUrl: "https://example.com/",
      faviconUrl: "https://example.com/icon.png",
      country: "Bangladesh",
      countryCode: "BD",
      state: "Dhaka",
      languages: ["bengali", "english"],
      tags: ["music", "pop"],
      codec: "MP3",
      bitrate: 128,
      isHls: false,
      votes: 10,
      clickCount: 25,
      lastCheckOk: true,
      lastCheckedAt: "2026-09-16T13:32:14Z",
      source: "radio-browser",
    });
  });

  it("falls back to url when url_resolved is invalid", () => {
    const station = normalizeStation({ ...base, url_resolved: "" });
    expect(station?.streamUrl).toBe("http://stream.example.com/live");
  });

  it("rejects stations without a usable stream url", () => {
    expect(normalizeStation({ ...base, url: "ftp://x", url_resolved: "javascript:alert(1)" })).toBe(
      null,
    );
  });

  it("rejects stations without id or name", () => {
    expect(normalizeStation({ ...base, stationuuid: undefined })).toBe(null);
    expect(normalizeStation({ ...base, name: "   " })).toBe(null);
  });

  it("handles missing and malformed optional fields", () => {
    const station = normalizeStation({
      stationuuid: base.stationuuid,
      name: "Minimal",
      url: "https://example.com/stream",
      favicon: "not a url",
      countrycode: "XYZ",
      bitrate: "abc",
      votes: -5,
      tags: 42,
    });
    expect(station).toMatchObject({
      faviconUrl: undefined,
      countryCode: undefined,
      bitrate: undefined,
      votes: 0,
      tags: [],
      languages: [],
      lastCheckOk: false,
    });
  });

  it("detects HLS from the flag or the file extension", () => {
    expect(normalizeStation({ ...base, hls: 1 })?.isHls).toBe(true);
    expect(
      normalizeStation({ ...base, url_resolved: "https://cdn.example.com/a/index.M3U8?x=1" })
        ?.isHls,
    ).toBe(true);
  });

  it("rejects urls with credentials", () => {
    expect(httpUrl("https://user:pass@example.com/stream")).toBeUndefined();
  });
});

describe("normalizeStations", () => {
  it("drops invalid entries and duplicates", () => {
    const list = normalizeStations([base, null, "x", { name: "no id" }, base]);
    expect(list).toHaveLength(1);
  });

  it("returns an empty list for non arrays", () => {
    expect(normalizeStations({})).toEqual([]);
  });
});

describe("splitList", () => {
  it("limits the number of items", () => {
    expect(splitList("a,b,c,d", 2)).toEqual(["a", "b"]);
  });

  it("drops overly long items", () => {
    expect(splitList(`ok,${"x".repeat(41)}`)).toEqual(["ok"]);
  });
});

describe("normalizeFacets", () => {
  it("merges duplicates, drops empty facets and sorts by count", () => {
    expect(
      normalizeFacets([
        { name: "Japan", iso_3166_1: "JP", stationcount: 5 },
        { name: "Bangladesh", iso_3166_1: "BD", stationcount: 9 },
        { name: "Japan", iso_3166_1: "jp", stationcount: 2 },
        { name: "", stationcount: 100 },
        { name: "Empty", stationcount: 0 },
        { name: "jazz", stationcount: "7" },
      ]),
    ).toEqual([
      { name: "Bangladesh", code: "BD", stationCount: 9 },
      { name: "Japan", code: "JP", stationCount: 7 },
      { name: "jazz", stationCount: 7 },
    ]);
  });
});
