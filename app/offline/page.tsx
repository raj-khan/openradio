import type { Metadata } from "next";
import Link from "next/link";
import { StaticScreen, primaryAction, secondaryAction } from "@/components/feedback/static-screen";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <StaticScreen
      readout="---.-"
      eyebrow="No connection"
      title="You're offline"
      message="This page isn't saved on your device yet. Your favorites and history are still here, and live radio will be back when you reconnect."
    >
      <Link href="/favorites" className={primaryAction}>
        Favorites
      </Link>
      <Link href="/history" className={secondaryAction}>
        History
      </Link>
    </StaticScreen>
  );
}
