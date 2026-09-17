import "server-only";

import { generateText, Output } from "ai";
import { intentSchema, MOOD_NAMES, type Intent } from "@/lib/discover/intent";

const AI_TIMEOUT_MS = 6000;

/** AI discovery is enabled only when an AI Gateway credential is configured. */
export function isAiEnabled() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

const SYSTEM = `You convert a radio listening request into search filters for a world radio directory.
Return only filters that the request explicitly supports.
- country: ISO 3166-1 alpha-2 code, only if a place is named or clearly implied by a demonym.
- language: lowercase English language name (e.g. "bengali", "arabic"), only if a language is named.
- tag: one lowercase genre or format tag (e.g. "jazz", "news", "lofi", "classical").
- mood: one of ${MOOD_NAMES.join(", ")}, only if the request describes a feeling.
- text: a station name, only if the user names a specific station.
Never infer religion, ethnicity or culture from a country, language or name. Only use faith tags
(religious, christian, islamic, quran, gospel) when the request explicitly asks for them.`;

/** Ask the configured model for an intent. Returns null on any failure. */
export async function parseIntentWithAi(prompt: string): Promise<Intent | null> {
  if (!isAiEnabled()) return null;
  try {
    const { output } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-5-mini",
      system: SYSTEM,
      prompt: prompt.slice(0, 200),
      output: Output.object({ schema: intentSchema }),
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
      maxRetries: 0,
    });
    const parsed = intentSchema.safeParse(output);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
