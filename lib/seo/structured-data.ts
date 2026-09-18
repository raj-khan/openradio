import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";
import { countryName } from "@/lib/stations/display";
import type { Station } from "@/lib/stations/types";

type JsonLd = Record<string, unknown>;

function absolute(path: string): string {
  return new URL(path, siteUrl()).toString();
}

const MIT_LICENSE = "https://opensource.org/licenses/MIT";

/**
 * Who publishes OpenRadio. Without this the markup describes stations well and
 * never says what the site itself is, which is the question an assistant asks
 * first.
 */
export function organizationJsonLd(): JsonLd {
  const url = siteUrl().toString();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: SITE_NAME,
    url,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    logo: {
      "@type": "ImageObject",
      url: absolute("/icons/icon-512.png"),
      width: 512,
      height: 512,
    },
    sameAs: [REPO_URL],
  };
}

/** The product itself: free, open source, runs in a browser. */
export function softwareApplicationJsonLd(): JsonLd {
  const url = siteUrl().toString();
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${url}#app`,
    name: SITE_NAME,
    url,
    description: SITE_DESCRIPTION,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Internet radio player",
    operatingSystem: "Any device with a web browser",
    browserRequirements: "Requires JavaScript to play audio",
    softwareRequirements: "No account, no installation",
    isAccessibleForFree: true,
    license: MIT_LICENSE,
    // Free means free: state a zero price rather than leaving it unsaid.
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Live radio from every country",
      "Search by country, language, genre and bitrate",
      "Plain English discovery",
      "Random station discovery",
      "Favorites and listening history kept on the device",
      "Works offline as an installable web app",
    ],
    publisher: { "@id": `${url}#organization` },
    isPartOf: { "@id": `${url}#website` },
  };
}

/** Site level data with the search box action. */
export function websiteJsonLd(): JsonLd {
  const url = siteUrl().toString();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    name: SITE_NAME,
    alternateName: "OpenRadio world radio player",
    description: SITE_DESCRIPTION,
    url,
    inLanguage: "en",
    isAccessibleForFree: true,
    license: MIT_LICENSE,
    publisher: { "@id": `${url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absolute("/search?text={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** A station as a radio broadcast service people can listen to. */
export function stationJsonLd(station: Station): JsonLd {
  const url = absolute(`/station/${station.id}`);
  const country = countryName(station.countryCode, station.country);
  return {
    "@context": "https://schema.org",
    "@type": "RadioBroadcastService",
    "@id": `${url}#station`,
    name: station.name,
    broadcastDisplayName: station.name,
    url,
    ...(station.faviconUrl ? { image: station.faviconUrl, logo: station.faviconUrl } : {}),
    ...(station.homepageUrl ? { sameAs: [station.homepageUrl] } : {}),
    ...(station.languages.length ? { inLanguage: station.languages } : {}),
    ...(country ? { areaServed: { "@type": "Country", name: country } } : {}),
    ...(station.tags.length ? { genre: station.tags.slice(0, 8) } : {}),
    broadcastAffiliateOf: { "@id": `${siteUrl().toString()}#organization` },
    isAccessibleForFree: true,
    potentialAction: {
      "@type": "ListenAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: url,
        actionPlatform: "https://schema.org/DesktopWebPlatform",
      },
    },
  };
}

/** A list of stations shown on a browse or landing page. */
export function stationListJsonLd(name: string, path: string, stations: Station[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absolute(path)}#collection`,
    name,
    url: absolute(path),
    isPartOf: { "@id": `${siteUrl().toString()}#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stations.length,
      itemListElement: stations.slice(0, 25).map((station, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absolute(`/station/${station.id}`),
        name: station.name,
      })),
    },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
