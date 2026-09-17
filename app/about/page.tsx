import type { Metadata } from "next";
import Link from "next/link";
import { allImages } from "@/lib/imagery/catalog";
import { REPO_URL, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/about" },
};

const SECTIONS = [
  {
    title: "What it is",
    body: "OpenRadio is an open-source way to explore live internet radio from around the world. Tune by place, mood, language or genre, describe what you want to hear, or let it surprise you.",
  },
  {
    title: "Where the stations come from",
    body: "Station listings come from Radio Browser, a free, community-maintained directory. OpenRadio does not host, record or rebroadcast any audio: your browser connects directly to each station's own stream.",
  },
  {
    title: "Your privacy",
    body: "No accounts and no tracking. Favorites and listening history are stored only in your browser. When now playing information is shown, our server reads the station's public stream metadata for you.",
  },
  {
    title: "Culture and faith",
    body: "Stations appear under faith, culture or language only when their broadcasters tag them that way. OpenRadio never infers religion or ethnicity from a country, language or name.",
  },
  {
    title: "AI, optionally",
    body: "Discovery works with plain keywords. If the site owner configures an AI model, it may help interpret requests, but stations and streams always come from the directory, never from AI.",
  },
];

export default function AboutPage() {
  const credits = allImages();
  return (
    <div className="mx-auto w-full max-w-3xl space-y-12 px-4 py-12">
      <header className="space-y-3">
        <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">About</p>
        <h1 className="text-4xl font-semibold sm:text-6xl">Explore the world through radio.</h1>
        <p className="text-lg text-muted">{SITE_DESCRIPTION}</p>
      </header>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Open source</h2>
          <p className="leading-relaxed text-muted">
            OpenRadio is MIT licensed.{" "}
            <a
              href={REPO_URL}
              className="text-text underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the code, report issues or contribute on GitHub
            </a>
            .
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Disclaimer</h2>
          <p className="leading-relaxed text-muted">
            Streams, names and logos belong to their stations. OpenRadio is not affiliated with any
            station and is not responsible for their content. Station owners can update or remove
            listings through{" "}
            <a
              href="https://www.radio-browser.info"
              className="text-text underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radio Browser
            </a>
            .
          </p>
        </section>
      </div>

      <section className="space-y-4" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="text-2xl font-semibold">
          Photography
        </h2>
        <p className="text-muted">
          Photos from{" "}
          <a
            href="https://unsplash.com"
            className="text-text underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>{" "}
          under the Unsplash License. Thank you to these photographers:
        </p>
        <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {credits.map((image) => (
            <li key={image.src} className="truncate">
              <a
                href={image.credit.photoUrl}
                className="text-muted hover:text-text"
                target="_blank"
                rel="noopener noreferrer"
              >
                {image.alt || "Photo"}
              </a>{" "}
              <span className="text-muted">by</span>{" "}
              <a
                href={image.credit.profileUrl}
                className="underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {image.credit.photographer}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <Link href="/" className="text-accent underline underline-offset-4">
          Back to the tuner
        </Link>
      </p>
    </div>
  );
}
