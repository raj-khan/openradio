import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeStation } from "@/test/fixtures";

const search = vi.fn();
vi.mock("@/lib/stations", () => ({ getStationProvider: () => ({ search }) }));

import { GET } from "@/app/api/surprise/route";

describe("GET /api/surprise", () => {
  beforeEach(() => {
    search.mockReset();
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
});
