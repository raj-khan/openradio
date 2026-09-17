// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeStation as station } from "@/test/fixtures";

async function freshStore() {
  vi.resetModules();
  return (await import("@/lib/player/store")).usePlayerStore;
}

describe("player store", () => {
  beforeEach(() => localStorage.clear());

  it("plays, toggles and resumes the same station", async () => {
    const store = await freshStore();
    store.getState().play(station("a"));
    expect(store.getState().status).toBe("loading");
    store.getState().dispatch({ type: "PLAYING" });

    store.getState().toggle();
    expect(store.getState().status).toBe("paused");

    const session = store.getState().session;
    store.getState().play(station("a"));
    expect(store.getState()).toMatchObject({ status: "loading", session });
  });

  it("does not reload a station that is already playing", async () => {
    const store = await freshStore();
    store.getState().play(station("a"));
    const session = store.getState().session;
    store.getState().play(station("a"));
    expect(store.getState().session).toBe(session);
  });

  it("switches stations", async () => {
    const store = await freshStore();
    store.getState().play(station("a"));
    store.getState().play(station("b"));
    expect(store.getState().station?.id).toBe("b");
  });

  it("clamps volume and unmutes on change", async () => {
    const store = await freshStore();
    store.getState().toggleMute();
    store.getState().setVolume(3);
    expect(store.getState()).toMatchObject({ volume: 1, muted: false });
    store.getState().setVolume(Number.NaN);
    expect(store.getState().volume).toBe(0);
  });

  it("persists only volume and mute", async () => {
    let store = await freshStore();
    store.getState().setVolume(0.3);
    store.getState().toggleMute();
    store.getState().play(station("a"));

    const saved = JSON.parse(localStorage.getItem("radio-atlas:player") ?? "{}");
    expect(saved.state).toEqual({ volume: 0.3, muted: true });

    store = await freshStore();
    expect(store.getState()).toMatchObject({ volume: 0.3, muted: true, status: "idle" });
  });
});
