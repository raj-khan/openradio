import type { Metadata } from "next";
import Link from "next/link";
import { StaticScreen, primaryAction, secondaryAction } from "@/components/feedback/static-screen";

export const metadata: Metadata = {
  title: "Off the dial",
};

export default function NotFound() {
  return (
    <StaticScreen
      readout="404.0"
      eyebrow="Nothing on this frequency"
      title="Off the dial"
      message="This page or station isn't broadcasting. It may have moved, or the link is mistyped."
    >
      <Link href="/" className={primaryAction}>
        Back to the tuner
      </Link>
      <Link href="/search" className={secondaryAction}>
        Search stations
      </Link>
    </StaticScreen>
  );
}
