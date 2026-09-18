"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { FALLBACK_SUGGESTIONS, readListener, suggestionsFor } from "@/lib/discover/suggestions";

interface DiscoverFormProps {
  initial?: string;
  tone?: "glass" | "surface";
  showExamples?: boolean;
}

/** Natural language radio discovery input. Navigates to /discover?q=... */
export function DiscoverForm({
  initial = "",
  tone = "glass",
  showExamples = true,
}: DiscoverFormProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initial);
  // The server cannot know the reader's clock, so it renders the fixed set and
  // the browser swaps in something local once mounted. Rendering nothing first
  // would leave a hole; guessing on the server would mismatch on hydration.
  const [examples, setExamples] = useState<string[]>(FALLBACK_SUGGESTIONS);

  useEffect(() => {
    const listener = readListener();
    if (!listener) return;
    const local = suggestionsFor(listener);
    if (local.length === 0) return;
    // Swapped on the next frame rather than inside the effect: these are hints,
    // not content, and they should not make the first paint render twice.
    const frame = requestAnimationFrame(() => setExamples(local));
    return () => cancelAnimationFrame(frame);
  }, []);

  const go = (value: string) => {
    const q = value.trim();
    if (q) router.push(`/discover?q=${encodeURIComponent(q)}`);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    go(prompt);
  };

  const glass = tone === "glass";

  return (
    <div className="max-w-xl space-y-3">
      <form role="search" onSubmit={onSubmit} className="relative">
        <label htmlFor="discover-input" className="sr-only">
          What do you want to listen to?
        </label>
        <Sparkles
          className={`pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 ${
            glass ? "text-white/60" : "text-muted"
          }`}
          aria-hidden="true"
        />
        <input
          id="discover-input"
          type="search"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to hear? Try “calm jazz from Japan”"
          maxLength={200}
          className={`h-12 w-full rounded-full border pr-24 pl-11 focus:border-accent focus:outline-none ${
            glass
              ? "border-white/20 bg-black/40 text-white backdrop-blur-md placeholder:text-white/55"
              : "border-border bg-background/70 text-text placeholder:text-muted"
          }`}
        />
        <button
          type="submit"
          className="absolute top-1.5 right-1.5 h-9 rounded-full bg-accent px-4 text-sm font-medium text-accent-contrast"
        >
          Find
        </button>
      </form>
      {showExamples && (
        <ul className="flex flex-wrap gap-2" aria-label="Examples">
          {examples.map((example) => (
            <li key={example}>
              <button
                type="button"
                onClick={() => {
                  setPrompt(example);
                  go(example);
                }}
                className={`rounded-full border px-3 py-1 text-xs ${
                  glass
                    ? "border-white/20 bg-black/30 text-white/80 backdrop-blur-sm hover:bg-white/10"
                    : "border-border text-muted hover:text-text"
                }`}
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
