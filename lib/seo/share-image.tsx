import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

/*
 * The picture that shows up when a link is shared.
 *
 * Every page used the same tuner card, so a station link on WhatsApp looked
 * exactly like the home page and said nothing about what had been shared. One
 * layout, filled differently per page, keeps them recognisable as the same
 * product without pretending they are the same page.
 */

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };
export const SHARE_IMAGE_TYPE = "image/png";

export interface ShareImageProps {
  /** Small line above the title: a country, a genre, a frequency. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/** Long names have to shrink or they overflow the card rather than wrapping well. */
function titleSize(title: string): number {
  if (title.length > 46) return 58;
  if (title.length > 30) return 74;
  if (title.length > 18) return 92;
  return 104;
}

export function shareImage({ eyebrow, title, subtitle }: ShareImageProps) {
  const ticks = Array.from({ length: 61 }, (_, i) => i);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "radial-gradient(circle at 20% 10%, #3a1f12 0%, #0a0908 55%)",
        color: "#f4ede4",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            border: "4px solid #f4ede4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5a2c" }} />
        </div>
        {SITE_NAME}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {eyebrow && (
          <div style={{ fontSize: 40, color: "#ffb347", letterSpacing: -1 }}>{eyebrow}</div>
        )}
        <div
          style={{
            fontSize: titleSize(title),
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1,
            display: "flex",
          }}
        >
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 32, color: "#a89c8d" }}>{subtitle}</div>}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        {ticks.map((i) => (
          <div
            key={i}
            style={{
              width: i === 30 ? 4 : 2,
              height: i === 30 ? 60 : i % 5 === 0 ? 34 : 16,
              background: i === 30 ? "#ff5a2c" : i % 5 === 0 ? "#a89c8d" : "#3a3128",
            }}
          />
        ))}
      </div>
    </div>,
    SHARE_IMAGE_SIZE,
  );
}
