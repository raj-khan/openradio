interface EqualizerBarsProps {
  active: boolean;
  bars?: number;
  className?: string;
}

/** Small animated equalizer shown while audio plays. Decorative only. */
export function EqualizerBars({ active, bars = 4, className = "h-4" }: EqualizerBarsProps) {
  return (
    <span
      className={`inline-flex items-end gap-[2px] ${className}`}
      aria-hidden="true"
      data-active={active}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-full bg-accent"
          style={{ animationDelay: `${i * -0.23}s`, height: active ? undefined : "30%" }}
        />
      ))}
    </span>
  );
}
