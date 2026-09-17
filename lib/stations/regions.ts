/**
 * Canonical country lookup built from Intl region names.
 *
 * Some ICU builds also return current names for deprecated codes (DD for East
 * Germany, UK, FX, SU), so those are excluded and the canonical code wins.
 */
const DEPRECATED = new Set([
  "AN",
  "BU",
  "CS",
  "CT",
  "DD",
  "DY",
  "FQ",
  "FX",
  "HV",
  "JT",
  "MI",
  "NH",
  "NQ",
  "NT",
  "PC",
  "PU",
  "PZ",
  "RH",
  "SU",
  "TP",
  "UK",
  "VD",
  "WK",
  "YD",
  "YU",
  "ZR",
]);

/** User-assigned and private-use ranges that are not real countries. */
function isPrivateUse(code: string) {
  return code === "AA" || code === "ZZ" || /^[QX][A-Z]$/.test(code) || /^X[A-Z]$/.test(code);
}

export interface Region {
  code: string;
  name: string;
}

let cache: Region[] | null = null;

/** Every usable region with its English name, in code order. */
export function allRegions(): Region[] {
  if (cache) return cache;
  const regions: Region[] = [];
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null;
  }
  if (names) {
    for (let a = 65; a <= 90; a++) {
      for (let b = 65; b <= 90; b++) {
        const code = String.fromCharCode(a, b);
        if (DEPRECATED.has(code) || isPrivateUse(code)) continue;
        let name: string | undefined;
        try {
          name = names.of(code);
        } catch {
          name = undefined;
        }
        if (!name || name === code || name === "Unknown Region") continue;
        regions.push({ code, name });
      }
    }
  }
  cache = regions;
  return regions;
}

/** Names a region can be searched by, e.g. "Myanmar (Burma)" also as "Myanmar" and "Burma". */
export function regionAliases(name: string): string[] {
  const aliases = [name];
  const match = /^(.*?)\s*\((.*?)\)\s*$/.exec(name);
  if (match) aliases.push(match[1], match[2]);
  return aliases.filter(Boolean);
}

/** Build a lookup from a normalized key to a region, keeping the first match. */
export function regionIndex(key: (name: string) => string): Map<string, Region> {
  const index = new Map<string, Region>();
  for (const region of allRegions()) {
    for (const alias of regionAliases(region.name)) {
      const k = key(alias);
      if (k && !index.has(k)) index.set(k, region);
    }
  }
  return index;
}
