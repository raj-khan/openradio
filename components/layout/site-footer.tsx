import Link from "next/link";

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
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/about" className="hover:text-text">
            About
          </Link>
          <a
            href="https://github.com/raj-khan/radio-atlas"
            className="hover:text-text"
            rel="noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
