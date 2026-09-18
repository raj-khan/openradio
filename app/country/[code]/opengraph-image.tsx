import { shareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE } from "@/lib/seo/share-image";
import { parseCountrySegment } from "@/lib/stations/browse";
import { SITE_NAME } from "@/lib/site";

export const alt = `Radio by country on ${SITE_NAME}`;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_TYPE;
export const revalidate = 86_400;

export default async function CountryShareImage({ params }: { params: Promise<{ code: string }> }) {
  const country = parseCountrySegment((await params).code);
  return shareImage({
    eyebrow: "Radio from",
    title: country?.name ?? "Every country",
    subtitle: "Live stations, most played first.",
  });
}
