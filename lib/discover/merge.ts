import type { Intent } from "@/lib/discover/intent";

export const FAITH_TAGS = new Set([
  "religious",
  "christian",
  "islamic",
  "quran",
  "gospel",
  "nasheed",
]);

/**
 * Combine the rule based intent with an AI intent. AI fills gaps and refines,
 * but may not introduce faith tags the user did not explicitly ask for.
 */
export function mergeIntents(rules: Intent, ai: Intent | null): Intent {
  if (!ai) return rules;
  const merged: Intent = { ...rules, ...stripUndefined(ai) };
  if (merged.tag && FAITH_TAGS.has(merged.tag) && !(rules.tag && FAITH_TAGS.has(rules.tag))) {
    merged.tag = rules.tag;
  }
  if (!merged.tag) delete merged.tag;
  if (merged.text && (merged.tag || merged.country || merged.language)) delete merged.text;
  return merged;
}

function stripUndefined(intent: Intent): Intent {
  return Object.fromEntries(Object.entries(intent).filter(([, v]) => v !== undefined)) as Intent;
}

/** Progressively broader filter sets to try when a precise search finds nothing. */
export function relaxations(intent: Intent): { filters: Intent; dropped?: string }[] {
  const steps: { filters: Intent; dropped?: string }[] = [{ filters: intent }];
  const current = { ...intent };
  const drop = (key: keyof Intent, label: string) => {
    if (current[key] === undefined) return;
    delete current[key];
    if (current.tag || current.country || current.language || current.text) {
      steps.push({ filters: { ...current }, dropped: label });
    }
  };
  if (current.mood) drop("tag", "mood");
  drop("language", "language");
  drop("tag", "genre");
  return steps;
}
