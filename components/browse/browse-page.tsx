import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SearchResults } from "@/components/search/search-results";
import { JsonLd } from "@/components/seo/json-ld";
import { StationGrid } from "@/components/stations/station-grid";
import type { CatalogImage } from "@/lib/imagery/catalog";
import { breadcrumbJsonLd, stationListJsonLd } from "@/lib/seo/structured-data";
import type { StationFilters } from "@/lib/stations/query-string";
import { filtersToQueryString } from "@/lib/stations/query-string";
import { loadStations } from "@/lib/stations/server-data";

const PAGE_SIZE = 30;

interface BrowsePageProps {
  /** Canonical path, also used for structured data. */
  path: string;
  /** Trail after Home for breadcrumbs. */
  breadcrumb: { name: string; path: string }[];
  eyebrow: string;
  title: ReactNode;
  /** Plain text name for structured data when the title is rich text. */
  listName?: string;
  subtitle?: string;
  image: CatalogImage;
  filters: StationFilters;
  related?: { href: string; label: string }[];
}

export async function BrowsePage({
  path,
  breadcrumb,
  eyebrow,
  title,
  listName,
  subtitle,
  image,
  filters,
  related,
}: BrowsePageProps) {
  const result = await loadStations({ ...filters, limit: PAGE_SIZE });

  const stations = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-10 pb-16">
      <JsonLd
        data={[
          stationListJsonLd(
            listName ?? (typeof title === "string" ? title : eyebrow),
            path,
            stations,
          ),
          breadcrumbJsonLd([{ name: "Home", path: "/" }, ...breadcrumb]),
        ]}
      />
      <section className="relative isolate overflow-hidden">
        <div className="grain absolute inset-0 -z-10" style={{ backgroundColor: image.color }}>
          <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-background" />
        </div>
        <div className="mx-auto flex min-h-[40svh] w-full max-w-6xl flex-col justify-end gap-3 px-4 pt-16 pb-8 text-white">
          <p className="font-mono text-[11px] tracking-[0.25em] text-[var(--accent-alt)] uppercase">
            {eyebrow}
          </p>
          <h1 className="text-5xl leading-none font-semibold sm:text-7xl">{title}</h1>
          {subtitle && <p className="max-w-xl text-white/80">{subtitle}</p>}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/search?${filtersToQueryString(filters)}`}
              className="rounded-full border border-white/25 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/10"
            >
              Refine in search
            </Link>
            <span className="text-xs text-white/55">
              Photo by{" "}
              <a
                href={image.credit.photoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {image.credit.photographer}
              </a>
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-8 px-4">
        {result.ok ? (
          result.data.length > 0 ? (
            <SearchResults initialStations={result.data} filters={filters} pageSize={PAGE_SIZE} />
          ) : (
            <StationGrid
              stations={[]}
              empty="No live stations here right now. Try a nearby frequency."
            />
          )
        ) : (
          <p
            role="alert"
            className="rounded-[var(--radius-tile)] border border-border p-6 text-muted"
          >
            The station directory isn&apos;t responding right now. Please try again shortly.
          </p>
        )}

        {related && related.length > 0 && (
          <nav aria-label="Related" className="space-y-3">
            <h2 className="text-xl font-semibold">Keep exploring</h2>
            <ul className="flex flex-wrap gap-2">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
