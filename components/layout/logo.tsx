export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="6" ry="13" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16h26" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3" fill="var(--accent)" />
    </svg>
  );
}
