"use client";

import Link from "next/link";
import { StationGrid, StationGridSkeleton } from "@/components/stations/station-grid";
import { useFavorites } from "@/lib/library/favorites";
import { useHydrated } from "@/lib/library/hydration";

export function FavoritesList() {
  const hydrated = useHydrated(useFavorites);
  const stations = useFavorites((s) => s.stations);

  if (!hydrated) return <StationGridSkeleton count={5} />;

  return (
    <>
      <h2 className="sr-only">Saved stations</h2>
      <StationGrid
        stations={stations}
        label="Favorite stations"
        empty={
          <span>
            No presets saved yet. Tap the heart on any station to keep it here.{" "}
            <Link href="/" className="text-text underline underline-offset-4">
              Start tuning
            </Link>
          </span>
        }
      />
    </>
  );
}
