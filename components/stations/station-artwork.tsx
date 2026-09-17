"use client";

import { useState } from "react";
import { hueFromString, initials } from "@/lib/stations/display";

interface StationArtworkProps {
  station: { id: string; name: string; faviconUrl?: string };
  className?: string;
}

/** Station favicon with a generated gradient placeholder when missing or broken. */
export function StationArtwork({ station, className = "size-12" }: StationArtworkProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = station.faviconUrl;
  const showImage = url && failedUrl !== url;
  const hue = hueFromString(station.id);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-surface-strong ${className}`}
      aria-hidden="true"
    >
      {showImage ? (
        // External station artwork from arbitrary hosts, so next/image is not used.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full bg-white/90 object-contain p-1"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        <div
          className="flex size-full items-center justify-center text-sm font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 60) % 360} 60% 28%))`,
          }}
        >
          {initials(station.name)}
        </div>
      )}
    </div>
  );
}
