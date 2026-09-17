import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeStation } from "@/test/fixtures";

const getById = vi.fn();
const fetchNowPlaying = vi.fn();
vi.mock("@/lib/stations", () => ({ getStationProvider: () => ({ getById }) }));
vi.mock("@/lib/now-playing/fetch-title", () => ({
  fetchNowPlaying: (...a: unknown[]) => fetchNowPlaying(...a),
}));

const uuid = "042d3140-227c-4fac-9387-4903b692d5f2";
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const req = (ip = "1.1.1.1") =>
  new Request(`http://localhost/api/now-playing/${uuid}?url=http://169.254.169.254/`, {
    headers: { "x-forwarded-for": ip },
  });

describe("GET /api/now-playing/[id]", () => {
  beforeEach(() => {
    vi.resetModules();
    getById.mockReset();
    fetchNowPlaying.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  const load = async () => (await import("@/app/api/now-playing/[id]/route")).GET;

  it("returns the title for the directory's stream URL, ignoring client input", async () => {
    const station = makeStation(uuid);
    getById.mockResolvedValue(station);
    fetchNowPlaying.mockResolvedValue("Artist - Song");
    const GET = await load();
    const response = await GET(req(), ctx(uuid));
    expect(await response.json()).toEqual({ title: "Artist - Song" });
    expect(fetchNowPlaying).toHaveBeenCalledWith(station);
  });

  it("404s invalid and unknown stations", async () => {
    const GET = await load();
    expect((await GET(req(), ctx("nope"))).status).toBe(404);
    getById.mockResolvedValue(null);
    expect((await GET(req(), ctx(uuid))).status).toBe(404);
  });

  it("returns title null when lookups fail", async () => {
    getById.mockRejectedValue(new Error("down"));
    const GET = await load();
    const response = await GET(req(), ctx(uuid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ title: null });
  });

  it("rate limits per client", async () => {
    getById.mockResolvedValue(makeStation(uuid));
    fetchNowPlaying.mockResolvedValue(null);
    const GET = await load();
    for (let i = 0; i < 30; i++) expect((await GET(req("9.9.9.9"), ctx(uuid))).status).toBe(200);
    const limited = await GET(req("9.9.9.9"), ctx(uuid));
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBeTruthy();
    expect((await GET(req("8.8.8.8"), ctx(uuid))).status).toBe(200);
  });
});
