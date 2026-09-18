import Link from "next/link";
import { Suspense } from "react";
import { VisitTotal } from "@/components/analytics/visit-total";
import { FOOTER_NAV } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Station data from{" "}
          <a
            href="https://www.radio-browser.info"
            className="underline underline-offset-4 hover:text-text"
            rel="noopener noreferrer"
            target="_blank"
          >
            Radio Browser
          </a>
          . Streams belong to their stations.
        </p>
        <div className="flex items-center gap-4">
          <Suspense fallback={null}>
            <VisitTotal />
          </Suspense>
          <nav aria-label="Footer" className="flex gap-4">
            {FOOTER_NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-text">
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/raj-khan/openradio"
              className="hover:text-text"
              rel="noopener noreferrer"
              target="_blank"
            >
              Source
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
