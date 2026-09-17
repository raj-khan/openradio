"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StaticScreen, primaryAction, secondaryAction } from "@/components/feedback/static-screen";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <StaticScreen
      readout="000.0"
      eyebrow="Signal lost"
      title="Something went quiet"
      message="This page hit a problem. Your radio keeps playing; try again or head back to the tuner."
    >
      <button type="button" onClick={() => retry()} className={primaryAction}>
        Try again
      </button>
      <Link href="/" className={secondaryAction}>
        Back to the tuner
      </Link>
    </StaticScreen>
  );
}
