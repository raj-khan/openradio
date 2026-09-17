import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  RadioBrowserError,
  USER_AGENT,
  buildUrl,
  radioBrowserGet,
  resetMirrorCache,
} from "@/lib/stations/radio-browser-client";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("buildUrl", () => {
  it("joins path and skips empty params", () => {
    expect(
      buildUrl("https://de1.api.radio-browser.info", "/json/stations/search", {
        name: "jazz fm",
        tag: undefined,
        country: "",
        limit: 10,
        hidebroken: true,
      }),
    ).toBe(
      "https://de1.api.radio-browser.info/json/stations/search?name=jazz+fm&limit=10&hidebroken=true",
    );
  });
});

describe("radioBrowserGet", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    resetMirrorCache();
    vi.stubGlobal("fetch", fetchMock);
    delete process.env.RADIO_BROWSER_BASE_URL;
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("uses the base url override and sends a User-Agent", async () => {
    process.env.RADIO_BROWSER_BASE_URL = "https://mirror.test/";
    fetchMock.mockResolvedValueOnce(json([{ ok: true }]));

    await expect(radioBrowserGet("/json/tags", { limit: 5 })).resolves.toEqual([{ ok: true }]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://mirror.test/json/tags?limit=5");
    expect(init.headers["User-Agent"]).toBe(USER_AGENT);
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.next).toEqual({ revalidate: 600 });
  });

  it("resolves mirrors and retries once on a different mirror", async () => {
    fetchMock
      .mockResolvedValueOnce(json([{ name: "a.api.test" }, { name: "b.api.test" }]))
      .mockRejectedValueOnce(new TypeError("network down"))
      .mockResolvedValueOnce(json(["second"]));

    await expect(radioBrowserGet("/json/countries")).resolves.toEqual(["second"]);

    const first = new URL(fetchMock.mock.calls[1][0]).host;
    const second = new URL(fetchMock.mock.calls[2][0]).host;
    expect(first).not.toBe(second);
    expect([first, second].sort()).toEqual(["a.api.test", "b.api.test"]);
  });

  it("does not retry client errors", async () => {
    process.env.RADIO_BROWSER_BASE_URL = "https://mirror.test";
    fetchMock.mockResolvedValue(json({ error: "bad" }, 400));

    await expect(radioBrowserGet("/json/stations/byuuid/x")).rejects.toMatchObject({
      status: 400,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("gives up after one retry", async () => {
    process.env.RADIO_BROWSER_BASE_URL = "https://mirror.test";
    fetchMock.mockResolvedValue(json({}, 503));

    await expect(radioBrowserGet("/json/tags")).rejects.toBeInstanceOf(RadioBrowserError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back to a known mirror when the mirror list fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("dns")).mockResolvedValueOnce(json([]));

    await radioBrowserGet("/json/tags", {}, { revalidate: 0 });

    expect(fetchMock.mock.calls[1][0]).toMatch(/^https:\/\/de1\.api\.radio-browser\.info\//);
    expect(fetchMock.mock.calls[1][1].cache).toBe("no-store");
  });
});
