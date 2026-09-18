import { describe, expect, it } from "vitest";
import { FAQ_ITEMS } from "@/lib/copy/faq";
import { faqJsonLd } from "@/lib/seo/structured-data";

describe("FAQ content", () => {
  it("asks real questions", () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(6);
    for (const item of FAQ_ITEMS) expect(item.question.endsWith("?")).toBe(true);
  });

  it("answers in full sentences that stand on their own", () => {
    for (const { question, answer } of FAQ_ITEMS) {
      // An assistant quotes one answer without the question above it, so an
      // answer that opens with "Yes." alone would lose all its meaning.
      expect(answer.length, question).toBeGreaterThan(80);
      expect(answer.trim().endsWith("."), question).toBe(true);
      expect(answer, question).toMatch(/OpenRadio|Radio Browser|MIT|browser|station/i);
    }
  });

  it("asks nothing twice", () => {
    expect(new Set(FAQ_ITEMS.map((i) => i.question)).size).toBe(FAQ_ITEMS.length);
  });

  it("uses no em-dashes", () => {
    for (const item of FAQ_ITEMS) expect(item.answer).not.toContain("—");
  });
});

describe("faqJsonLd", () => {
  it("mirrors the visible copy exactly, never a summary of it", () => {
    const data = faqJsonLd(FAQ_ITEMS);
    expect(data["@type"]).toBe("FAQPage");
    const entities = data.mainEntity as {
      name: string;
      acceptedAnswer: { text: string };
    }[];
    expect(entities).toHaveLength(FAQ_ITEMS.length);
    entities.forEach((entity, i) => {
      expect(entity.name).toBe(FAQ_ITEMS[i].question);
      expect(entity.acceptedAnswer.text).toBe(FAQ_ITEMS[i].answer);
    });
  });

  it("joins the site graph", () => {
    expect(faqJsonLd(FAQ_ITEMS).isPartOf).toEqual({ "@id": "https://openradio.space/#website" });
  });
});
