import Image from "next/image";
import Link from "next/link";
import type { Mood } from "@/lib/imagery/catalog";

interface MoodTileProps {
  mood: Mood;
  className?: string;
}

export function MoodTile({ mood, className = "" }: MoodTileProps) {
  return (
    <Link
      href={`/tag/${encodeURIComponent(mood.primaryTag)}`}
      className={`grain group relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-tile)] ${className}`}
      style={{ backgroundColor: mood.image.color }}
    >
      <Image
        src={mood.image.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 75vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/35 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-4 text-white">
        <span className="font-display block text-xl leading-tight font-semibold">{mood.label}</span>
        <span className="mt-1 block text-sm text-white/75">{mood.blurb}</span>
      </span>
    </Link>
  );
}
