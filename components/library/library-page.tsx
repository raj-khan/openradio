import type { ReactNode } from "react";

interface LibraryPageProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function LibraryPage({ eyebrow, title, description, actions, children }: LibraryPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">{eyebrow}</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="text-muted">{description}</p>
        </div>
        {actions}
      </header>
      {children}
    </div>
  );
}
