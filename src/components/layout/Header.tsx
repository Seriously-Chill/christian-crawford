import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { textH4 } from "@/lib/type";

/**
 * The header's gradient, wordmark, and sticky positioning. The nav lives in
 * `Nav`, a Client Component (it needs the pathname and open/close state);
 * everything else here stays a Server Component.
 *
 * The bottom edge's shallow upward bow is a `clip-path` on its own `inset-0`
 * background layer, not on `<header>`: clipping the header would also clip
 * `ColorPicker`'s popover and `Nav`'s mobile panel, which render outside its
 * box on purpose. A color-matched overlay strip can't draw it either, since
 * the header's gradient sits over the same page gradient and no fill would
 * contrast with it. The taller bottom padding gives the curve room to bow in
 * without touching the content row.
 *
 * The clip alone barely shows (the two gradients differ only in opacity),
 * so a decorative SVG strokes the same curve. It's an open path: stroking a
 * closed one also draws the straight top and side edges.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div aria-hidden="true" className="header-bg absolute inset-0 bg-header-gradient" />
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id="header-curve-clip" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V1 Q0.5,0.82 0,1 Z" />
          </clipPath>
          {/* The mobile nav panel is ~3x the header's height, so the same
              visual curve depth is a shallower ratio of its box. */}
          <clipPath id="mobile-nav-curve-clip" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V1 Q0.5,0.94 0,1 Z" />
          </clipPath>
        </defs>
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="header-curve-line pointer-events-none absolute inset-0 block h-full w-full"
      >
        <path
          d="M0,100 Q100,82 200,100"
          fill="none"
          stroke="color-mix(in srgb, var(--color-on-header) 10%, transparent)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-space-2 px-space-2 pt-space-2 pb-space-4 sm:px-space-3">
        <Link
          href="/"
          className="min-w-0 rounded-sm focus-visible:outline-offset-4"
          aria-label="Christian Crawford — home"
        >
          <span className={`text-on-header ${textH4.replace("font-medium", "font-light")}`}>Christian Crawford</span>
        </Link>

        <div className="flex items-center gap-space-2">
          <Nav />
          <ColorPicker />
        </div>
      </div>
    </header>
  );
}
