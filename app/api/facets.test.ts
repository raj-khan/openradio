import { beforeEach, describe, expect, it, vi } from "vitest";

const provider = { getCountries: vi.fn(), getLanguages: vi.fn(), getTags: vi.fn() };
vi.mock("@/lib/stations", () => ({ getStationProvider: () => provider }));

import { GET as countries } from "@/app/api/countries/route";
import { GET as languages } from "@/app/api/languages/route";
import { GET as tags } from "@/app/api/tags/route";

describe("facet routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns countries cached for a day", async () => {
    provider.getCountries.mockResolvedValue([{ name: "Japan", code: "JP", stationCount: 1 }]);
    const response = await countries();
    expect(await response.json()).toEqual({
      items: [{ name: "Japan", code: "JP", stationCount: 1 }],
    });
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=86400");
  });

  it("returns 502 when languages fail", async () => {
    provider.getLanguages.mockRejectedValue(new Error("down"));
    expect((await languages()).status).toBe(502);
  });

  it("passes the tag limit", async () => {
    provider.getTags.mockResolvedValue([]);
    await tags(new Request("http://localhost/api/tags?limit=20"));
    expect(provider.getTags).toHaveBeenCalledWith(20);
  });

  it("defaults the tag limit", async () => {
    provider.getTags.mockResolvedValue([]);
    await tags(new Request("http://localhost/api/tags"));
    expect(provider.getTags).toHaveBeenCalledWith(100);
  });

  it("rejects invalid tag limits", async () => {
    expect((await tags(new Request("http://localhost/api/tags?limit=9999"))).status).toBe(400);
  });
});
