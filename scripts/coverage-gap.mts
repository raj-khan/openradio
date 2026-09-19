/*
 * Report which radio stations a country has that our directory does not carry.
 *
 * Usage: npm run coverage-gap -- BD [IN NG ...]
 *
 * Wikidata says what exists; Radio Browser says what we can play. The gap
 * between them is the work queue for the seed list (TASK-78). Wikidata records
 * no stream URLs, so nothing here can be played directly: the website column is
 * a starting point for finding one, not a stream.
 *
 * This is a reporting tool, run by hand. No page depends on it, and it is kept
 * out of the app's own code so a Wikidata outage can never affect the site.
 */
import { coverageGap, type KnownStation } from "@/lib/stations/coverage";
import { normalizeStations } from "@/lib/stations/normalize";

const WIKIDATA = "https://query.wikidata.org/sparql";
const DIRECTORY = "https://de1.api.radio-browser.info/json";
const AGENT = "openradio.space coverage report (https://openradio.space)";

/** Radio stations Wikidata records for the country with this ISO code. */
async function knownStations(countryCode: string): Promise<KnownStation[]> {
  const query = `SELECT ?sLabel ?site WHERE {
    ?country wdt:P297 "${countryCode}" .
    ?s wdt:P31/wdt:P279* wd:Q14350 .
    ?s wdt:P17 ?country .
    OPTIONAL { ?s wdt:P856 ?site }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  } LIMIT 500`;
  const response = await fetch(`${WIKIDATA}?format=json&query=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": AGENT, Accept: "application/sparql-results+json" },
  });
  if (!response.ok) throw new Error(`Wikidata answered ${response.status}`);
  const body = await response.json();
  return body.results.bindings.map((row: Record<string, { value: string }>) => ({
    name: row.sLabel.value,
    website: row.site?.value,
  }));
}

async function carriedStations(countryCode: string) {
  const response = await fetch(
    `${DIRECTORY}/stations/bycountrycodeexact/${countryCode}?limit=500`,
    { headers: { "User-Agent": AGENT } },
  );
  if (!response.ok) throw new Error(`Radio Browser answered ${response.status}`);
  return normalizeStations(await response.json());
}

const codes = process.argv.slice(2).map((code) => code.toUpperCase());
if (codes.length === 0) {
  console.error("Usage: npm run coverage-gap -- BD [IN NG ...]");
  process.exit(1);
}

for (const code of codes) {
  const [known, carried] = await Promise.all([knownStations(code), carriedStations(code)]);
  const gap = coverageGap(known, carried);
  console.log(`\n## ${code}`);
  console.log(`\nDirectory carries ${gap.carried}. Wikidata knows ${gap.known}.`);
  if (gap.missing.length === 0) {
    console.log("\nNothing missing.");
    continue;
  }
  console.log(`\n${gap.missing.length} not carried:\n`);
  console.log("| Station | Website |");
  console.log("| --- | --- |");
  for (const station of gap.missing) {
    console.log(`| ${station.name} | ${station.website ?? ""} |`);
  }
}
