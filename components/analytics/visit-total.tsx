import { fetchVisitTotals, formatVisits } from "@/lib/analytics/goatcounter";

/** Shows total visits when counting is configured, otherwise nothing. */
export async function VisitTotal({ className = "" }: { className?: string }) {
  const totals = await fetchVisitTotals();
  if (!totals) return null;

  return (
    <span className={`font-mono text-xs text-muted ${className}`}>
      {formatVisits(totals.count)} visits
    </span>
  );
}
