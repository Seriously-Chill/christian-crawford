const brands = ["Brand A", "Brand B", "Brand C"];

/**
 * Flat, literal read of the case study's own diagram (a shared platform
 * branching into per-brand products) — plain DOM nodes and border lines,
 * not SVG or invented brand names. Same "clean boundary, no pseudo-3D"
 * intent as `HeroVisual`: this is the shape a real 3D version can pick up
 * later, not an attempt at simulating it now.
 */
export function ArchitectureVisual({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex flex-col items-center ${className}`}>
      <div className="rounded-pill border border-ink/15 bg-ink/3 px-space-3 py-1 text-label text-ink/70">
        Shared platform
      </div>
      <div className="h-space-2 w-px bg-ink/20" />
      <div className="relative flex w-full max-w-xs justify-between">
        <div className="absolute left-0 right-0 top-0 h-px bg-ink/20" />
        {brands.map((brand) => (
          <div key={brand} className="flex flex-col items-center">
            <div className="h-space-2 w-px bg-ink/20" />
            <div className="rounded-pill border border-ink/15 bg-ink/3 px-space-2 py-1 text-label text-ink/70">
              {brand}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
