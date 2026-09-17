import { beforeEach, describe, expect, it, vi } from "vitest";

const getById = vi.fn();
const reportClick = vi.fn();
vi.mock("@/lib/stations", () => ({ getStationProvider: () => ({ getById, reportClick }) }));

const pending: Promise<unknown>[] = [];
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => Promise<unknown>) => pending.push(task()),
}));

import { POST } from "@/app/api/stations/[id]/click/route";
import { GET } from "@/app/api/stations/[id]/route";

const uuid = "042d3140-227c-4fac-9387-4903b692d5f2";
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const request = new Request("http://localhost/api/stations/x");

describe("GET /api/stations/[id]", () => {
  beforeEach(() => {
    getById.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns the station", async () => {
    getById.mockResolvedValue({ id: uuid, name: "A" });
    const response = await GET(request, ctx(uuid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ station: { id: uuid, name: "A" } });
  });

  it("returns 404 for invalid ids without calling the provider", async () => {
    const response = await GET(request, ctx("../../etc"));
    expect(response.status).toBe(404);
    expect(getById).not.toHaveBeenCalled();
  });

  it("returns 404 for unknown stations", async () => {
    getById.mockResolvedValue(null);
    expect((await GET(request, ctx(uuid))).status).toBe(404);
  });

  it("returns 502 when the provider fails", async () => {
    getById.mockRejectedValue(new Error("boom"));
    expect((await GET(request, ctx(uuid))).status).toBe(502);
  });
});

describe("POST /api/stations/[id]/click", () => {
  beforeEach(() => {
    reportClick.mockReset();
    pending.length = 0;
  });

  it("accepts immediately and reports in the background", async () => {
    reportClick.mockResolvedValue(undefined);
    const response = await POST(request, ctx(uuid));
    expect(response.status).toBe(202);
    await Promise.all(pending);
    expect(reportClick).toHaveBeenCalledWith(uuid);
  });

  it("swallows provider errors", async () => {
    reportClick.mockRejectedValue(new Error("down"));
    const response = await POST(request, ctx(uuid));
    expect(response.status).toBe(202);
    await expect(Promise.all(pending)).resolves.toBeDefined();
  });

  it("rejects invalid ids", async () => {
    expect((await POST(request, ctx("nope"))).status).toBe(404);
    expect(reportClick).not.toHaveBeenCalled();
  });
});
