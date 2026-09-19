import { describe, expect, it } from "vitest";
import {
  httpUrl,
  normalizeFacets,
  normalizeStation,
  normalizeStations,
  secureImageUrl,
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
      codec: "UNKNOWN",
      votes: -5,
      tags: 42,
    });
    expect(station).toMatchObject({
      faviconUrl: undefined,
      countryCode: undefined,
      bitrate: undefined,
      codec: undefined,
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

  it("collapses separate entries that carry the same stream", () => {
    // Different ids and names, one stream: the directory is community edited
    // and the same station is often filed twice.
    const list = normalizeStations([
      { ...base, stationuuid: "a", name: "Jago FM 94.4", tags: "" },
      { ...base, stationuuid: "b", name: "Jago Fm", tags: "pop,talk" },
    ]);
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe("Jago Fm");
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

describe("secureImageUrl", () => {
  it("upgrades an insecure logo to https", () => {
    // Real entry: one of these put a security warning on the whole site.
    expect(secureImageUrl("http://cdn-profiles.tunein.com/s24948/images/logoq.jpg")).toBe(
      "https://cdn-profiles.tunein.com/s24948/images/logoq.jpg",
    );
  });

  it("leaves a secure one alone", () => {
    expect(secureImageUrl("https://example.com/logo.png")).toBe("https://example.com/logo.png");
  });

  it("keeps the path, query and port intact", () => {
    expect(secureImageUrl("http://host.test:8080/a/b.png?t=1")).toBe(
      "https://host.test:8080/a/b.png?t=1",
    );
  });

  it("rejects what httpUrl rejects", () => {
    expect(secureImageUrl("javascript:alert(1)")).toBeUndefined();
    expect(secureImageUrl("http://user:pass@host.test/x.png")).toBeUndefined();
    expect(secureImageUrl(undefined)).toBeUndefined();
    expect(secureImageUrl("not a url")).toBeUndefined();
  });

  it("does not rewrite a host that merely starts with http", () => {
    expect(secureImageUrl("https://httpbin.test/logo.png")).toBe("https://httpbin.test/logo.png");
  });
});

describe("station logos are never insecure", () => {
  it("upgrades the favicon but leaves the stream address untouched", () => {
    const station = normalizeStation({
      stationuuid: "a",
      name: "Test",
      url: "http://stream.test/live",
      favicon: "http://logos.test/icon.png",
    });
    expect(station?.faviconUrl).toBe("https://logos.test/icon.png");
    // Streams are a separate problem: upgrading one that does not answer on
    // https would break playback outright. Tracked in TASK-72.
    expect(station?.streamUrl).toBe("http://stream.test/live");
  });
});
