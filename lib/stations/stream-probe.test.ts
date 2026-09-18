import { describe, expect, it, vi } from "vitest";
import { makeStation } from "@/test/fixtures";
import { firstReachable, PROBE_WIDTH } from "@/lib/stations/stream-probe";

const stations = (...ids: string[]) =>
  ids.map((id) => makeStation(id, { streamUrl: `https://example.invalid/${id}` }));

describe("firstReachable", () => {
  it("returns the earliest candidate that answers, not the earliest to reply", async () => {
    // b resolves first, but a is earlier in the list and also answers.
    const probe = vi.fn(async (url: string) => url.endsWith("a") || url.endsWith("b"));
    expect((await firstReachable(stations("a", "b", "c"), probe))?.id).toBe("a");
  });

  it("skips the ones that do not answer", async () => {
    const probe = vi.fn(async (url: string) => url.endsWith("c"));
    expect((await firstReachable(stations("a", "b", "c"), probe))?.id).toBe("c");
  });

  it("gives up when none answer", async () => {
    expect(await firstReachable(stations("a", "b"), async () => false)).toBeUndefined();
  });

  it("handles an empty list without probing", async () => {
    const probe = vi.fn(async () => true);
    expect(await firstReachable([], probe)).toBeUndefined();
    expect(probe).not.toHaveBeenCalled();
  });

  it("probes all candidates at once, so the wait is one timeout not several", async () => {
    let live = 0;
    let peak = 0;
    const probe = vi.fn(async () => {
      peak = Math.max(peak, ++live);
      await new Promise((resolve) => setTimeout(resolve, 5));
      live--;
      return false;
    });
    await firstReachable(stations("a", "b", "c", "d"), probe);
    expect(peak).toBe(4);
  });

  it("never probes more than PROBE_WIDTH stations", async () => {
    const probe = vi.fn(async () => false);
    await firstReachable(stations("a", "b", "c", "d", "e", "f"), probe);
    expect(probe).toHaveBeenCalledTimes(PROBE_WIDTH);
  });
});
