import { describe, expect, it } from "vitest";
import { betterEntry, dedupeByStream, streamKey } from "@/lib/stations/dedupe";
import type { Station } from "@/lib/stations/types";

function station(overrides: Partial<Station> & { id: string; streamUrl: string }): Station {
  return {
    name: overrides.id,
    languages: [],
    tags: [],
    isHls: false,
    votes: 0,
    clickCount: 0,
    lastCheckOk: true,
    source: "radio-browser",
    ...overrides,
  } as Station;
}

describe("streamKey", () => {
  it("treats http and https on one host as the same audio", () => {
    expect(streamKey("http://example.com/stream")).toBe(streamKey("https://example.com/stream"));
  });

  it("ignores www and a trailing slash", () => {
    expect(streamKey("https://www.example.com/stream/")).toBe(
      streamKey("https://example.com/stream"),
    );
  });

  it("ignores the default port but keeps a real one", () => {
    expect(streamKey("http://example.com:80/s")).toBe(streamKey("http://example.com/s"));
    // Shoutcast hosts run many stations on one address, split by port.
    expect(streamKey("http://1.2.3.4:8000/s")).not.toBe(streamKey("http://1.2.3.4:9000/s"));
  });

  it("keeps the query, which often selects the mount", () => {
    expect(streamKey("https://h/play?id=1")).not.toBe(streamKey("https://h/play?id=2"));
  });

  it("gives an unparseable address its own identity rather than collapsing them", () => {
    expect(streamKey("not a url")).not.toBe(streamKey("also not a url"));
  });
});

describe("betterEntry", () => {
  const base = { id: "a", streamUrl: "https://h/s" };

  it("prefers the entry the directory believes is up", () => {
    const up = station({ ...base, id: "up" });
    const down = station({ ...base, id: "down", lastCheckOk: false, tags: ["talk"] });
    expect(betterEntry(down, up).id).toBe("up");
  });

  it("prefers the described entry, because an untagged one cannot be matched", () => {
    const bare = station({ ...base, id: "bare", bitrate: 320 });
    const tagged = station({ ...base, id: "tagged", tags: ["talk", "news"], bitrate: 64 });
    expect(betterEntry(bare, tagged).id).toBe("tagged");
  });

  it("falls back to bitrate, then votes", () => {
    const quiet = station({ ...base, id: "quiet", bitrate: 64, votes: 99 });
    const loud = station({ ...base, id: "loud", bitrate: 128, votes: 1 });
    expect(betterEntry(quiet, loud).id).toBe("loud");

    const few = station({ ...base, id: "few", votes: 1 });
    const many = station({ ...base, id: "many", votes: 500 });
    expect(betterEntry(few, many).id).toBe("many");
  });
});

describe("dedupeByStream", () => {
  it("collapses the two Jago FM rows that share a dead stream", () => {
    // Both rows are real entries in the live Bangladesh listing, and asking for
    // voices in Dhaka spent two attempts on the same silent stream.
    const stations = [
      station({ id: "1", name: "Jago FM 94.4", streamUrl: "http://139.59.86.99:12496/stream" }),
      station({
        id: "2",
        name: "Jago Fm",
        streamUrl: "http://139.59.86.99:12496/stream",
        tags: ["pop", "talk"],
      }),
    ];
    const kept = dedupeByStream(stations);
    expect(kept).toHaveLength(1);
    expect(kept[0].name).toBe("Jago Fm");
  });

  it("keeps the caller's popularity order", () => {
    const stations = [
      station({ id: "first", streamUrl: "https://a/s" }),
      station({ id: "second", streamUrl: "https://b/s" }),
      station({ id: "dup", streamUrl: "https://a/s", tags: ["talk"] }),
    ];
    expect(dedupeByStream(stations).map((s) => s.id)).toEqual(["dup", "second"]);
  });

  it("leaves distinct stations alone", () => {
    const stations = [
      station({ id: "1", streamUrl: "https://a/s" }),
      station({ id: "2", streamUrl: "https://b/s" }),
    ];
    expect(dedupeByStream(stations)).toHaveLength(2);
  });

  it("handles an empty list", () => {
    expect(dedupeByStream([])).toEqual([]);
  });
});
