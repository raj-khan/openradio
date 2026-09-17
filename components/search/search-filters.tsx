"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { countryName } from "@/lib/stations/display";
import { filtersToQueryString, hasFilters, type StationFilters } from "@/lib/stations/query-string";
import type { Facet } from "@/lib/stations/types";

interface SearchFiltersProps {
  initial: StationFilters;
  countries: Facet[];
  languages: Facet[];
  tags: Facet[];
}

const ORDER_LABELS = {
  popular: "Most played",
  votes: "Most voted",
  name: "Name",
  random: "Random",
} as const;

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3 text-text placeholder:text-muted focus:border-accent focus:outline-none";

export function SearchFilters({ initial, countries, languages, tags }: SearchFiltersProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filters, setFilters] = useState<StationFilters>(initial);
  // Follow external URL changes (back/forward, links) but never overwrite what the
  // user is typing while a navigation they started is still loading.
  const initialKey = filtersToQueryString(initial);
  const [syncedKey, setSyncedKey] = useState(initialKey);
  const [lastPushed, setLastPushed] = useState(initialKey);
  if (initialKey !== syncedKey) {
    setSyncedKey(initialKey);
    if (initialKey !== lastPushed) {
      setLastPushed(initialKey);
      setFilters(initial);
    }
  }

  const navigate = (next: StationFilters) => {
    setFilters(next);
    const qs = filtersToQueryString(next);
    setLastPushed(qs);
    startTransition(() => router.push(qs ? `/search?${qs}` : "/search", { scroll: false }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate({ ...filters, text: filters.text?.trim() || undefined });
  };

  const update = <K extends keyof StationFilters>(key: K, value: StationFilters[K]) =>
    navigate({ ...filters, [key]: value || undefined });

  const sortedCountries = countries
    .map((c) => ({ ...c, label: countryName(c.code, c.name) ?? c.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="space-y-3"
      aria-busy={pending}
      aria-label="Station search"
    >
      <div className="flex gap-2">
        <label htmlFor="search-text" className="sr-only">
          Station name
        </label>
        <input
          id="search-text"
          type="search"
          value={filters.text ?? ""}
          onChange={(e) => setFilters({ ...filters, text: e.target.value })}
          placeholder="Search station names"
          maxLength={100}
          className={fieldClass}
        />
        <button
          type="submit"
          className="flex h-11 items-center gap-2 rounded-xl bg-accent px-4 font-medium text-accent-contrast"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Search</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div>
          <label htmlFor="search-country" className="mb-1 block text-xs text-muted">
            Country
          </label>
          <select
            id="search-country"
            value={filters.country ?? ""}
            onChange={(e) => update("country", e.target.value)}
            className={fieldClass}
          >
            <option value="">All countries</option>
            {sortedCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.stationCount})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="search-language" className="mb-1 block text-xs text-muted">
            Language
          </label>
          <select
            id="search-language"
            value={filters.language ?? ""}
            onChange={(e) => update("language", e.target.value)}
            className={`${fieldClass} capitalize`}
          >
            <option value="">All languages</option>
            {languages.map((l) => (
              <option key={l.name} value={l.name}>
                {l.name} ({l.stationCount})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="search-tag" className="mb-1 block text-xs text-muted">
            Genre or tag
          </label>
          <input
            id="search-tag"
            list="search-tag-options"
            value={filters.tag ?? ""}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            onBlur={(e) => {
              const value = e.target.value.trim().toLowerCase();
              if (value !== (initial.tag ?? "")) update("tag", value);
            }}
            placeholder="jazz, news, lofi"
            maxLength={50}
            className={fieldClass}
          />
          <datalist id="search-tag-options">
            {tags.map((t) => (
              <option key={t.name} value={t.name} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="search-order" className="mb-1 block text-xs text-muted">
            Sort by
          </label>
          <select
            id="search-order"
            value={filters.order ?? "popular"}
            onChange={(e) => update("order", e.target.value as StationFilters["order"])}
            className={fieldClass}
          >
            {Object.entries(ORDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters(filters) && (
        <button
          type="button"
          onClick={() => navigate({})}
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
        >
          <X className="size-4" aria-hidden="true" />
          Clear filters
        </button>
      )}
    </form>
  );
}
