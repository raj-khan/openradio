import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowsePage } from "@/components/browse/browse-page";
import { HERO_IMAGE, PLACES, placeForCountry } from "@/lib/imagery/catalog";
import { parseCountrySegment } from "@/lib/stations/browse";
import { countryFlag, countryName } from "@/lib/stations/display";

export async function generateMetadata({
  params,
}: PageProps<"/country/[code]">): Promise<Metadata> {
  const country = parseCountrySegment((await params).code);
  if (!country) return { title: "Off the dial" };
  return {
    title: `Radio from ${country.name}`,
    description: `Listen to live radio stations from ${country.name}.`,
  };
}

export default async function CountryPage({ params }: PageProps<"/country/[code]">) {
  const country = parseCountrySegment((await params).code);
  if (!country) notFound();

  const place = placeForCountry(country.code);

  return (
    <BrowsePage
      eyebrow={place ? `Tuned to ${place.city}` : "Country"}
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
      related={PLACES.filter((p) => p.countryCode !== country.code).map((p) => ({
        href: `/country/${p.countryCode.toLowerCase()}`,
        label: `${countryFlag(p.countryCode)} ${countryName(p.countryCode)}`,
      }))}
    />
  );
}
