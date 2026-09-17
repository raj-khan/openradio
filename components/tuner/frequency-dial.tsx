"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";
import { nearestDialIndex } from "@/lib/tuner/frequency";

export interface DialEntry {
  id: string;
  label: string;
  sublabel?: string;
}

interface FrequencyDialProps {
  entries: DialEntry[];
  value: number;
  onChange: (index: number) => void;
  label: string;
  className?: string;
}

const SEGMENT = 112; // px per entry
const TICKS = 11; // odd so one tick sits exactly under the needle
const CENTER_TICK = Math.floor(TICKS / 2);

/**
 * Analog style tuning scale. The needle is fixed in the center; the scale
 * scrolls beneath it (drag, wheel, touch) and snaps to entries. Operable as a
 * slider with the keyboard.
 */
export function FrequencyDial({
  entries,
  value,
  onChange,
  label,
  className = "",
}: FrequencyDialProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const programmatic = useRef(false);
  const count = entries.length;

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const el = scrollerRef.current;
    if (!el) return;
    programmatic.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: index * SEGMENT, behavior: smooth && !reduce ? "smooth" : "auto" });
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => (programmatic.current = false), 450);
  }, []);

  // Keep the scale aligned with the controlled value.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (nearestDialIndex(el.scrollLeft, SEGMENT, count) !== value) scrollToIndex(value);
  }, [value, count, scrollToIndex]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  const onScroll = () => {
    if (programmatic.current) return;
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const index = nearestDialIndex(el.scrollLeft, SEGMENT, count);
      if (index !== value) onChange(index);
    }, 140);
  };

  const select = (index: number) => {
    const next = Math.max(0, Math.min(count - 1, index));
    scrollToIndex(next);
    if (next !== value) onChange(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: value + 1,
      ArrowUp: value + 1,
      ArrowLeft: value - 1,
      ArrowDown: value - 1,
      Home: 0,
      End: count - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key]);
    }
  };

  const current = entries[value];

  return (
    <div className={`relative select-none ${className}`}>
      <div className="dial-surface relative overflow-hidden rounded-3xl border border-border bg-surface/80 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
        {/* The scroller itself is the slider, so it is keyboard reachable and holds no nested controls. */}
        <div
          ref={scrollerRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={Math.max(0, count - 1)}
          aria-valuenow={value}
          aria-valuetext={current ? current.label : undefined}
          onKeyDown={onKeyDown}
          onScroll={onScroll}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-4 outline-none active:cursor-grabbing"
          style={{ paddingInline: `calc(50% - ${SEGMENT / 2}px)` }}
        >
          {entries.map((entry, index) => (
            // Pointer shortcut only; keyboard and assistive tech use the slider.
            <span
              key={entry.id}
              aria-hidden="true"
              onClick={() => select(index)}
              className="group flex shrink-0 cursor-pointer snap-center flex-col items-center"
              style={{ width: SEGMENT }}
            >
              <span
                className="flex h-8 w-full items-end justify-between px-[6px]"
                aria-hidden="true"
              >
                {Array.from({ length: TICKS }, (_, tick) => (
                  <span
                    key={tick}
                    className={`w-px ${
                      tick === CENTER_TICK
                        ? "h-8 bg-text"
                        : tick === 0 || tick === TICKS - 1
                          ? "h-5 bg-muted"
                          : "h-3 bg-border"
                    }`}
                  />
                ))}
              </span>
              <span
                className={`mt-2 max-w-full truncate px-1 text-sm transition-colors ${
                  index === value ? "font-medium text-text" : "text-muted group-hover:text-text"
                }`}
              >
                {entry.label}
              </span>
              {entry.sublabel && (
                <span className="font-mono text-[10px] text-muted tabular-nums">
                  {entry.sublabel}
                </span>
              )}
            </span>
          ))}
        </div>
        {/* Needle */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 h-14 w-[2px] -translate-x-1/2 bg-accent shadow-[0_0_12px_var(--accent)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent"
        />
      </div>
    </div>
  );
}
