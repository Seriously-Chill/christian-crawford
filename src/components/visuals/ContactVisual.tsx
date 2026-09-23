/**
 * The site's recurring "complex → simple" motif, rendered flat: a loose
 * scatter of small nodes resolving into one clean shape. Same restrained
 * placeholder approach as the other `visuals/` components.
 */
export function ContactVisual({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-space-4 ${className}`}>
      <div className="relative h-24 w-24 shrink-0">
        <div className="absolute left-2 top-3 h-2.5 w-2.5 rounded-full bg-on-header/60" />
        <div className="absolute left-8 top-0 h-2 w-2 rounded-full bg-on-header/50" />
        <div className="absolute left-0 top-12 h-2 w-2 rounded-full bg-on-header/50" />
        <div className="absolute left-10 top-9 h-3 w-3 rounded-full bg-on-header/70" />
        <div className="absolute left-4 top-16 h-2 w-2 rounded-full bg-on-header/40" />
        <div className="absolute left-14 top-15 h-1.5 w-1.5 rounded-full bg-on-header/40" />
      </div>
      <div className="h-px w-space-4 shrink-0 bg-on-header/30" />
      <div className="h-10 w-10 shrink-0 rounded-full border border-on-header/50 bg-on-header/20" />
    </div>
  );
}
