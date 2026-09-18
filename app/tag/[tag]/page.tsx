import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowsePage } from "@/components/browse/browse-page";
import { HERO_IMAGE, MOODS, moodForTag } from "@/lib/imagery/catalog";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { parseTermSegment, titleCase } from "@/lib/stations/browse";

export async function generateMetadata({ params }: PageProps<"/tag/[tag]">): Promise<Metadata> {
  const tag = parseTermSegment((await params).tag);
  if (!tag) return { title: "Off the dial" };
  const mood = moodForTag(tag);
  return pageMetadata({
    title: `${mood && mood.primaryTag === tag ? mood.label : titleCase(tag)} radio`,
    description: `Listen to live ${tag} radio stations from around the world.`,
    path: `/tag/${encodeURIComponent(tag)}`,
  });
}

export default async function TagPage({ params }: PageProps<"/tag/[tag]">) {
  const tag = parseTermSegment((await params).tag);
  if (!tag) notFound();

  const mood = moodForTag(tag);
  const isMood = mood?.primaryTag === tag;

  const path = `/tag/${encodeURIComponent(tag)}`;

  return (
    <BrowsePage
      path={path}
      breadcrumb={[{ name: isMood && mood ? mood.label : titleCase(tag), path }]}
      eyebrow={isMood ? "Mood" : "Genre and tag"}
      title={isMood && mood ? mood.label : titleCase(tag)}
      subtitle={
        isMood && mood
          ? `${mood.blurb}. Stations tagged “${tag}” by their broadcasters.`
          : `Stations tagged “${tag}” by their broadcasters.`
      }
      image={mood?.image ?? HERO_IMAGE}
      filters={{ tag }}
      related={[
        ...(mood
          ? mood.tags
              .filter((t) => t !== tag)
              .map((t) => ({ href: `/tag/${encodeURIComponent(t)}`, label: t }))
          : []),
        ...MOODS.filter((m) => m.slug !== mood?.slug).map((m) => ({
          href: `/tag/${encodeURIComponent(m.primaryTag)}`,
          label: m.label,
        })),
      ]}
    />
  );
}
