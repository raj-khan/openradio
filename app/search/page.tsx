import type { Metadata } from "next";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { filtersToQueryString, firstValues } from "@/lib/stations/query-string";
import { loadFacets, loadStations } from "@/lib/stations/server-data";
import { parseStationQuery } from "@/lib/stations/types";

export const metadata: Metadata = {
  title: "Search stations",
  description: "Search live radio stations by name, country, language and genre.",
};

const PAGE_SIZE = 30;

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = firstValues(await searchParams);
  const parsed = parseStationQuery({ ...raw, limit: PAGE_SIZE, offset: 0 });
  const filters = parsed.success
    ? {
        text: parsed.data.text,
        country: parsed.data.country,
        language: parsed.data.language,
        tag: parsed.data.tag,
        order: parsed.data.order,
      }
    : {};

  const [countries, languages, tags, results] = await Promise.all([
    loadFacets("countries"),
    loadFacets("languages"),
    loadFacets("tags"),
    parsed.success ? loadStations(parsed.data) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
          Scan the dial
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Search stations</h1>
        <p className="text-muted">Find live radio by name, country, language or genre.</p>
      </header>

      <SearchFilters initial={filters} countries={countries} languages={languages} tags={tags} />

      {results === null ? (
        <p role="alert" className="rounded-2xl border border-border p-6 text-center text-muted">
          Some filters in the link are invalid. Adjust them above to search again.
        </p>
      ) : results.ok ? (
        <SearchResults
          key={filtersToQueryString(filters)}
          initialStations={results.data}
          filters={filters}
          pageSize={PAGE_SIZE}
        />
      ) : (
        <p role="alert" className="rounded-2xl border border-border p-6 text-center text-muted">
          The station directory isn&apos;t responding right now. Please try again shortly.
        </p>
      )}
    </div>
  );
}
