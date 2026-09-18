/*
 * The site's own links, in one place so a test can check that everything we ask
 * search engines to index is actually reachable by a person. /discover spent a
 * while in the sitemap with no link to it anywhere: crawlable, undiscoverable.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Tuner" },
  { href: "/search", label: "Search" },
  { href: "/discover", label: "Discover" },
  { href: "/favorites", label: "Favorites" },
  { href: "/history", label: "History" },
];

export const FOOTER_NAV: NavItem[] = [{ href: "/about", label: "About" }];

/** Every path the site links to from its own chrome. */
export function navigablePaths(): string[] {
  return [...MAIN_NAV, ...FOOTER_NAV].map((item) => item.href);
}
