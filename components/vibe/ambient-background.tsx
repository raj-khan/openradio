/**
 * Soft light blobs tinted by the current theme accents. Sits behind all
 * content; motion depends on the vibe and stops when paused or with reduced motion.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="ambient pointer-events-none fixed inset-0 -z-50 overflow-hidden"
    >
      <div className="ambient-blob ambient-blob-a" />
      <div className="ambient-blob ambient-blob-b" />
      <div className="grille absolute inset-0 opacity-40" />
    </div>
  );
}
