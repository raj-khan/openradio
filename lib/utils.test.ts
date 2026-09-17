import { describe, expect, it } from "vitest";
import { clamp } from "@/lib/utils";

describe("clamp", () => {
  it("keeps values inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps values outside the range", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});
