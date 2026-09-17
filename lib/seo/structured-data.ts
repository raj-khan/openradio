import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";
import { countryName } from "@/lib/stations/display";
import type { Station } from "@/lib/stations/types";

type JsonLd = Record<string, unknown>;

function absolute(path: string): string {
  return new URL(path, siteUrl()).toString();
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
    license: "https://opensource.org/licenses/MIT",
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
    broadcastAffiliateOf: { "@type": "Organization", name: SITE_NAME, url: siteUrl().toString() },
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
