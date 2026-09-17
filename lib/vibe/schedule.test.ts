import { describe, expect, it } from "vitest";
import { MIN_VIBE_INTERVAL_MS, shouldApplyVibe } from "@/lib/vibe/schedule";

describe("shouldApplyVibe", () => {
  const prev = { stationId: "a", mood: "calm", appliedAt: 1000 };

  it("applies immediately when the station changes", () => {
    expect(shouldApplyVibe(prev, { stationId: "b", mood: "calm" }, 1001)).toBe(true);
    expect(shouldApplyVibe(prev, { stationId: null, mood: "neutral" }, 1001)).toBe(true);
  });

  it("ignores unchanged moods", () => {
    expect(shouldApplyVibe(prev, { stationId: "a", mood: "calm" }, 999_999)).toBe(false);
  });

  it("throttles mood changes for the same station", () => {
    expect(
      shouldApplyVibe(prev, { stationId: "a", mood: "joyful" }, 1000 + MIN_VIBE_INTERVAL_MS - 1),
    ).toBe(false);
    expect(
      shouldApplyVibe(prev, { stationId: "a", mood: "joyful" }, 1000 + MIN_VIBE_INTERVAL_MS),
    ).toBe(true);
  });
});
