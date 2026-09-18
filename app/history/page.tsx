import type { Metadata } from "next";
import { HistoryList } from "@/components/library/history-list";
import { LibraryPage } from "@/components/library/library-page";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "History",
  description: "Stations you listened to recently, stored on this device.",
  path: "/history",
  noIndex: true,
});

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
