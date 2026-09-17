import { beforeEach, describe, expect, it, vi } from "vitest";

const search = vi.fn();
vi.mock("@/lib/stations", () => ({ getStationProvider: () => ({ search }) }));

import { GET } from "@/app/api/stations/route";

const call = (qs: string) => GET(new Request(`http://localhost/api/stations${qs}`));

describe("GET /api/stations", () => {
  beforeEach(() => {
    search.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns stations for a valid query", async () => {
    search.mockResolvedValue([{ id: "1", name: "A" }]);
    const response = await call("?country=jp&tag=Jazz&limit=5");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ stations: [{ id: "1", name: "A" }] });
    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({ country: "JP", tag: "jazz", limit: 5, order: "popular" }),
    );
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=600");
  });

  it("does not cache random results", async () => {
    search.mockResolvedValue([]);
    const response = await call("?order=random");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("returns 400 for invalid params", async () => {
    const response = await call("?limit=5000");
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/invalid/i);
    expect(search).not.toHaveBeenCalled();
  });

  it("returns a friendly 502 when the provider fails", async () => {
    search.mockRejectedValue(new Error("secret upstream detail"));
    const response = await call("");
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).not.toContain("secret");
  });
});
