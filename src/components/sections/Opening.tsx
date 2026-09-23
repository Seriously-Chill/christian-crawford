import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { textDisplay } from "@/lib/type";

/**
 * Production form of the Design System's Hero pattern (display headline,
 * one tagline line, primary + secondary CTA side by side — see the
 * artifact's Hero/README) carrying the spec's "What I Build" positioning
 * instead of the source's marketing copy.
 *
 * Real layout, confirmed on every captured page, not just Home: the top
 * section is `min-height: calc(100vh - 100px)` — a near-full-viewport
 * hero, not a padded text block. `100px` was the source's own (taller)
 * header; `64px` is ours (see Header.tsx: space-2 padding + the 31px
 * logo mark).
 *
 * The real Home hero also stages in on load (motion.md's sitewide
 * entrance system) rather than appearing all at once: headline → tagline
 * → CTAs, ~150ms apart, over the real hero-tier 2000ms duration.
 * `playOnLoad` plays this even though the hero is already in the initial
 * viewport, which `RevealOnScroll`'s default scroll-triggered mode
 * wouldn't do.
 *
 * Text/button colors corrected to the real on-gradient treatment: the
 * hero sits directly on the page's gradient canvas (confirmed by
 * rendering, see globals.css), not a white background, so it needs
 * `on-header` (white) text and `bordered-inverse` for its secondary CTA
 * — matching the real Home hero's white headline/tagline and
 * white-bordered secondary button, not the dark, white-background
 * treatment this had before that correction.
 *
 * `bg-page-gradient` lives on this full-width outer `<section>`, not on
 * the `max-w-5xl` inner content — the gradient is defined 0%→100% across
 * whatever element carries it, so painting it on the narrower content
 * column would restart the blue→cyan interpolation at the column's own
 * edges instead of continuing the body's full-width gradient underneath,
 * producing a visible seam ("gradient on gradient") right at the margins.
 */
export function Opening() {
  return (
    <section className="relative overflow-hidden bg-page-gradient">
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[8%] sm:block">
        <HeroVisual variant="home" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100dvh-64px)] max-w-5xl flex-col justify-center px-space-3 py-space-6">
        <RevealOnScroll playOnLoad durationMs={2000} className="mb-space-4 sm:hidden">
          <HeroVisual variant="work" />
        </RevealOnScroll>
        <RevealOnScroll playOnLoad durationMs={2000}>
          <p className="text-label text-on-header/80 mb-space-3">Christian Crawford</p>
          <h1 className={`max-w-3xl text-on-header ${textDisplay}`}>
            I take on the systems that got complicated and make them work again.
          </h1>
        </RevealOnScroll>
        <RevealOnScroll playOnLoad durationMs={2000} delayMs={150}>
          <p className="mt-space-4 max-w-xl text-h5 text-on-header/80">
            I&apos;m a senior software engineer focused on frontend architecture. I work
            across product, design, and engineering to turn difficult requirements
            into systems people can understand, use, and evolve.
          </p>
        </RevealOnScroll>
        <RevealOnScroll playOnLoad durationMs={2000} delayMs={300}>
          <div className="mt-space-5 flex flex-wrap gap-space-2">
            <Button href="/work">See the work</Button>
            <Button href="/contact" variant="bordered-inverse">
              Get in touch
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
