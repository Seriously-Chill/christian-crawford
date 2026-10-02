/**
 * The down arrow between steps in the HTML diagrams, drawn like `LineIcon`
 * (1.5px round strokes in `currentColor`). Decorative: each diagram carries
 * the step order in its markup. `className` places it; the default suits a
 * vertical stack, and a diagram that turns sideways rotates it.
 */
export function FlowArrow({ className = "mx-auto my-space-1" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 24"
      className={`h-6 w-4 shrink-0 text-ink/40 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v18M3 15l5 5 5-5" />
    </svg>
  );
}
