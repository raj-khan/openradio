"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useId, useRef, type ReactNode } from "react";

interface ShelfProps {
  title: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
  /** Tailwind width classes for each item, e.g. "w-60 sm:w-64". */
  itemClassName?: string;
  children: ReactNode[];
}

/** Horizontal, snap-scrolling row of tiles with a heading and arrows on desktop. */
export function Shelf({
  title,
  eyebrow,
  href,
  hrefLabel = "See all",
  itemClassName = "w-56 sm:w-64",
  children,
}: ShelfProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const headingId = useId();

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <div className="flex items-end justify-between gap-4 px-4 sm:px-0">
        <div>
          {eyebrow && (
            <p className="font-mono text-[11px] tracking-widest text-accent uppercase">{eyebrow}</p>
          )}
          <h2 id={headingId} className="text-2xl font-semibold sm:text-3xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {href && (
            <Link href={href} className="text-sm text-muted hover:text-text">
              {hrefLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} left`}
            className="hidden size-9 items-center justify-center rounded-full border border-border text-muted hover:text-text sm:flex"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} right`}
            className="hidden size-9 items-center justify-center rounded-full border border-border text-muted hover:text-text sm:flex"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        ref={listRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:px-0"
      >
        {children.map((child, index) => (
          <li key={index} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
    </section>
  );
}
