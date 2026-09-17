import { describe, expect, it } from "vitest";
import { filtersToQueryString, firstValues, hasFilters } from "@/lib/stations/query-string";

describe("query string helpers", () => {
  it("takes first values", () => {
    expect(firstValues({ a: ["1", "2"], b: "3", c: undefined })).toEqual({ a: "1", b: "3" });
  });

  it("serializes filters without defaults", () => {
    expect(
      filtersToQueryString({ text: "jazz fm", country: "JP", order: "popular", tag: undefined }),
    ).toBe("text=jazz+fm&country=JP");
    expect(filtersToQueryString({ order: "votes" }, { offset: 30, limit: undefined })).toBe(
      "order=votes&offset=30",
    );
  });

  it("detects active filters", () => {
    expect(hasFilters({ order: "votes" })).toBe(false);
    expect(hasFilters({ tag: "jazz" })).toBe(true);
  });
});
