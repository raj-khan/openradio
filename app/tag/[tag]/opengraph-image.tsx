import { shareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE } from "@/lib/seo/share-image";
import { parseTermSegment, titleCase } from "@/lib/stations/browse";
import { SITE_NAME } from "@/lib/site";

export const alt = `Radio by genre on ${SITE_NAME}`;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_TYPE;
export const revalidate = 86_400;

export default async function TagShareImage({ params }: { params: Promise<{ tag: string }> }) {
  const tag = parseTermSegment((await params).tag);
  return shareImage({
    eyebrow: "Radio",
    title: tag ? `${titleCase(tag)} radio` : "Every genre",
    subtitle: "Live stations from around the world.",
  });
}
