import { describe, expect, it } from "vitest";
import {
  isAbort,
  isAutoplayBlocked,
  shouldRetry,
  sourceStrategy,
  streamCandidates,
} from "@/lib/player/engine-utils";

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

describe("streamCandidates", () => {
  it("tries https first and keeps the station's own address as a fallback", () => {
    // 44% of stations are filed under http. Measured live, 11 of 12 of those
    // hosts serve the same stream over https and just have the old address.
    expect(streamCandidates("http://stream.test/live")).toEqual([
      "https://stream.test/live",
      "http://stream.test/live",
    ]);
  });

  it("leaves a secure address alone, with nothing to fall back to", () => {
    expect(streamCandidates("https://stream.test/live")).toEqual(["https://stream.test/live"]);
  });

  it("keeps the port, path and query", () => {
    expect(streamCandidates("http://host.test:8000/live?x=1")[0]).toBe(
      "https://host.test:8000/live?x=1",
    );
  });

  it("does not rewrite a host that merely begins with http", () => {
    expect(streamCandidates("https://httpstream.test/live")).toEqual([
      "https://httpstream.test/live",
    ]);
  });
});
