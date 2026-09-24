import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { LogoMark } from "@/components/ui/LogoMark";
import { ColorPicker } from "@/components/ui/ColorPicker";

/**
 * Real DS behavior preserved: the header's own gradient (bg-header-gradient,
 * the exact 90deg/~90%-opacity stops from motion.md/Header README), the
 * white/on-header wordmark treatment, and the sticky positioning. The nav
 * itself — six real routes, exact order/label, mobile collapse — lives in
 * `Nav` (a Client Component; it needs the current pathname for the active
 * state and open/close state for the mobile panel). Everything else here
 * stays a Server Component.
 *
 * The bottom edge's shallow "upward bow" (bends up into the header at the
 * center, confirmed direction) is a `clip-path` on its own background
 * layer — not on `<header>` itself, and not a separate color-matched
 * overlay strip either. An overlay strip couldn't work here specifically:
 * the header's gradient sits over the identical page gradient beneath it
 * (same tokens, just different opacity), so no overlay fill color would
 * ever contrast enough to read as a curve. Clipping `<header>`'s own box
 * sidesteps the color-matching problem, but clips *everything* painted
 * within it — including `ColorPicker`'s popover and `Nav`'s mobile panel,
 * both of which render outside the header's own box on purpose. Splitting
 * the clipped gradient into its own `inset-0` background div, as a sibling
 * of the real (unclipped) content row, keeps the curve without capping
 * anything that needs to overflow it. `clipPathUnits="objectBoundingBox"`
 * keeps the curve's proportions (not its pixel depth) responsive to the
 * background layer's own rendered size. The content row's taller bottom
 * padding (`pb-space-4` vs `pt-space-2`) is what gives the pinch room to
 * curve into without ever touching the logo/nav row itself.
 *
 * The clip alone isn't enough to *see*, though — it only changes where the
 * header's gradient stops painting, and that gradient is so close in
 * color to the page gradient behind it (same tokens, ~90% vs 100%
 * opacity) that the notch reads as barely-there even magnified 3x. A
 * second, purely decorative SVG traces the identical curve as a visible
 * stroke line, so the shape itself is legible regardless of how much the
 * fill actually contrasts with what's behind it. It's an *open* path (no
 * closing edges) specifically so stroking it doesn't also draw a straight
 * line across the top/sides — `stroke` traces a path's whole perimeter,
 * which is exactly the bug an earlier, closed-path version of this hit.
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
          className="flex min-w-0 items-center gap-[10px] rounded-sm focus-visible:outline-offset-4"
          aria-label="Christian Crawford — home"
        >
          <LogoMark className="h-9 w-auto shrink-0 text-on-header" />
          <span className="truncate text-sm text-on-header sm:text-label">Christian Crawford</span>
        </Link>

        <div className="flex items-center gap-space-2">
          <Nav />
          <ColorPicker />
        </div>
      </div>
    </header>
  );
}
