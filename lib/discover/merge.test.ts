import { describe, expect, it } from "vitest";
import { mergeIntents, relaxations } from "@/lib/discover/merge";

describe("mergeIntents", () => {
  it("returns rules when AI is unavailable", () => {
    expect(mergeIntents({ tag: "jazz" }, null)).toEqual({ tag: "jazz" });
  });

  it("lets AI refine and fill gaps", () => {
    expect(
      mergeIntents({ tag: "lounge", mood: "calm" }, { country: "JP", tag: "ambient" }),
    ).toEqual({
      tag: "ambient",
      mood: "calm",
      country: "JP",
    });
  });

  it("blocks AI-invented faith tags", () => {
    expect(mergeIntents({ country: "SA" }, { country: "SA", tag: "islamic" })).toEqual({
      country: "SA",
    });
    expect(mergeIntents({ tag: "gospel" }, { tag: "christian" })).toEqual({ tag: "christian" });
  });

  it("drops free text once structured filters exist", () => {
    expect(mergeIntents({ text: "tokyo vibes" }, { country: "JP" })).toEqual({ country: "JP" });
  });
});

describe("relaxations", () => {
  it("broadens step by step but keeps something to search", () => {
    const steps = relaxations({ mood: "calm", tag: "lounge", language: "japanese", country: "JP" });
    expect(steps.map((s) => s.dropped)).toEqual([undefined, "mood", "language"]);
    expect(steps.at(-1)?.filters).toEqual({ mood: "calm", country: "JP" });
  });

  it("returns only the original when nothing can be dropped", () => {
    expect(relaxations({ text: "bbc" })).toEqual([{ filters: { text: "bbc" } }]);
  });
});
