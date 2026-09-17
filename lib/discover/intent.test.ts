import { describe, expect, it } from "vitest";
import { describeIntent, normalizeQuery, parseIntent } from "@/lib/discover/intent";

describe("parseIntent", () => {
  it.each([
    ["Find Bengali music from Bangladesh", { language: "bengali", country: "BD" }],
    ["Give me something calm from South Korea", { mood: "calm", tag: "lounge", country: "KR" }],
    ["I want relaxing Arabic music", { mood: "calm", tag: "lounge", language: "arabic" }],
    ["Play something relaxing from Japan", { mood: "calm", tag: "lounge", country: "JP" }],
    ["jazz in paris france", { tag: "jazz", country: "FR" }],
    ["Brazilian hip-hop", { tag: "hiphop", country: "BR" }],
    ["UK news", { tag: "news", country: "GB" }],
    ["late night lofi to study", { tag: "lofi", mood: "mysterious" }],
    ["bangla gaan", { language: "bengali", text: undefined }],
    ["something from Côte d’Ivoire", { country: "CI" }],
    ["classic rock from the usa", { tag: "classic rock", country: "US" }],
    ["BBC World Service", { text: "bbc world service" }],
    ["quran recitation", { tag: "quran" }],
  ])("parses %j", (input, expected) => {
    const intent = parseIntent(input);
    for (const [key, value] of Object.entries(expected)) {
      expect(intent[key as keyof typeof intent], `${input} -> ${key}`).toBe(value);
    }
  });

  it.each([
    "music from Saudi Arabia",
    "radio from Pakistan",
    "Arabic music",
    "Indonesian radio",
    "stations in Israel",
    "Indian songs",
    "something from the Vatican",
  ])("never infers a faith tag from country or language: %s", (input) => {
    const intent = parseIntent(input);
    expect(["religious", "christian", "islamic", "quran", "gospel", "nasheed"]).not.toContain(
      intent.tag,
    );
  });

  it("handles empty and junk input", () => {
    expect(parseIntent("")).toEqual({});
    expect(parseIntent("please play something")).toEqual({});
    expect(parseIntent("!!!")).toEqual({});
  });

  it("limits free text length", () => {
    expect(parseIntent("x".repeat(500)).text?.length).toBeLessThanOrEqual(100);
  });
});

describe("helpers", () => {
  it("normalizes queries", () => {
    expect(normalizeQuery("  Café, JAZZ! ")).toBe(" cafe jazz ");
  });

  it("describes intents", () => {
    expect(describeIntent({ mood: "calm", tag: "jazz", country: "JP" }, () => "Japan")).toBe(
      "Calm · Jazz · Japan",
    );
  });
});
