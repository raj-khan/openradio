import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const generateText = vi.fn();
vi.mock("ai", () => ({
  generateText: (...args: unknown[]) => generateText(...args),
  Output: { object: (options: unknown) => options },
}));

import { isAiEnabled, parseIntentWithAi } from "@/lib/discover/ai";

describe("parseIntentWithAi", () => {
  beforeEach(() => {
    generateText.mockReset();
    delete process.env.AI_GATEWAY_API_KEY;
    delete process.env.VERCEL_OIDC_TOKEN;
    delete process.env.AI_MODEL;
  });
  afterEach(() => delete process.env.AI_GATEWAY_API_KEY);

  it("is disabled without credentials and never calls the model", async () => {
    expect(isAiEnabled()).toBe(false);
    await expect(parseIntentWithAi("jazz")).resolves.toBeNull();
    expect(generateText).not.toHaveBeenCalled();
  });

  it("returns the validated model output with a timeout and no retries", async () => {
    process.env.AI_GATEWAY_API_KEY = "test";
    process.env.AI_MODEL = "provider/model";
    generateText.mockResolvedValue({ output: { country: "JP", mood: "calm" } });
    await expect(parseIntentWithAi("calm japan")).resolves.toEqual({ country: "JP", mood: "calm" });
    const call = generateText.mock.calls[0][0];
    expect(call.model).toBe("provider/model");
    expect(call.maxRetries).toBe(0);
    expect(call.abortSignal).toBeInstanceOf(AbortSignal);
    expect(call.system).toMatch(/Never infer religion/);
  });

  it("returns null for invalid output or errors", async () => {
    process.env.AI_GATEWAY_API_KEY = "test";
    generateText.mockResolvedValue({ output: { country: "Japan" } });
    await expect(parseIntentWithAi("japan")).resolves.toBeNull();
    generateText.mockRejectedValue(new Error("timeout"));
    await expect(parseIntentWithAi("japan")).resolves.toBeNull();
  });
});
