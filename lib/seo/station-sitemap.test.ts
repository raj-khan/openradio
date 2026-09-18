import { describe, expect, it } from "vitest";
import {
  isIndexable,
  MAX_SITEMAP_STATIONS,
  rankForSitemap,
  stationSitemapEntries,
} from "@/lib/seo/station-sitemap";
import { makeStation } from "@/test/fixtures";

const good = (id: string, over: Parameters<typeof makeStation>[1] = {}) =>
  makeStation(id, {
    countryCode: "GB",
    bitrate: 128,
    tags: ["jazz"],
    votes: 10,
    clickCount: 5,
    ...over,
  });

describe("isIndexable", () => {
  it("accepts a station with something on its page", () => {
    expect(isIndexable(good("a"))).toBe(true);
  });

  it("rejects the ones that would make a thin or dead page", () => {
    expect(isIndexable(good("a", { lastCheckOk: false })), "off air").toBe(false);
    expect(isIndexable(good("b", { countryCode: undefined })), "no country").toBe(false);
    expect(isIndexable(good("c", { bitrate: 16 })), "below the floor").toBe(false);
    expect(isIndexable(good("d", { votes: 0, clickCount: 0 })), "never played").toBe(false);
    expect(
      isIndexable(good("e", { tags: [], homepageUrl: undefined })),
      "nothing to say about it",
    ).toBe(false);
  });

  it("keeps a low bitrate talk station, which is not a quality problem", () => {
    expect(isIndexable(good("a", { bitrate: 48, tags: ["news"] }))).toBe(true);
  });

  it("keeps a tagless station that at least links somewhere", () => {
    expect(isIndexable(good("a", { tags: [], homepageUrl: "https://example.com" }))).toBe(true);
  });
});

describe("rankForSitemap", () => {
  it("puts the most wanted first, so the cap keeps the right ones", () => {
    const ranked = rankForSitemap([
      good("quiet", { votes: 1, clickCount: 0 }),
      good("loud", { votes: 900, clickCount: 900 }),
      good("middling", { votes: 50, clickCount: 20 }),
    ]);
    expect(ranked.map((s) => s.id)).toEqual(["loud", "middling", "quiet"]);
  });

  it("breaks ties predictably rather than by luck", () => {
    const tie = [good("b", { votes: 5, clickCount: 0 }), good("a", { votes: 5, clickCount: 0 })];
    expect(rankForSitemap(tie).map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("does not mutate what it is given", () => {
    const input = [good("a", { votes: 1 }), good("b", { votes: 9 })];
    rankForSitemap(input);
    expect(input.map((s) => s.id)).toEqual(["a", "b"]);
  });
});

describe("stationSitemapEntries", () => {
  it("emits station paths for the ones worth indexing", () => {
    const entries = stationSitemapEntries([good("a"), good("b", { lastCheckOk: false })]);
    expect(entries.map((e) => e.path)).toEqual(["/station/a"]);
  });

  it("reports when the station changed, not when we last probed it", () => {
    // lastCheckedAt moves on every health check. Reporting that as lastModified
    // would claim the page changed when nothing on it did.
    const [entry] = stationSitemapEntries([
      good("a", { lastChangedAt: "2026-09-15T21:37:38Z", lastCheckedAt: "2026-09-18T09:00:00Z" }),
    ]);
    expect(entry.lastModified?.toISOString()).toBe("2026-09-15T21:37:38.000Z");
  });

  it("leaves lastModified off rather than inventing one", () => {
    expect(
      stationSitemapEntries([good("a", { lastChangedAt: undefined })])[0].lastModified,
    ).toBeUndefined();
    expect(
      stationSitemapEntries([good("b", { lastChangedAt: "not a date" })])[0].lastModified,
    ).toBeUndefined();
  });

  it("honours the cap", () => {
    const many = Array.from({ length: 30 }, (_, i) => good(`s${i}`, { votes: i + 1 }));
    expect(stationSitemapEntries(many, 10)).toHaveLength(10);
    expect(MAX_SITEMAP_STATIONS).toBeLessThan(50_000); // one file's worth
  });

  it("never lists the same station twice", () => {
    const entries = stationSitemapEntries([good("a"), good("a"), good("b")]);
    expect(entries).toHaveLength(2);
  });
});
