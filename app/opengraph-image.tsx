import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ fontSize: 40, color: "#ffb347", letterSpacing: -1 }}>98.8 MHz</div>
        <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
          Tune the world.
        </div>
        <div style={{ fontSize: 32, color: "#a89c8d" }}>
          Live radio from every country, language and genre.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 60,
          position: "relative",
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
    size,
  );
}
