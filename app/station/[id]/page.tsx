import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaticScreen, secondaryAction } from "@/components/feedback/static-screen";
import { JsonLd } from "@/components/seo/json-ld";
import { FavoriteButton } from "@/components/library/favorite-button";
import { PlayButton } from "@/components/stations/play-button";
import { StationArtwork } from "@/components/stations/station-artwork";
import { StationGrid } from "@/components/stations/station-grid";
import { FrequencyReadout } from "@/components/tuner/frequency-readout";
import { atmosphereFor } from "@/lib/imagery/atmosphere";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { breadcrumbJsonLd, stationJsonLd } from "@/lib/seo/structured-data";
import { countryFlag, countryName, primaryTag } from "@/lib/stations/display";
import { loadSimilarStations, loadStation } from "@/lib/stations/server-data";

export async function generateMetadata({ params }: PageProps<"/station/[id]">): Promise<Metadata> {
  const { id } = await params;
  const result = await loadStation(id);
  if (result.status === "missing") return { title: "Off the dial" };
  if (result.status !== "found") return { title: "Station" };
  const { station } = result;
  const country = countryName(station.countryCode, station.country);
  const description = `Listen live to ${station.name}${country ? ` from ${country}` : ""} on OpenRadio.`;
  return pageMetadata({
    title: country ? `${station.name} (${country})` : station.name,
    description,
    path: `/station/${station.id}`,
    images: [`/station/${station.id}/opengraph-image`],
  });
}

export default async function StationPage({ params }: PageProps<"/station/[id]">) {
  const { id } = await params;
  const result = await loadStation(id);

  if (result.status === "missing") notFound();
  if (result.status === "error") {
    return (
      <StaticScreen
        readout="000.0"
        eyebrow="Signal lost"
        title="Station directory unreachable"
        message="We couldn't reach the station directory right now. Please try again shortly."
      >
        <Link href="/" className={secondaryAction}>
          Back to the tuner
        </Link>
      </StaticScreen>
    );
  }

  const { station } = result;
  const tag = primaryTag(station);
  const similar = await loadSimilarStations(station, tag);
  const image = atmosphereFor(station);
  const country = countryName(station.countryCode, station.country);

  const facts = [
    station.codec && { label: "Codec", value: station.codec },
    station.bitrate && { label: "Bitrate", value: `${station.bitrate} kbps` },
    { label: "Plays", value: station.clickCount.toLocaleString("en") },
    { label: "Votes", value: station.votes.toLocaleString("en") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col gap-14 pb-16">
      <JsonLd
        data={[
          stationJsonLd(station),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            ...(station.countryCode && country
              ? [{ name: country, path: `/country/${station.countryCode.toLowerCase()}` }]
              : []),
            { name: station.name, path: `/station/${station.id}` },
          ]),
        ]}
      />
      <section className="relative isolate overflow-hidden">
        <div className="grain absolute inset-0 -z-10" style={{ backgroundColor: image.color }}>
          <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-12 pb-10 text-white md:flex-row md:items-end md:gap-12 md:pt-24">
          <StationArtwork
            station={station}
            className="size-40 rounded-[2rem] shadow-[0_30px_80px_rgb(0_0_0/0.6)] ring-1 ring-white/15 sm:size-52"
          />
          <div className="flex-1 space-y-4">
            <FrequencyReadout
              stationId={station.id}
              size="md"
              className="text-[var(--accent-alt)] [&_span:last-child]:text-white/60"
            />
            <h1 className="text-4xl leading-tight font-semibold sm:text-6xl">{station.name}</h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/80">
              {station.countryCode && country && (
                <Link
                  href={`/country/${station.countryCode.toLowerCase()}`}
                  className="hover:underline"
                >
                  <span aria-hidden="true" className="mr-1.5">
                    {countryFlag(station.countryCode)}
                  </span>
                  {country}
                  {station.state ? `, ${station.state}` : ""}
                </Link>
              )}
              {station.languages.slice(0, 3).map((language) => (
                <Link
                  key={language}
                  href={`/language/${encodeURIComponent(language)}`}
                  className="capitalize hover:underline"
                >
                  {language}
                </Link>
              ))}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PlayButton station={station} size="lg" />
              <FavoriteButton station={station} variant="glass" className="size-11" />
              {station.homepageUrl && (
                <a
                  href={station.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm backdrop-blur-sm hover:bg-white/10"
                >
                  Station website
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 md:grid-cols-[1fr_2fr]">
        <dl className="grille grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-tile)] border border-border bg-border">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-surface p-4">
              <dt className="font-mono text-[10px] tracking-widest text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {station.tags.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Tags</h2>
            <ul className="flex flex-wrap gap-2">
              {station.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/tag/${encodeURIComponent(t)}`}
                    className="block rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-text"
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <section
          aria-labelledby="similar-heading"
          className="mx-auto w-full max-w-6xl space-y-4 px-4"
        >
          <div>
            <p className="font-mono text-[11px] tracking-widest text-accent uppercase">
              Nearby on the dial
            </p>
            <h2 id="similar-heading" className="text-2xl font-semibold sm:text-3xl">
              Similar stations
            </h2>
          </div>
          <StationGrid stations={similar} label="Similar stations" />
        </section>
      )}

      <p className="mx-auto w-full max-w-6xl px-4 text-xs text-muted">
        Photo by{" "}
        <a
          href={image.credit.photoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {image.credit.photographer}
        </a>{" "}
        on Unsplash. Station data from Radio Browser.
      </p>
    </div>
  );
}
