import Image from "next/image";
import Link from "next/link";
import type { Place } from "@/lib/imagery/catalog";
import { countryFlag, countryName } from "@/lib/stations/display";

interface PlaceTileProps {
  place: Place;
  stationCount?: number;
  size?: "md" | "lg";
  priority?: boolean;
}

export function PlaceTile({ place, stationCount, size = "md", priority = false }: PlaceTileProps) {
  const country = countryName(place.countryCode) ?? place.city;

  return (
    <Link
      href={`/country/${place.countryCode.toLowerCase()}`}
      className={`grain group relative block overflow-hidden rounded-[var(--radius-tile)] ${
        size === "lg" ? "aspect-[4/5] sm:aspect-[3/4]" : "aspect-[3/4]"
      }`}
      style={{ backgroundColor: place.image.color }}
    >
      <Image
        src={place.image.src}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 60vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white">
        <span className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
          {place.city}
        </span>
        <span className="font-display text-2xl leading-tight font-semibold">
          <span aria-hidden="true" className="mr-2">
            {countryFlag(place.countryCode)}
          </span>
          {country}
        </span>
        {stationCount !== undefined && (
          <span className="text-sm text-white/75">
            {stationCount.toLocaleString("en")} stations
          </span>
        )}
        <span className="mt-2 flex h-2 items-end justify-between" aria-hidden="true">
          {Array.from({ length: 21 }, (_, i) => (
            <span
              key={i}
              className={`w-px bg-white/50 ${i % 5 === 0 ? "h-2" : "h-1"} ${
                i === 10 ? "h-2 bg-[var(--accent)]" : ""
              }`}
            />
          ))}
        </span>
      </span>
    </Link>
  );
}
