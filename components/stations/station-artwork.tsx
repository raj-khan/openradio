"use client";

import { useEffect, useRef, useState } from "react";
import { hueFromString, initials } from "@/lib/stations/display";

interface StationArtworkProps {
  station: { id: string; name: string; faviconUrl?: string };
  className?: string;
}

/**
 * Station favicon over a generated gradient label. The label shows while the
 * favicon loads and stays when it is missing or broken.
 */
export function StationArtwork({ station, className = "size-12" }: StationArtworkProps) {
  const url = station.faviconUrl;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Server-rendered images can settle before hydration, when handlers are not attached yet.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !url || !img.complete) return;
    if (img.naturalWidth === 0) setFailedUrl(url);
    else setLoadedUrl(url);
  }, [url]);

  const showImage = url && failedUrl !== url;
  const loaded = showImage && loadedUrl === url;
  const hue = hueFromString(station.id);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-surface-strong ${className}`}
      aria-hidden="true"
    >
      <div
        className="flex size-full items-center justify-center text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 60) % 360} 60% 28%))`,
        }}
      >
        {initials(station.name)}
      </div>
      {showImage && (
        // External station artwork from arbitrary hosts, so next/image is not used.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 size-full bg-white object-contain p-1 transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoadedUrl(url)}
          onError={() => setFailedUrl(url)}
        />
      )}
    </div>
  );
}
