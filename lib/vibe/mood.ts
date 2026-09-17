import type { MOOD_NAMES } from "@/lib/discover/intent";

export type Mood = (typeof MOOD_NAMES)[number] | "neutral";
export type Energy = "low" | "medium" | "high";
export type Animation = "none" | "subtle" | "slow" | "dynamic";

export interface Vibe {
  mood: Mood;
  energy: Energy;
  animation: Animation;
}

const RULES: { mood: Mood; energy: Energy; animation: Animation; words: string[] }[] = [
  {
    mood: "focused",
    energy: "low",
    animation: "none",
    words: [
      "news",
      "talk",
      "sports",
      "sport",
      "information",
      "public radio",
      "podcast",
      "education",
    ],
  },
  {
    mood: "energetic",
    energy: "high",
    animation: "dynamic",
    words: [
      "dance",
      "edm",
      "electronic",
      "techno",
      "house",
      "trance",
      "metal",
      "rock",
      "hiphop",
      "hip hop",
      "rap",
      "drum and bass",
      "dubstep",
      "club",
    ],
  },
  {
    mood: "joyful",
    energy: "high",
    animation: "dynamic",
    words: [
      "pop",
      "latin",
      "salsa",
      "reggaeton",
      "reggae",
      "afrobeats",
      "afrobeat",
      "k-pop",
      "kpop",
      "hits",
      "top 40",
      "bollywood",
      "cumbia",
      "samba",
    ],
  },
  {
    mood: "nostalgic",
    energy: "medium",
    animation: "slow",
    words: [
      "oldies",
      "60s",
      "70s",
      "80s",
      "90s",
      "retro",
      "classic hits",
      "vinyl",
      "1930s",
      "1940s",
      "1950s",
      "swing",
      "disco",
    ],
  },
  {
    mood: "romantic",
    energy: "low",
    animation: "slow",
    words: ["romantic", "love songs", "love", "ballads", "rnb", "r&b", "soul", "bossa nova"],
  },
  {
    mood: "melancholic",
    energy: "low",
    animation: "slow",
    words: ["blues", "sad", "melancholy", "fado", "sadcore"],
  },
  {
    mood: "mysterious",
    energy: "medium",
    animation: "slow",
    words: ["ambient", "dark", "darkwave", "gothic", "experimental", "drone", "space"],
  },
  {
    mood: "calm",
    energy: "low",
    animation: "slow",
    words: [
      "jazz",
      "smooth jazz",
      "lounge",
      "chill",
      "chillout",
      "classical",
      "piano",
      "easy listening",
      "lofi",
      "lo-fi",
      "relax",
      "meditation",
      "folk",
      "acoustic",
      "instrumental",
    ],
  },
];

const NEUTRAL: Vibe = { mood: "neutral", energy: "medium", animation: "subtle" };

function matches(text: string, word: string) {
  return ` ${text} `.includes(` ${word} `);
}

/**
 * Deterministic vibe from station tags, optionally nudged by now playing text.
 * Tags are scored in order, so the station's first tags weigh the most.
 */
export function vibeFor(tags: string[], nowPlaying?: string | null): Vibe {
  const scores = new Map<Mood, number>();
  tags.slice(0, 8).forEach((tag, index) => {
    const text = tag.toLowerCase();
    // Decades such as "1950", "1950s" or "80s" read as nostalgic.
    const decade = /^(19[0-9]0|[0-9]0)s?$/.test(text);
    // Each tag counts once, for its most specific (longest) matching phrase.
    let match: { mood: Mood; length: number } | null = decade
      ? { mood: "nostalgic", length: 99 }
      : null;
    for (const rule of RULES) {
      for (const word of rule.words) {
        if (matches(text, word) && (!match || word.length > match.length)) {
          match = { mood: rule.mood, length: word.length };
        }
      }
    }
    if (match) scores.set(match.mood, (scores.get(match.mood) ?? 0) + (8 - index));
  });
  if (nowPlaying) {
    const text = nowPlaying.toLowerCase().replace(/[^\p{L}\p{N}&\s-]+/gu, " ");
    for (const rule of RULES) {
      if (rule.words.some((word) => word.length > 3 && matches(text, word))) {
        scores.set(rule.mood, (scores.get(rule.mood) ?? 0) + 3);
      }
    }
  }
  let best: Mood | null = null;
  let bestScore = 0;
  for (const rule of RULES) {
    const score = scores.get(rule.mood) ?? 0;
    if (score > bestScore) {
      best = rule.mood;
      bestScore = score;
    }
  }
  const rule = RULES.find((r) => r.mood === best);
  return rule ? { mood: rule.mood, energy: rule.energy, animation: rule.animation } : NEUTRAL;
}
