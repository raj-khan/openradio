import { shareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE } from "@/lib/seo/share-image";
import { countryName, primaryTag } from "@/lib/stations/display";
import { loadStation } from "@/lib/stations/server-data";
import { SITE_NAME } from "@/lib/site";

export const alt = `A station on ${SITE_NAME}`;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_TYPE;

/** Cached: a popular station can be scraped far more often than it is played. */
export const revalidate = 86_400;

export default async function StationShareImage({ params }: { params: Promise<{ id: string }> }) {
  const result = await loadStation((await params).id);
  // A station we cannot load still gets a card, just the site's own.
  if (result.status !== "found") {
    return shareImage({ title: "Tune the world.", subtitle: "Live radio from everywhere." });
  }

  const { station } = result;
  const country = countryName(station.countryCode, station.country);
  const tag = primaryTag(station);
  return shareImage({
    eyebrow: country ?? "Live radio",
    title: station.name,
    subtitle: [tag, station.languages[0]].filter(Boolean).join(" · ") || "Listen live on OpenRadio",
  });
}
