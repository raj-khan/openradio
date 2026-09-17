import { stationFrequency } from "@/lib/tuner/frequency";

interface FrequencyReadoutProps {
  stationId: string;
  size?: "sm" | "md" | "xl";
  className?: string;
}

const SIZES = {
  sm: "text-sm",
  md: "text-2xl",
  xl: "font-display text-6xl sm:text-8xl",
} as const;

/** Decorative "94.3 MHz" style readout derived from a station id. */
export function FrequencyReadout({
  stationId,
  size = "md",
  className = "",
}: FrequencyReadoutProps) {
  return (
    <span
      className={`inline-flex items-baseline gap-1 font-mono tabular-nums ${className}`}
      aria-hidden="true"
    >
      <span className={`${SIZES[size]} leading-none font-medium`}>
        {stationFrequency(stationId)}
      </span>
      <span className="text-[0.65em] text-muted uppercase">MHz</span>
    </span>
  );
}
