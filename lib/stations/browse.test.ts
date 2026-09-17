import { describe, expect, it } from "vitest";
import { parseCountrySegment, parseTermSegment, titleCase } from "@/lib/stations/browse";

describe("browse segment parsing", () => {
  it("accepts known country codes", () => {
    expect(parseCountrySegment("jp")).toEqual({ code: "JP", name: "Japan" });
  });

  it("rejects unknown or malformed countries", () => {
    expect(parseCountrySegment("zz")).toBeNull();
    expect(parseCountrySegment("jpn")).toBeNull();
    expect(parseCountrySegment("1a")).toBeNull();
  });

  it("normalizes terms", () => {
    expect(parseTermSegment("Smooth%20%20Jazz")).toBe("smooth jazz");
    expect(parseTermSegment("r%26b")).toBe("r&b");
    expect(parseTermSegment("%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE")).toBe("বাংলা");
  });

  it("rejects invalid terms", () => {
    expect(parseTermSegment("%E0%A4%A")).toBeNull();
    expect(parseTermSegment("x".repeat(51))).toBeNull();
    expect(parseTermSegment("<script>")).toBeNull();
    expect(parseTermSegment("%20")).toBeNull();
  });

  it("title cases", () => {
    expect(titleCase("hip-hop classics")).toBe("Hip-Hop Classics");
  });
});
