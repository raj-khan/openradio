"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { countPixelUrl } from "@/lib/analytics/goatcounter";

/**
 * Records one page view per navigation with a plain image request.
 * No cookies, no identifiers, and it never blocks rendering.
 */
export function VisitCounter({ origin }: { origin: string | null }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!origin) return;
    const url = countPixelUrl(pathname, document.title, origin);
    if (!url) return;
    const image = new Image();
    image.referrerPolicy = "no-referrer-when-downgrade";
    image.src = url;
  }, [origin, pathname]);

  return null;
}
