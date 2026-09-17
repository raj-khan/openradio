import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { StationGrid } from "@/components/stations/station-grid";
import { HERO_IMAGE, moodBySlug, placeForCountry } from "@/lib/imagery/catalog";
import {
  MIN_COMBO_STATIONS,
  comboSlug,
  moodSlugForGenre,
  parseComboSlug,
  relatedGenres,
  type Combo,
} from "@/lib/seo/combos";
import { breadcrumbJsonLd, stationListJsonLd } from "@/lib/seo/structured-data";
import { countryFlag } from "@/lib/stations/display";
import { loadStations } from "@/lib/stations/server-data";

const LIMIT = 24;

const loadCombo = cache(async (combo: Combo) => {
  const result = await loadStations({
    country: combo.countryCode,
    tag: combo.genre.tag,
    limit: LIMIT,
  });
  return result.ok ? result.data : [];
});

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const combo = parseComboSlug((await params).slug);
  if (!combo) return { title: "Off the dial" };
  const stations = await loadCombo(combo);
  const title = `${combo.genre.label} radio in ${combo.countryName}`;
  return {
    title,
    description: `Listen to live ${combo.genre.label.toLowerCase()} radio stations from ${combo.countryName}, free and without an account.`,
    alternates: { canonical: `/${combo.slug}` },
    // Thin pages stay out of search results.
    robots: stations.length >= MIN_COMBO_STATIONS ? undefined : { index: false, follow: true },
  };
}

export default async function ComboPage({ params }: PageProps<"/[slug]">) {
  const combo = parseComboSlug((await params).slug);
  if (!combo) notFound();

  const stations = await loadCombo(combo);
  const moodSlug = moodSlugForGenre(combo.genre.tag);
  const image =
    (moodSlug && moodBySlug(moodSlug)?.image) ||
    placeForCountry(combo.countryCode)?.image ||
    HERO_IMAGE;
  const flag = countryFlag(combo.countryCode);

  const title = `${combo.genre.label} radio in ${combo.countryName}`;

  return (
    <div className="flex flex-col gap-10 pb-16">
      <JsonLd
        data={[
          stationListJsonLd(title, `/${combo.slug}`, stations),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: combo.countryName, path: `/country/${combo.countryCode.toLowerCase()}` },
            { name: title, path: `/${combo.slug}` },
          ]),
        ]}
      />
      <section className="relative isolate overflow-hidden">
        <div className="grain absolute inset-0 -z-10" style={{ backgroundColor: image.color }}>
          <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-16 pb-8 text-white">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] tracking-widest uppercase">
            <ol className="flex flex-wrap gap-2 text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/country/${combo.countryCode.toLowerCase()}`}
                  className="hover:text-white"
                >
                  {combo.countryName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/tag/${combo.genre.tag}`} className="hover:text-white">
                  {combo.genre.label}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl leading-tight font-semibold sm:text-6xl">
            <span aria-hidden="true" className="mr-3">
              {flag}
            </span>
            {combo.genre.label} radio in {combo.countryName}
          </h1>
          <p className="max-w-2xl text-white/80">
            {stations.length > 0
              ? `${stations.length === LIMIT ? "Popular" : `${stations.length}`} live ${combo.genre.label.toLowerCase()} stations broadcasting from ${combo.countryName} right now. Press play, no account needed.`
              : `No ${combo.genre.label.toLowerCase()} stations from ${combo.countryName} are listed right now. Try a nearby genre below.`}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-10 px-4">
        <section aria-labelledby="stations-heading" className="space-y-4">
          <h2 id="stations-heading" className="sr-only">
            Stations
          </h2>
          <StationGrid
            stations={stations}
            label={`${combo.genre.label} stations in ${combo.countryName}`}
            empty={
              <span>
                Nothing here yet.{" "}
                <Link
                  href={`/country/${combo.countryCode.toLowerCase()}`}
                  className="text-text underline underline-offset-4"
                >
                  See all stations from {combo.countryName}
                </Link>
              </span>
            }
          />
        </section>

        <section aria-labelledby="more-heading" className="space-y-3">
          <h2 id="more-heading" className="text-xl font-semibold">
            More from {combo.countryName}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedGenres(combo.genre.slug).map((genre) => (
              <li key={genre.slug}>
                <Link
                  href={`/${comboSlug(genre.slug, combo.countryName)}`}
                  className="block rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-text"
                >
                  {genre.label} radio in {combo.countryName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
