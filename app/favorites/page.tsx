import type { Metadata } from "next";
import { FavoritesList } from "@/components/library/favorites-list";
import { LibraryPage } from "@/components/library/library-page";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved radio stations, stored on this device.",
};

export default function FavoritesPage() {
  return (
    <LibraryPage
      eyebrow="Your presets"
      title="Favorites"
      description="Saved on this device only. No account needed."
    >
      <FavoritesList />
    </LibraryPage>
  );
}
