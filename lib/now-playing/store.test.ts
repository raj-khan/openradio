import { describe, expect, it } from "vitest";
import {
  NOW_PLAYING_HIDDEN_INTERVAL_MS,
  NOW_PLAYING_INTERVAL_MS,
  nowPlayingDelay,
  shouldPoll,
} from "@/lib/now-playing/store";

describe("shouldPoll", () => {
  it("polls only while playing a non-HLS station", () => {
    expect(shouldPoll("playing", { isHls: false })).toBe(true);
    expect(shouldPoll("playing", { isHls: true })).toBe(false);
    expect(shouldPoll("paused", { isHls: false })).toBe(false);
    expect(shouldPoll("buffering", { isHls: false })).toBe(false);
    expect(shouldPoll("playing", null)).toBe(false);
  });
});

describe("nowPlayingDelay", () => {
  it("waits far longer between polls in a hidden tab", () => {
    expect(nowPlayingDelay(false)).toBe(NOW_PLAYING_INTERVAL_MS);
    expect(nowPlayingDelay(true)).toBe(NOW_PLAYING_HIDDEN_INTERVAL_MS);
    expect(NOW_PLAYING_HIDDEN_INTERVAL_MS).toBeGreaterThan(NOW_PLAYING_INTERVAL_MS);
  });
});
