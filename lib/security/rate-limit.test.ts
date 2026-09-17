import { describe, expect, it } from "vitest";
import { clientKey, createRateLimiter, retryAfterSeconds } from "@/lib/security/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit per window", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("a", 0)).toMatchObject({ ok: true, remaining: 1 });
    expect(check("a", 10)).toMatchObject({ ok: true, remaining: 0 });
    const blocked = check("a", 20);
    expect(blocked.ok).toBe(false);
    expect(retryAfterSeconds(blocked, 20)).toBe(1);
    expect(check("b", 20).ok).toBe(true);
    expect(check("a", 1000).ok).toBe(true);
  });
});

describe("clientKey", () => {
  it("uses the first forwarded address", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 10.0.0.1" } });
    expect(clientKey(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip or anonymous", () => {
    expect(clientKey(new Request("http://x", { headers: { "x-real-ip": "5.6.7.8" } }))).toBe(
      "5.6.7.8",
    );
    expect(clientKey(new Request("http://x"))).toBe("anonymous");
  });
});
