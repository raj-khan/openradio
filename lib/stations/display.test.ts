import { describe, expect, it } from "vitest";
import { countryFlag, hueFromString, initials, stationSubtitle } from "@/lib/stations/display";

describe("display helpers", () => {
  it("builds country flags", () => {
    expect(countryFlag("bd")).toBe("🇧🇩");
    expect(countryFlag("XYZ")).toBe("");
    expect(countryFlag(undefined)).toBe("");
  });

  it("builds initials", () => {
    expect(initials("BBC Radio 1")).toBe("BR");
    expect(initials("  ***  ")).toBe("?");
    expect(initials("ラジオ 日本")).toBe("ラ日");
  });

  it("derives a stable hue", () => {
    expect(hueFromString("abc")).toBe(hueFromString("abc"));
    expect(hueFromString("abc")).toBeGreaterThanOrEqual(0);
    expect(hueFromString("abc")).toBeLessThan(360);
  });

  it("builds subtitles", () => {
    expect(stationSubtitle({ country: "Japan", codec: "MP3", bitrate: 128 })).toBe(
      "Japan · MP3 128 kbps",
    );
    expect(stationSubtitle({})).toBe("");
  });
});
