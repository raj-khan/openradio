// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeStation } from "@/test/fixtures";

async function freshStore() {
  vi.resetModules();
  const mod = await import("@/lib/library/history");
  await mod.useHistory.persist.rehydrate();
  return mod;
}

describe("history store", () => {
  beforeEach(() => localStorage.clear());

  it("records newest first and dedupes", async () => {
    const { useHistory } = await freshStore();
    useHistory.getState().record(makeStation("a"), 1);
    useHistory.getState().record(makeStation("b"), 2);
    useHistory.getState().record(makeStation("a"), 3);
    expect(useHistory.getState().entries.map((e) => [e.station.id, e.playedAt])).toEqual([
      ["a", 3],
      ["b", 2],
    ]);
  });

  it("caps at the maximum and persists", async () => {
    let mod = await freshStore();
    for (let i = 0; i < mod.MAX_HISTORY + 3; i++)
      mod.useHistory.getState().record(makeStation(`s${i}`), i);
    mod = await freshStore();
    expect(mod.useHistory.getState().entries).toHaveLength(mod.MAX_HISTORY);
  });

  it("clears", async () => {
    const { useHistory } = await freshStore();
    useHistory.getState().record(makeStation("a"));
    useHistory.getState().clear();
    expect(useHistory.getState().entries).toEqual([]);
  });
});

describe("relativeTime", () => {
  it("formats durations", async () => {
    const { relativeTime } = await import("@/lib/library/history");
    const now = Date.UTC(2026, 8, 18, 12);
    expect(relativeTime(now - 10_000, now)).toBe("just now");
    expect(relativeTime(now - 5 * 60_000, now)).toBe("5 min ago");
    expect(relativeTime(now - 3 * 3_600_000, now)).toBe("3 h ago");
    expect(relativeTime(now - 26 * 3_600_000, now)).toBe("yesterday");
    expect(relativeTime(now - 3 * 86_400_000, now)).toBe("3 days ago");
    expect(relativeTime(now - 30 * 86_400_000, now)).toMatch(/Aug/);
  });
});
