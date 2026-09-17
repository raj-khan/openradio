import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowsePage } from "@/components/browse/browse-page";
import { HERO_IMAGE } from "@/lib/imagery/catalog";
import { parseTermSegment, titleCase } from "@/lib/stations/browse";

export async function generateMetadata({
  params,
}: PageProps<"/language/[name]">): Promise<Metadata> {
  const language = parseTermSegment((await params).name);
  if (!language) return { title: "Off the dial" };
  return {
    title: `${titleCase(language)} radio`,
    description: `Listen to live radio stations broadcasting in ${titleCase(language)}.`,
    alternates: { canonical: `/language/${encodeURIComponent(language)}` },
  };
}

export default async function LanguagePage({ params }: PageProps<"/language/[name]">) {
  const language = parseTermSegment((await params).name);
  if (!language) notFound();

  const path = `/language/${encodeURIComponent(language)}`;

  return (
    <BrowsePage
      path={path}
      breadcrumb={[{ name: `${titleCase(language)} radio`, path }]}
      eyebrow="Language"
      title={titleCase(language)}
      subtitle={`Stations broadcasting in ${titleCase(language)}, from everywhere it is spoken.`}
      image={HERO_IMAGE}
      filters={{ language }}
    />
  );
}
