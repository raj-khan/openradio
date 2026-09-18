import { MoodTile } from "@/components/discovery/mood-tile";
import { PlaceTile } from "@/components/discovery/place-tile";
import { Shelf } from "@/components/discovery/shelf";
import { HeroTuner } from "@/components/home/hero-tuner";
import { StationGrid } from "@/components/stations/station-grid";
import { MOODS, PLACES } from "@/lib/imagery/catalog";
import { rotatePlaces } from "@/lib/imagery/rotation";
import { loadFacets, loadStations } from "@/lib/stations/server-data";

// Revalidate the home page data every 10 minutes.
export const revalidate = 600;

export default async function Home() {
  const [countries, popular] = await Promise.all([
    loadFacets("countries"),
    loadStations({ order: "popular", limit: 15 }),
  ]);

  // Same list every visit otherwise: the dial always opened on Tokyo.
  const places = rotatePlaces(PLACES);

  const counts = Object.fromEntries(
    countries.filter((c) => c.code).map((c) => [c.code as string, c.stationCount]),
  );

  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroTuner places={places} counts={counts} />

      <div className="mx-auto w-full max-w-6xl sm:px-4">
        <Shelf title="What's the mood?" eyebrow="Feel" itemClassName="w-72 sm:w-80">
          {MOODS.map((mood) => (
            <MoodTile key={mood.slug} mood={mood} />
          ))}
        </Shelf>
      </div>

      <div className="mx-auto w-full max-w-6xl sm:px-4">
        <Shelf
          title="Travel by radio"
          eyebrow="Places"
          href="/search"
          hrefLabel="All countries"
          itemClassName="w-52 sm:w-60"
        >
          {places.map((place) => (
            <PlaceTile key={place.slug} place={place} stationCount={counts[place.countryCode]} />
          ))}
        </Shelf>
      </div>

      <section
        aria-labelledby="popular-heading"
        className="mx-auto w-full max-w-6xl space-y-4 px-4"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-accent uppercase">
              On air now
            </p>
            <h2 id="popular-heading" className="text-2xl font-semibold sm:text-3xl">
              Most played worldwide
            </h2>
          </div>
        </div>
        {popular.ok ? (
          <StationGrid stations={popular.data} label="Most played stations" />
        ) : (
          <p
            role="alert"
            className="rounded-[var(--radius-tile)] border border-border p-6 text-muted"
          >
            The station directory isn&apos;t responding right now. Places and moods still work, try
            again in a moment for live stations.
          </p>
        )}
      </section>
    </div>
  );
}
