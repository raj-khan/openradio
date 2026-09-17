import type { ReactNode } from "react";

interface StaticScreenProps {
  readout: string;
  eyebrow: string;
  title: string;
  message: string;
  children?: ReactNode;
}

/** Full page "no signal" layout used for errors and not found pages. */
export function StaticScreen({ readout, eyebrow, title, message, children }: StaticScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <div className="grille relative w-full max-w-md overflow-hidden rounded-[var(--radius-tile)] border border-border bg-surface px-6 py-8">
        <div
          aria-hidden="true"
          className="static-noise pointer-events-none absolute inset-0 opacity-[0.07]"
        />
        <p className="font-display text-7xl font-semibold tracking-tight text-accent-alt tabular-nums sm:text-8xl">
          {readout}
          <span className="ml-2 font-mono text-sm text-muted">MHz</span>
        </p>
        <div aria-hidden="true" className="mt-5 flex h-6 items-end justify-between px-2">
          {Array.from({ length: 31 }, (_, i) => (
            <span
              key={i}
              className={`w-px ${i === 15 ? "h-6 bg-accent" : i % 5 === 0 ? "h-4 bg-muted" : "h-2 bg-border"}`}
            />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">{eyebrow}</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mx-auto max-w-md text-muted">{message}</p>
      </div>
      {children && <div className="flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}

export const primaryAction =
  "inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-medium text-accent-contrast";
export const secondaryAction =
  "inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-text hover:bg-surface";
