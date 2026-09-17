import type { Metadata } from "next";
import { HistoryList } from "@/components/library/history-list";
import { LibraryPage } from "@/components/library/library-page";

export const metadata: Metadata = {
  alternates: { canonical: "/history" },
  robots: { index: false, follow: true },
  title: "History",
  description: "Stations you listened to recently, stored on this device.",
};

export default function HistoryPage() {
  return (
    <LibraryPage
      eyebrow="Logbook"
      title="Recently played"
      description="Your last 50 stations. Stored on this device only."
    >
      <HistoryList />
    </LibraryPage>
  );
}
