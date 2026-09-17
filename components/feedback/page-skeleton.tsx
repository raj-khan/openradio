import { StationGridSkeleton } from "@/components/stations/station-grid";

/** Loading state shared by station listing pages. */
export function PageSkeleton({ hero = false }: { hero?: boolean }) {
  return (
    <div className="flex flex-col gap-10 pb-16" aria-busy="true">
      <p className="sr-only" role="status">
        Tuning in…
      </p>
      {hero ? (
        <div className="grille h-[40svh] animate-pulse bg-surface" />
      ) : (
        <div className="mx-auto w-full max-w-6xl space-y-3 px-4 pt-10">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-strong" />
          <div className="h-10 w-72 max-w-full animate-pulse rounded bg-surface-strong" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
        </div>
      )}
      <div className="mx-auto w-full max-w-6xl px-4">
        <StationGridSkeleton count={10} />
      </div>
    </div>
  );
}
