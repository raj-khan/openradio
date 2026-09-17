import { describe, expect, it } from "vitest";
import { initialPlaybackState, transition, type PlaybackState } from "@/lib/player/machine";
import { makeStation as station } from "@/test/fixtures";

const withStatus = (status: PlaybackState["status"]): PlaybackState => ({
  status,
  station: station(),
  error: status === "error" ? "Oops" : null,
  session: 1,
});

describe("player machine", () => {
  it("loads a station and bumps the session", () => {
    const next = transition(initialPlaybackState, { type: "LOAD", station: station() });
    expect(next).toMatchObject({ status: "loading", session: 1, error: null });
    expect(next.station?.id).toBe("a");
  });

  it("follows the happy path", () => {
    let state = transition(initialPlaybackState, { type: "LOAD", station: station() });
    state = transition(state, { type: "PLAYING" });
    expect(state.status).toBe("playing");
    state = transition(state, { type: "WAITING" });
    expect(state.status).toBe("buffering");
    state = transition(state, { type: "PLAYING" });
    state = transition(state, { type: "PAUSE" });
    expect(state.status).toBe("paused");
    state = transition(state, { type: "RESUME" });
    expect(state).toMatchObject({ status: "loading", session: 1 });
  });

  it("reloads the source when resuming from an error", () => {
    const next = transition(withStatus("error"), { type: "RESUME" });
    expect(next).toMatchObject({ status: "loading", error: null, session: 2 });
  });

  it("ignores stray media events", () => {
    const paused = withStatus("paused");
    expect(transition(paused, { type: "PLAYING" })).toBe(paused);
    expect(transition(paused, { type: "ERROR", message: "x" })).toBe(paused);
    expect(transition(initialPlaybackState, { type: "RESUME" })).toBe(initialPlaybackState);
    expect(transition(initialPlaybackState, { type: "PAUSE" })).toBe(initialPlaybackState);
    const loading = withStatus("loading");
    expect(transition(loading, { type: "WAITING" })).toBe(loading);
  });

  it("enters error from active states", () => {
    for (const status of ["loading", "playing", "buffering"] as const) {
      expect(transition(withStatus(status), { type: "ERROR", message: "Down" })).toMatchObject({
        status: "error",
        error: "Down",
      });
    }
  });

  it("stops and clears the station", () => {
    expect(transition(withStatus("playing"), { type: "STOP" })).toEqual({
      ...initialPlaybackState,
      session: 2,
    });
  });
});
