import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeStation } from "@/test/fixtures";
import type { Station } from "@/lib/stations/types";

const search = vi.fn();
vi.mock("@/lib/stations", () => ({ getStationProvider: () => ({ search }) }));

// No real network in a unit test: decide reachability per URL. Replaces
// firstReachable rather than probeStream, which it captures in module scope.
// firstReachable's own ordering is covered in lib/stations/stream-probe.test.ts.
const reachable = vi.fn<(url: string) => Promise<boolean>>();
vi.mock("@/lib/stations/stream-probe", () => ({
  PROBE_WIDTH: 4,
  firstReachable: async (candidates: Station[]) => {
    for (const station of candidates.slice(0, 4)) {
      if (await reachable(station.streamUrl)) return station;
    }
    return undefined;
  },
}));

import { GET } from "@/app/api/surprise/route";

describe("GET /api/surprise", () => {
  beforeEach(() => {
    search.mockReset();
    reachable.mockReset();
    reachable.mockResolvedValue(true);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns a healthy random station without caching", async () => {
    search.mockResolvedValue([
      makeStation("a", { countryCode: "JP", bitrate: 128 }),
      makeStation("b", { countryCode: "BR", bitrate: 16 }),
    ]);
    const response = await GET(new Request("http://localhost/api/surprise"));
    expect((await response.json()).station.id).toBe("a");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const query = search.mock.calls[0][0];
    expect(query).toMatchObject({ order: "popular", limit: 40 });
    expect(query.offset).toBeGreaterThanOrEqual(0);
    expect(query.offset).toBeLessThan(4000);
  });

  it("prefers another country", async () => {
    search.mockResolvedValue([
      makeStation("a", { countryCode: "JP", bitrate: 128 }),
      makeStation("b", { countryCode: "GE", bitrate: 128 }),
    ]);
    const response = await GET(new Request("http://localhost/api/surprise?not=jp"));
    expect((await response.json()).station.id).toBe("b");
  });

  it("404s when nothing qualifies and 502s on provider failure", async () => {
    search.mockResolvedValue([]);
    expect((await GET(new Request("http://localhost/api/surprise"))).status).toBe(404);
    search.mockRejectedValue(new Error("down"));
    expect((await GET(new Request("http://localhost/api/surprise"))).status).toBe(502);
  });

  it("skips a station that does not answer right now", async () => {
    // Radio Browser calls both healthy; only the second actually responds.
    search.mockResolvedValue([
      makeStation("dead", { countryCode: "JP", bitrate: 128, streamUrl: "https://dead.test/s" }),
      makeStation("live", { countryCode: "JP", bitrate: 128, streamUrl: "https://live.test/s" }),
    ]);
    reachable.mockImplementation(async (url: string) => url.startsWith("https://live"));
    const body = await (await GET(new Request("http://localhost/api/surprise"))).json();
    expect(body.station.id).toBe("live");
  });

  it("offers the rest as alternates for the browser to fall back on", async () => {
    search.mockResolvedValue(
      ["a", "b", "c"].map((id) => makeStation(id, { countryCode: "JP", bitrate: 128 })),
    );
    const body = await (await GET(new Request("http://localhost/api/surprise"))).json();
    expect(body.alternates).toHaveLength(2);
    expect(body.alternates.map((s: { id: string }) => s.id)).not.toContain(body.station.id);
  });

  it("still returns something when nothing answers the probe", async () => {
    // Better to hand over a station and let the player try than to give up.
    search.mockResolvedValue([makeStation("a", { countryCode: "JP", bitrate: 128 })]);
    reachable.mockResolvedValue(false);
    const response = await GET(new Request("http://localhost/api/surprise"));
    expect(response.status).toBe(200);
    expect((await response.json()).station.id).toBe("a");
  });
});

describe("GET /api/surprise?country=", () => {
  it("keeps to the country the dial asked for, and takes a full page", async () => {
    search.mockResolvedValue([makeStation("a", { countryCode: "BD", bitrate: 128 })]);
    const body = await (await GET(new Request("http://localhost/api/surprise?country=bd"))).json();
    expect(body.station.id).toBe("a");
    expect(search.mock.calls[0][0]).toMatchObject({ country: "BD", limit: 100 });
  });

  it("says so rather than handing over music when a country has no voices", async () => {
    // Cairo really does have no talk stations we can see. Falling back to music
    // would hide that from the listener, which is what it used to do.
    search.mockResolvedValue([
      makeStation("m", { countryCode: "EG", bitrate: 128, tags: ["pop"] }),
    ]);
    const response = await GET(new Request("http://localhost/api/surprise?country=eg&mode=talk"));
    expect(response.status).toBe(404);
    expect((await response.json()).error).toMatch(/no voices stations/i);
  });

  it("still relaxes the mode when picking from the whole world", async () => {
    // Somewhere else always exists, so refusing would be unhelpful here.
    search.mockResolvedValue([
      makeStation("m", { countryCode: "EG", bitrate: 128, tags: ["pop"] }),
    ]);
    const response = await GET(new Request("http://localhost/api/surprise?mode=talk"));
    expect(response.status).toBe(200);
    expect((await response.json()).station.id).toBe("m");
  });

  it("ignores a country that is not a two letter code", async () => {
    search.mockResolvedValue([makeStation("a", { countryCode: "JP", bitrate: 128 })]);
    await GET(new Request("http://localhost/api/surprise?country=bangladesh"));
    expect(search.mock.calls[0][0].country).toBeUndefined();
  });
});

describe("widening a country that has nothing of the kind asked for", () => {
  beforeEach(() => {
    search.mockReset();
    reachable.mockReset();
    reachable.mockResolvedValue(true);
  });

  const local = (id: string) =>
    makeStation(id, { countryCode: "BF", languages: ["french"], tags: ["pop"], bitrate: 128 });

  it("offers the country's language from elsewhere rather than refusing", async () => {
    // Burkina Faso has six stations on file and no talk radio among them, but
    // French voice radio is plentiful. A relevant station beats a dead end.
    search
      .mockResolvedValueOnce([local("a"), local("b"), local("c"), local("d"), local("e")])
      .mockResolvedValueOnce([
        makeStation("rmc", {
          countryCode: "FR",
          languages: ["french"],
          tags: ["talk"],
          bitrate: 128,
        }),
      ]);
    const response = await GET(new Request("http://localhost/api/surprise?country=BF&mode=talk"));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.station.id).toBe("rmc");
    expect(body.widenedTo).toEqual({ language: "french" });
    expect(search.mock.calls[1][0]).toMatchObject({ language: "french" });
  });

  it("still refuses when no language clearly speaks for the country", async () => {
    // One relayed Quran channel must not make Arabic speak for a territory.
    search.mockResolvedValueOnce([
      makeStation("x", { countryCode: "TV", languages: ["arabic"], tags: ["pop"], bitrate: 128 }),
      makeStation("y", { countryCode: "TV", tags: ["pop"], bitrate: 128 }),
      makeStation("z", { countryCode: "TV", tags: ["pop"], bitrate: 128 }),
    ]);
    const response = await GET(new Request("http://localhost/api/surprise?country=TV&mode=talk"));
    expect(response.status).toBe(404);
    expect(search).toHaveBeenCalledTimes(1);
    expect(await response.json()).toMatchObject({ error: expect.stringContaining("No voices") });
  });

  it("does not widen when the listener asked for anything", async () => {
    search.mockResolvedValueOnce([]);
    const response = await GET(new Request("http://localhost/api/surprise?country=BF"));
    expect(response.status).toBe(404);
    expect(search).toHaveBeenCalledTimes(1);
  });
});
