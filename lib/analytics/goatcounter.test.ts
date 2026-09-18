import { afterEach, describe, expect, it, vi } from "vitest";
import {
  countPixelUrl,
  fetchVisitTotals,
  formatVisits,
  goatcounterOrigin,
  parseTotals,
} from "@/lib/analytics/goatcounter";

afterEach(() => delete process.env.NEXT_PUBLIC_GOATCOUNTER_URL);

describe("goatcounterOrigin", () => {
  it("is disabled unless configured", () => {
    expect(goatcounterOrigin(undefined)).toBeNull();
    expect(goatcounterOrigin("  ")).toBeNull();
  });

  it("accepts a host or full https url and rejects insecure ones", () => {
    expect(goatcounterOrigin("openradio.goatcounter.com")).toBe(
      "https://openradio.goatcounter.com",
    );
    expect(goatcounterOrigin("https://openradio.goatcounter.com/path")).toBe(
      "https://openradio.goatcounter.com",
    );
    expect(goatcounterOrigin("http://insecure.example")).toBeNull();
    expect(goatcounterOrigin("not a url")).toBeNull();
  });

  it("rejects a site code pasted in place of a URL", () => {
    // This shipped: "1287" became https://0.0.5.7, so the counter pixel pointed
    // into the visitor's own network and Chrome prompted every one of them.
    expect(new URL("https://1287").origin).toBe("https://0.0.5.7"); // why it happens
    expect(goatcounterOrigin("1287")).toBeNull();
    expect(goatcounterOrigin("https://1287")).toBeNull();
  });

  it("rejects hosts that are not public domains", () => {
    for (const value of [
      "https://0.0.5.7",
      "https://127.0.0.1",
      "https://192.168.1.10",
      "https://[::1]",
      "https://localhost",
      "https://goatcounter",
      "https://counter.local",
      "https://counter.internal",
    ]) {
      expect(goatcounterOrigin(value), value).toBeNull();
    }
  });

  it("still accepts ordinary domains, including subdomains", () => {
    expect(goatcounterOrigin("stats.openradio.space")).toBe("https://stats.openradio.space");
    expect(goatcounterOrigin("https://a.b.c.goatcounter.com")).toBe(
      "https://a.b.c.goatcounter.com",
    );
  });
});

describe("countPixelUrl", () => {
  const origin = "https://openradio.goatcounter.com";

  it("returns null when disabled", () => {
    expect(countPixelUrl("/", "Home", null)).toBeNull();
  });

  it("builds a pixel url with path and title", () => {
    const url = new URL(countPixelUrl("/tag/jazz", "Jazz radio", origin)!);
    expect(url.origin).toBe(origin);
    expect(url.pathname).toBe("/count");
    expect(url.searchParams.get("p")).toBe("/tag/jazz");
    expect(url.searchParams.get("t")).toBe("Jazz radio");
    expect(url.searchParams.get("rnd")).toBeTruthy();
  });

  it("never sends anything but a path", () => {
    expect(new URL(countPixelUrl("https://evil.test/x", "t", origin)!).searchParams.get("p")).toBe(
      "/",
    );
  });
});

describe("parseTotals and fetchVisitTotals", () => {
  it("parses formatted counts", () => {
    expect(parseTotals({ count: "1,234", count_unique: "1,000" })).toEqual({
      count: 1234,
      unique: 1000,
    });
    expect(parseTotals({ count: 42 })).toEqual({ count: 42, unique: 42 });
    expect(parseTotals({})).toBeNull();
    expect(parseTotals("nope")).toBeNull();
  });

  it("returns null when disabled or on failure", async () => {
    await expect(fetchVisitTotals(null)).resolves.toBeNull();
  });
});

describe("formatVisits", () => {
  it("formats compactly", () => {
    expect(formatVisits(999)).toBe("999");
    expect(formatVisits(9999)).toBe("9,999");
    expect(formatVisits(12_345)).toBe("12.3k");
    expect(formatVisits(250_000)).toBe("250k");
    expect(formatVisits(2_500_000)).toBe("2.5m");
  });
});

describe("fetchVisitTotals with a stubbed endpoint", () => {
  it("reads the public totals endpoint and caches it", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ count: "12,345", count_unique: "9,001" }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchVisitTotals("https://openradio.goatcounter.com")).resolves.toEqual({
      count: 12345,
      unique: 9001,
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://openradio.goatcounter.com/counter/TOTAL.json");
    expect(init.next).toEqual({ revalidate: 3600 });
    vi.unstubAllGlobals();
  });

  it("returns null on a failed response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    await expect(fetchVisitTotals("https://openradio.goatcounter.com")).resolves.toBeNull();
    vi.unstubAllGlobals();
  });
});
