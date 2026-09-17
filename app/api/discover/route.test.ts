import { beforeEach, describe, expect, it, vi } from "vitest";

const runDiscover = vi.fn();
vi.mock("@/lib/discover/run", () => ({ runDiscover: (...a: unknown[]) => runDiscover(...a) }));

const post = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/discover", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/discover", () => {
  beforeEach(() => {
    vi.resetModules();
    runDiscover.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  const load = async () => (await import("@/app/api/discover/route")).POST;

  it("runs discovery for a valid prompt", async () => {
    runDiscover.mockResolvedValue({ prompt: "jazz", stations: [] });
    const POST = await load();
    const response = await POST(post({ prompt: "  jazz  " }));
    expect(response.status).toBe(200);
    expect(runDiscover).toHaveBeenCalledWith("jazz");
  });

  it.each([{}, { prompt: "" }, { prompt: "x".repeat(201) }, "not json"])(
    "rejects invalid body %j",
    async (body) => {
      const POST = await load();
      expect((await POST(post(body))).status).toBe(400);
    },
  );

  it("rate limits", async () => {
    runDiscover.mockResolvedValue({});
    const POST = await load();
    for (let i = 0; i < 20; i++) await POST(post({ prompt: "jazz" }, "7.7.7.7"));
    expect((await POST(post({ prompt: "jazz" }, "7.7.7.7"))).status).toBe(429);
  });

  it("returns a friendly 502 on failure", async () => {
    runDiscover.mockRejectedValue(new Error("boom"));
    const POST = await load();
    expect((await POST(post({ prompt: "jazz" }))).status).toBe(502);
  });
});
