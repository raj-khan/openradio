import { describe, expect, it } from "vitest";
import { isAbort, isAutoplayBlocked, shouldRetry, sourceStrategy } from "@/lib/player/engine-utils";

describe("sourceStrategy", () => {
  it("plays regular streams natively", () => {
    expect(sourceStrategy({ isHls: false }, { nativeHls: false, hlsJs: false })).toBe("native");
  });

  it("prefers native HLS when available", () => {
    expect(sourceStrategy({ isHls: true }, { nativeHls: true, hlsJs: true })).toBe("native");
  });

  it("falls back to hls.js", () => {
    expect(sourceStrategy({ isHls: true }, { nativeHls: false, hlsJs: true })).toBe("hls.js");
  });

  it("reports unsupported HLS", () => {
    expect(sourceStrategy({ isHls: true }, { nativeHls: false, hlsJs: false })).toBe("unsupported");
  });
});

describe("retry and error helpers", () => {
  it("retries only once", () => {
    expect(shouldRetry(0)).toBe(true);
    expect(shouldRetry(1)).toBe(false);
  });

  it("classifies DOM exceptions", () => {
    expect(isAutoplayBlocked(new DOMException("x", "NotAllowedError"))).toBe(true);
    expect(isAutoplayBlocked(new Error("x"))).toBe(false);
    expect(isAbort(new DOMException("x", "AbortError"))).toBe(true);
  });
});
