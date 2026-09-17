import { describe, expect, it } from "vitest";
import { DEFAULT_LIMIT, parseStationQuery, stationIdSchema } from "@/lib/stations/types";

describe("parseStationQuery", () => {
  it("applies defaults to an empty query", () => {
    const result = parseStationQuery({});
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ order: "popular", limit: DEFAULT_LIMIT, offset: 0 });
  });

  it("normalizes values from search params", () => {
    const result = parseStationQuery({
      text: "  jazz fm ",
      country: "bd",
      language: "Bengali",
      tag: "Music",
      order: "votes",
      limit: "20",
      offset: "40",
    });
    expect(result.data).toEqual({
      text: "jazz fm",
      country: "BD",
      language: "bengali",
      tag: "music",
      order: "votes",
      limit: 20,
      offset: 40,
    });
  });

  it("treats blank strings as missing", () => {
    const result = parseStationQuery({ text: "   ", tag: "" });
    expect(result.data?.text).toBeUndefined();
    expect(result.data?.tag).toBeUndefined();
  });

  it.each([
    [{ country: "BGD" }],
    [{ order: "loudest" }],
    [{ limit: 0 }],
    [{ limit: 101 }],
    [{ offset: -1 }],
    [{ limit: "ten" }],
    [{ text: "x".repeat(101) }],
  ])("rejects invalid query %j", (input) => {
    expect(parseStationQuery(input).success).toBe(false);
  });
});

describe("stationIdSchema", () => {
  it("accepts Radio Browser UUIDs", () => {
    expect(stationIdSchema.safeParse("042d3140-227c-4fac-9387-4903b692d5f2").success).toBe(true);
  });

  it("rejects other strings", () => {
    expect(stationIdSchema.safeParse("../etc/passwd").success).toBe(false);
  });
});
