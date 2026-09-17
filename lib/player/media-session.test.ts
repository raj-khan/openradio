import { describe, expect, it } from "vitest";
import { buildMediaMetadata, mediaPlaybackState } from "@/lib/player/media-session";

describe("buildMediaMetadata", () => {
  it("uses station details without now playing", () => {
    expect(
      buildMediaMetadata({ name: "Radio A", country: "Japan", faviconUrl: "https://a.test/i.png" }),
    ).toEqual({
      title: "Radio A",
      artist: "Japan",
      album: "OpenRadio",
      artwork: [{ src: "https://a.test/i.png", sizes: "512x512" }],
    });
  });

  it("puts now playing in the title", () => {
    expect(buildMediaMetadata({ name: "Radio A" }, "Artist - Song")).toMatchObject({
      title: "Artist - Song",
      artist: "Radio A",
      artwork: [],
    });
  });

  it("ignores blank now playing", () => {
    expect(buildMediaMetadata({ name: "Radio A" }, "  ").title).toBe("Radio A");
    expect(buildMediaMetadata({ name: "Radio A" }, "  ").artist).toBe("Live radio");
  });
});

describe("mediaPlaybackState", () => {
  it("maps statuses", () => {
    expect(mediaPlaybackState("idle")).toBe("none");
    expect(mediaPlaybackState("paused")).toBe("paused");
    expect(mediaPlaybackState("error")).toBe("paused");
    expect(mediaPlaybackState("buffering")).toBe("playing");
  });
});
