import type { Metadata } from "next";

/*
 * One place to describe a page to a link scraper.
 *
 * Getting this wrong is invisible in a browser and obvious in a chat app. The
 * root layout used to hand every child a hardcoded og:title and og:url, so
 * sharing /faq or /country/jp previewed as the home page and pointed at the
 * home page, while the document title and canonical on those same pages were
 * correct all along. Keeping the three in step is easier than remembering to.
 */

export interface PageMetadataInput {
  /** Page title, without the site name: the template adds that. */
  title: string;
  description: string;
  /** Path this page lives at, used for both the canonical and og:url. */
  path: string;
  /** Overrides the site image, e.g. a station's own artwork. */
  images?: string[];
  /** Keep a page out of the index while still describing it properly. */
  noIndex?: boolean;
}

/*
 * Declaring `openGraph` or `twitter` on a page replaces the root's object
 * rather than merging into it, which quietly costs you anything the root was
 * providing. Both of these were lost that way and had to be restated here: the
 * file-convention share image disappeared entirely, and the card type fell back
 * from a large image to a thumbnail.
 */
const SITE_IMAGE = "/opengraph-image";
const CARD = "summary_large_image" as const;

export function pageMetadata({
  title,
  description,
  path,
  images,
  noIndex,
}: PageMetadataInput): Metadata {
  const share = images ?? [SITE_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: path,
      images: share,
    },
    // Stated rather than inherited: a page whose openGraph says one thing and
    // whose twitter tags say another previews differently per platform, which
    // is how station pages ended up titled "RTL" on WhatsApp and "OpenRadio:
    // world radio, open source" on X.
    twitter: {
      card: CARD,
      title,
      description,
      images: share,
    },
  };
}
