type Variant = "architecture" | "product" | "frontend" | "quality";

function ArchitectureMark() {
  return (
    <div className="flex w-full max-w-40 flex-col items-center gap-2">
      <div className="h-5 w-full rounded-md bg-on-header/25" />
      <div className="h-5 w-3/4 rounded-md bg-on-header/40" />
      <div className="h-5 w-1/2 rounded-md bg-on-header/65" />
    </div>
  );
}

function ProductMark() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-on-header/35" />
      <span className="h-5 w-px bg-on-header/25" />
      <span className="h-3.5 w-3.5 rounded-full bg-on-header/50" />
      <span className="h-5 w-px bg-on-header/25" />
      <span className="h-10 w-10 rounded-lg bg-on-header/80" />
    </div>
  );
}

function FrontendMark() {
  return (
    <div className="w-full max-w-40 rounded-lg border border-on-header/25 bg-on-header/10">
      <div className="flex items-center gap-1 border-b border-on-header/20 px-space-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-on-header/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-on-header/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-on-header/40" />
      </div>
      <div className="space-y-1.5 p-space-2">
        <div className="h-2 w-3/4 rounded-full bg-on-header/40" />
        <div className="h-2 w-1/2 rounded-full bg-on-header/25" />
      </div>
    </div>
  );
}

function QualityMark() {
  const cells = Array.from({ length: 16 });
  return (
    <div className="grid w-full max-w-40 grid-cols-8 gap-1">
      {cells.map((_, i) => (
        <div key={i} className={`aspect-square rounded-sm ${i % 3 === 0 ? "bg-on-header/75" : "bg-on-header/15"}`} />
      ))}
    </div>
  );
}

const marks: Record<Variant, () => React.JSX.Element> = {
  architecture: ArchitectureMark,
  product: ProductMark,
  frontend: FrontendMark,
  quality: QualityMark,
};

/**
 * Flat abstract marks for the "What I do" cards — one per capability,
 * deliberately distinct from each other (same "no pseudo-3D" restraint as
 * the other `visuals/` components). Gives each card a large visual moment
 * instead of text alone, the way the reference site's product cards lead
 * with a large photo, without any literal product photography to show.
 */
export function CapabilityVisual({ variant, className = "" }: { variant: Variant; className?: string }) {
  const Mark = marks[variant];
  return (
    <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      <Mark />
    </div>
  );
}
