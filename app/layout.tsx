import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { AudioEngine } from "@/components/player/audio-engine";
import { LibraryHydrator } from "@/components/library/library-hydrator";
import { MediaSession } from "@/components/player/media-session";
import { AmbientBackground } from "@/components/vibe/ambient-background";
import { VibeController } from "@/components/vibe/vibe-controller";
import { NowPlayingPoller } from "@/components/player/now-playing-poller";
import { NowPlayingView } from "@/components/player/now-playing-view";
import { PlayerBar } from "@/components/player/player-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  keywords: [
    "world radio",
    "internet radio",
    "live radio",
    "radio stations",
    "online radio player",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Pages render per request so the CSP nonce from proxy.ts can be applied to scripts.
  await connection();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-accent-contrast focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <AmbientBackground />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <SiteFooter />
        <PlayerBar />
        <NowPlayingView />
        <AudioEngine />
        <MediaSession />
        <NowPlayingPoller />
        <VibeController />
        <LibraryHydrator />
        <div aria-hidden="true" style={{ height: "var(--player-space)" }} />
      </body>
    </html>
  );
}
