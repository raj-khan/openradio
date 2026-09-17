"use client";

import { Clock, Compass, Heart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SurpriseButton } from "@/components/discovery/surprise-button";
import { Logo } from "@/components/layout/logo";

const NAV = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/history", label: "History", icon: Clock },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold tracking-tight">
          <Logo className="size-7 text-text" />
          <span className="hidden sm:inline">OpenRadio</span>
          <span className="sr-only sm:hidden">OpenRadio home</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                      active ? "bg-surface-strong text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="sr-only md:not-sr-only">{label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <SurpriseButton variant="compact" />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
