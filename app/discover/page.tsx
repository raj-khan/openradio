import type { Metadata } from "next";
import Link from "next/link";
import { DiscoverForm } from "@/components/discover/discover-form";
import { StationGrid } from "@/components/stations/station-grid";
import { firstValues } from "@/lib/stations/query-string";
import { filtersToQueryString } from "@/lib/stations/query-string";
import { runDiscover } from "@/lib/discover/run";

export const metadata: Metadata = {
  title: "Discover",
  description: "Describe what you want to hear and tune in to matching live radio.",
};

const RELAXED: Record<string, string> = {
  mood: "No exact mood match, so these ignore the mood.",
  language: "Nothing in that language matched, so these include other languages.",
  genre: "No stations matched that genre there, so these include other genres.",
  everything: "Couldn't pick out a place, language or genre, so here are popular stations.",
};

export default async function DiscoverPage({ searchParams }: PageProps<"/discover">) {
  const { q = "" } = firstValues(await searchParams);
  const prompt = q.trim().slice(0, 200);
  const result = prompt ? await runDiscover(prompt) : null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-4">
        <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
          Ask the dial
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          {prompt ? <>&ldquo;{prompt}&rdquo;</> : "What do you want to hear?"}
        </h1>
        <DiscoverForm key={prompt} initial={prompt} tone="surface" showExamples={!prompt} />
      </header>

      {result && (
        <section aria-labelledby="discover-results" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="discover-results" className="sr-only">
              Results
            </h2>
            {result.summary && (
              <p className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs">
                {result.summary}
              </p>
            )}
            <p className="text-xs text-muted">
              {result.source === "ai" ? "Understood with AI" : "Understood from keywords"}
            </p>
            {(result.intent.country || result.intent.tag || result.intent.language) && (
              <Link
                href={`/search?${filtersToQueryString(result.intent)}`}
                className="text-xs text-muted underline underline-offset-4 hover:text-text"
              >
                Refine in search
              </Link>
            )}
          </div>
          {result.relaxed && RELAXED[result.relaxed] && (
            <p className="text-sm text-muted">{RELAXED[result.relaxed]}</p>
          )}
          {result.error ? (
            <p
              role="alert"
              className="rounded-[var(--radius-tile)] border border-border p-6 text-muted"
            >
              The station directory isn&apos;t responding right now. Please try again shortly.
            </p>
          ) : (
            <StationGrid
              stations={result.stations}
              label="Discovered stations"
              empty="Nothing matched. Try naming a country, language or genre."
            />
          )}
        </section>
      )}
    </div>
  );
}
