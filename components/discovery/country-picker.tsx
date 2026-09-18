"use client";

import { Globe, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { countryFlag } from "@/lib/stations/display";
import type { Facet } from "@/lib/stations/types";

/*
 * Every country, not just the sixteen on the dial.
 *
 * The dial carries curated places because each one has its own photograph, so
 * the other two hundred odd countries in the directory had no way in from the
 * home page at all. Typing is the only sane way through a list that long.
 */

interface CountryPickerProps {
  countries: Facet[];
  className?: string;
}

/**
 * Fold accents so "Turkiye" finds "Türkiye", and drop a leading article: the
 * directory files the US as "The United States Of America", so without this
 * "united" ranked Tanzania above it.
 */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/^the\s+/, "");
}

export function CountryPicker({ countries, className = "" }: CountryPickerProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const withCode = useMemo(
    () => countries.filter((c): c is Facet & { code: string } => Boolean(c.code)),
    [countries],
  );

  /*
   * Rank before filtering length, or the list reads as noise: typing "ba" put
   * Bosnia, Lebanon and Albania above Bangladesh, because they all contain the
   * letters and have more stations. What someone types is nearly always the
   * start of a name or of a word in one.
   */
  const matches = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return withCode;
    const scored: { country: Facet & { code: string }; rank: number }[] = [];
    for (const country of withCode) {
      const name = fold(country.name);
      const rank = name.startsWith(needle)
        ? 0
        : country.code.toLowerCase().startsWith(needle)
          ? 1
          : name.split(/\s+/).some((word) => word.startsWith(needle))
            ? 2
            : name.includes(needle)
              ? 3
              : -1;
      if (rank >= 0) scored.push({ country, rank });
    }
    // Station count already orders the incoming list, so a stable sort on rank
    // keeps the busiest country first within each tier.
    return scored.sort((a, b) => a.rank - b.rank).map((entry) => entry.country);
  }, [withCode, query]);

  // Focus the field on open: the point of this is to type.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setQuery("");
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    dialogRef.current?.showModal();
    // After showModal, so the field is in the top layer and can take focus.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const choose = (code: string) => {
    dialogRef.current?.close();
    router.push(`/country/${code.toLowerCase()}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-white backdrop-blur-sm hover:bg-white/10 ${className}`}
      >
        <Globe className="size-4" aria-hidden="true" />
        All countries
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Choose a country"
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-[var(--radius-tile)] border border-border bg-surface p-0 text-text backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <form
          method="dialog"
          className="flex items-center justify-between border-b border-border p-3"
        >
          <h2 className="px-1 text-lg font-semibold">Choose a country</h2>
          <button
            type="submit"
            aria-label="Close"
            className="rounded-full p-2 text-muted hover:text-text"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </form>

        <div className="border-b border-border p-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface-strong px-3">
            <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              // Deliberately not type="search": that swallows Escape to clear
              // itself, so the dialog would not close on the first press.
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search countries"
              aria-label="Search countries"
              className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <ul className="max-h-[50vh] overflow-y-auto p-2" aria-label="Countries">
          {matches.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                onClick={() => choose(country.code)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-surface-strong"
              >
                <span aria-hidden="true" className="text-lg">
                  {countryFlag(country.code)}
                </span>
                <span className="min-w-0 flex-1 truncate">{country.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted tabular-nums">
                  {country.stationCount.toLocaleString("en")}
                </span>
              </button>
            </li>
          ))}
          {matches.length === 0 && (
            <li className="px-3 py-8 text-center text-muted">
              Nothing matches &ldquo;{query}&rdquo;.
            </li>
          )}
        </ul>
      </dialog>
    </>
  );
}
