// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeStation } from "@/test/fixtures";

async function freshStore() {
  vi.resetModules();
  const mod = await import("@/lib/library/favorites");
  await mod.useFavorites.persist.rehydrate();
  return mod;
}

describe("favorites store", () => {
  beforeEach(() => localStorage.clear());

  it("toggles favorites newest first", async () => {
    const { useFavorites } = await freshStore();
    useFavorites.getState().toggle(makeStation("a"));
    useFavorites.getState().toggle(makeStation("b"));
    expect(useFavorites.getState().stations.map((s) => s.id)).toEqual(["b", "a"]);
    useFavorites.getState().toggle(makeStation("a"));
    expect(useFavorites.getState().stations.map((s) => s.id)).toEqual(["b"]);
  });

  it("persists across reloads", async () => {
    let mod = await freshStore();
    mod.useFavorites.getState().toggle(makeStation("a"));
    mod = await freshStore();
    expect(mod.useFavorites.getState().stations.map((s) => s.id)).toEqual(["a"]);
  });

  it("caps the list", async () => {
    const { useFavorites, MAX_FAVORITES } = await freshStore();
    for (let i = 0; i < MAX_FAVORITES + 5; i++)
      useFavorites.getState().toggle(makeStation(`s${i}`));
    expect(useFavorites.getState().stations).toHaveLength(MAX_FAVORITES);
    expect(useFavorites.getState().stations[0].id).toBe(`s${MAX_FAVORITES + 4}`);
  });

  it("removes and clears", async () => {
    const { useFavorites } = await freshStore();
    useFavorites.getState().toggle(makeStation("a"));
    useFavorites.getState().toggle(makeStation("b"));
    useFavorites.getState().remove("a");
    expect(useFavorites.getState().stations.map((s) => s.id)).toEqual(["b"]);
    useFavorites.getState().clear();
    expect(useFavorites.getState().stations).toEqual([]);
  });
});
