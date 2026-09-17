import "server-only";

import { parseIntentWithAi } from "@/lib/discover/ai";
import { describeIntent, parseIntent, type Intent } from "@/lib/discover/intent";
import { mergeIntents, relaxations } from "@/lib/discover/merge";
import { countryName } from "@/lib/stations/display";
import { loadStations } from "@/lib/stations/server-data";
import type { Station } from "@/lib/stations/types";

export interface DiscoverResult {
  prompt: string;
  intent: Intent;
  summary: string;
  source: "ai" | "rules";
  stations: Station[];
  /** Set when filters had to be broadened to find stations. */
  relaxed?: string;
  error?: string;
}

export async function runDiscover(prompt: string, limit = 20): Promise<DiscoverResult> {
  const rules = parseIntent(prompt);
  const ai = await parseIntentWithAi(prompt);
  const intent = mergeIntents(rules, ai);
  const summary = describeIntent(intent, (code) => countryName(code));
  const base = { prompt, intent, summary, source: ai ? "ai" : "rules" } as const;

  const hasFilters = intent.tag || intent.country || intent.language || intent.text;
  if (!hasFilters) {
    const popular = await loadStations({ order: "popular", limit });
    return { ...base, stations: popular.ok ? popular.data : [], relaxed: "everything" };
  }

  for (const step of relaxations(intent)) {
    const { country, language, tag, text } = step.filters;
    const result = await loadStations({ country, language, tag, text, limit });
    if (!result.ok) return { ...base, stations: [], error: "provider" };
    if (result.data.length > 0) {
      return { ...base, stations: result.data, relaxed: step.dropped };
    }
  }
  return { ...base, stations: [] };
}
