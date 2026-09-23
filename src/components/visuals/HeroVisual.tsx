type Variant = "home" | "work" | "case-study";

// Fixed, self-contained widths rather than `w-full` — this gets dropped into
// absolutely-positioned and grid contexts where a percentage width would
// resolve against an ambiguous (or zero) container size.
const sizes: Record<Variant, string> = {
  home: "aspect-square w-64 sm:w-80 md:w-[26rem] lg:w-[30rem] xl:w-[34rem]",
  work: "aspect-square w-40 sm:w-52 md:w-60",
  "case-study": "aspect-square w-48 sm:w-64 md:w-80",
};

/** Concentric rings + orbiting nodes — the hero's own identity. `prominent`
 * gives Home's hero more visual weight than the case-study's smaller echo
 * of the same shape. */
function OrbitRings({ sizeClass, className, prominent }: { sizeClass: string; className: string; prominent: boolean }) {
  const ring = prominent ? "border-on-header/35" : "border-on-header/20";
  return (
    <div aria-hidden="true" className={`relative ${sizeClass} ${className}`}>
      <div className={`absolute inset-0 rounded-full border bg-on-header/10 ${ring}`} />
      <div className={`absolute inset-[14%] rounded-full border ${prominent ? "border-on-header/45" : "border-on-header/25"}`} />
      <div className={`absolute inset-[30%] rounded-full border ${prominent ? "border-on-header/55" : "border-on-header/30"}`} />
      <div className={`absolute inset-[46%] rounded-full ${prominent ? "bg-on-header/35" : "bg-on-header/20"}`} />
      <div className={`absolute left-[6%] top-[48%] h-2.5 w-2.5 rounded-full ${prominent ? "bg-on-header/90" : "bg-on-header/70"}`} />
      <div className={`absolute right-[10%] top-[22%] h-2 w-2 rounded-full ${prominent ? "bg-on-header/80" : "bg-on-header/60"}`} />
      <div className={`absolute bottom-[10%] left-[38%] h-2 w-2 rounded-full ${prominent ? "bg-on-header/80" : "bg-on-header/60"}`} />
      <div className={`absolute bottom-[20%] right-[22%] h-1.5 w-1.5 rounded-full ${prominent ? "bg-on-header/70" : "bg-on-header/50"}`} />
    </div>
  );
}

const satellites = [
  { x: 18, y: 30, r: 3 },
  { x: 82, y: 22, r: 2 },
  { x: 12, y: 74, r: 2.5 },
  { x: 78, y: 80, r: 3 },
  { x: 50, y: 10, r: 2 },
];

/** A hub-and-spoke node network — deliberately distinct from `OrbitRings`
 * so the featured-work visual doesn't just read as a smaller copy of the
 * hero, and foreshadows the "many things, one platform" idea. */
function NodeNetwork({ sizeClass, className }: { sizeClass: string; className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={`${sizeClass} ${className}`}>
      {satellites.map((p, i) => (
        <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} className="stroke-on-header/25" strokeWidth="1" />
      ))}
      {satellites.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} className="fill-on-header/65" />
      ))}
      <circle cx="50" cy="50" r="8" className="fill-on-header/20 stroke-on-header/50" strokeWidth="1" />
    </svg>
  );
}

/**
 * Deliberately flat placeholder for the eventual 3D hero object (see
 * AGENTS.md's "Future 3D direction"): a clean, prop-driven boundary that
 * establishes scale and position on the page without pre-deciding depth,
 * lighting, or motion a real 3D pass should design on its own terms. Built
 * only from existing on-gradient tokens (the same translucent-glass
 * language `EvidenceCard`'s `onGradient` variant already uses). `work` gets
 * its own composition rather than a resized copy of `home`'s, since both
 * appear together on the homepage.
 */
export function HeroVisual({ variant = "home", className = "" }: { variant?: Variant; className?: string }) {
  if (variant === "work") {
    return <NodeNetwork sizeClass={sizes.work} className={className} />;
  }
  return <OrbitRings sizeClass={sizes[variant]} className={className} prominent={variant === "home"} />;
}
