import { shareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE } from "@/lib/seo/share-image";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_TYPE;

export default function OpenGraphImage() {
  return shareImage({
    eyebrow: "98.8 MHz",
    title: "Tune the world.",
    subtitle: "Live radio from every country, language and genre.",
  });
}
