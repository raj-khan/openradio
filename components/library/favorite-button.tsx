"use client";

import { Heart } from "lucide-react";
import { useFavorites, useIsFavorite } from "@/lib/library/favorites";
import type { Station } from "@/lib/stations/types";

interface FavoriteButtonProps {
  station: Station;
  className?: string;
  variant?: "ghost" | "glass";
}

export function FavoriteButton({
  station,
  className = "",
  variant = "ghost",
}: FavoriteButtonProps) {
  const favorite = useIsFavorite(station.id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        useFavorites.getState().toggle(station);
      }}
      aria-pressed={favorite}
      aria-label={
        favorite ? `Remove ${station.name} from favorites` : `Add ${station.name} to favorites`
      }
      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition ${
        variant === "glass"
          ? "border border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-white/10"
          : "text-muted hover:text-text"
      } ${className}`}
    >
      <Heart
        className={`size-5 transition ${favorite ? "scale-110 fill-accent text-accent" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}
