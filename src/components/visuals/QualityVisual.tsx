const routes = Array.from({ length: 24 });

/**
 * Abstract "routes under automated check" grid — a portion of the cells
 * read as checked (`primary`), the rest as unchecked (`ink/10`). No real
 * route names or counts invented; the surrounding copy carries those.
 */
export function QualityVisual({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`grid grid-cols-8 gap-space-1 ${className}`}>
      {routes.map((_, i) => (
        <div key={i} className={`aspect-square rounded-sm ${i % 3 === 0 ? "bg-primary/70" : "bg-ink/10"}`} />
      ))}
    </div>
  );
}
