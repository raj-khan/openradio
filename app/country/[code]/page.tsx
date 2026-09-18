import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowsePage } from "@/components/browse/browse-page";
import { HERO_IMAGE, PLACES, placeForCountry } from "@/lib/imagery/catalog";
import { PSEO_GENRES, comboSlug } from "@/lib/seo/combos";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { parseCountrySegment } from "@/lib/stations/browse";
import { countryFlag, countryName } from "@/lib/stations/display";

export async function generateMetadata({
  params,
}: PageProps<"/country/[code]">): Promise<Metadata> {
  const country = parseCountrySegment((await params).code);
  if (!country) return { title: "Off the dial" };
  return pageMetadata({
    title: `Radio from ${country.name}`,
    description: `Listen to live radio stations from ${country.name}.`,
    path: `/country/${country.code.toLowerCase()}`,
  });
}

export default async function CountryPage({ params }: PageProps<"/country/[code]">) {
  const country = parseCountrySegment((await params).code);
  if (!country) notFound();

  const place = placeForCountry(country.code);

  return (
    <BrowsePage
      path={`/country/${country.code.toLowerCase()}`}
      breadcrumb={[{ name: country.name, path: `/country/${country.code.toLowerCase()}` }]}
      eyebrow={place ? `Tuned to ${place.city}` : "Country"}
      listName={`Radio from ${country.name}`}
      title={
        <>
          <span aria-hidden="true" className="mr-3">
            {countryFlag(country.code)}
          </span>
          {country.name}
        </>
      }
      subtitle={`Live radio from ${country.name}, most played first.`}
      image={place?.image ?? HERO_IMAGE}
      filters={{ country: country.code }}
      related={[
        ...PSEO_GENRES.map((genre) => ({
          href: `/${comboSlug(genre.slug, country.name)}`,
          label: `${genre.label} radio in ${country.name}`,
        })),
        ...PLACES.filter((p) => p.countryCode !== country.code).map((p) => ({
          href: `/country/${p.countryCode.toLowerCase()}`,
          label: `${countryFlag(p.countryCode)} ${countryName(p.countryCode)}`,
        })),
      ]}
    />
  );
}
