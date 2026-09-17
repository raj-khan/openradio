import { describe, expect, it } from "vitest";
import { shouldPoll } from "@/lib/now-playing/store";

describe("shouldPoll", () => {
  it("polls only while playing a non-HLS station", () => {
    expect(shouldPoll("playing", { isHls: false })).toBe(true);
    expect(shouldPoll("playing", { isHls: true })).toBe(false);
    expect(shouldPoll("paused", { isHls: false })).toBe(false);
    expect(shouldPoll("buffering", { isHls: false })).toBe(false);
    expect(shouldPoll("playing", null)).toBe(false);
  });
});
