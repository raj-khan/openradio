"use client";

/* Replaces the root layout, so it cannot rely on global CSS or fonts. */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0908",
          color: "#f4ede4",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <title>Signal lost | OpenRadio</title>
        <main>
          <p style={{ fontSize: "4rem", margin: 0, color: "#ffb347" }}>000.0</p>
          <h1 style={{ fontSize: "2rem" }}>OpenRadio lost its signal</h1>
          <p style={{ color: "#a89c8d" }}>Something went wrong loading the app.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1rem",
              background: "#ff5a2c",
              color: "#0a0908",
              border: 0,
              borderRadius: 999,
              padding: "0.75rem 1.25rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
