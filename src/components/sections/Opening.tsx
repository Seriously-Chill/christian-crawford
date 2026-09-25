import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { LineIcon } from "@/components/ui/LineIcon";
import { RESUME_PDF } from "@/lib/links";
import { textDisplay } from "@/lib/type";

// What the current role actually covers, in the About page's own words:
// sentences rather than loose figures, which read as résumé filler here.
const now = [
  "Leading frontend architecture for healthcare products",
  "A configurable pharmacy platform in Next.js, React, and GraphQL",
  "Accessibility, automated testing, and standards for AI-assisted development",
];

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
 * → CTAs, each its own `RevealOnScroll` so they stagger in that order
 * as the page arrives.
 *
 * Text/button colors corrected to the real on-gradient treatment: the
 * hero sits directly on the page's gradient canvas (confirmed by
 * rendering, see globals.css), not a white background, so it needs
 * `on-header` text and `bordered-inverse` for its secondary CTA
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
      <div className="relative mx-auto grid min-h-[calc(100dvh-64px)] max-w-5xl content-center gap-space-6 px-space-3 py-space-6 md:grid-cols-[3fr_2fr] md:items-center md:gap-space-5">
        <div>
          <RevealOnScroll>
            <h1 className={`max-w-[11em] text-on-header ${textDisplay}`}>
              I make complicated software simple.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll>
            <p className="mt-space-4 max-w-xl text-h5 lg:mt-space-5 text-on-header/80">
              I&apos;m a senior software engineer focused on frontend architecture. I turn
              messy requirements into systems people can use and build on.
            </p>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="mt-space-5 flex flex-wrap gap-space-2">
              <Button href="/work">See the work</Button>
              <Button href="/contact" variant="bordered-inverse">
                Get in touch
              </Button>
            </div>
            <p className="mt-space-3 text-body text-on-header/80">
              Open to senior frontend and frontend architecture roles: remote, or hybrid in
              Cincinnati.
            </p>
            <a
              href={RESUME_PDF}
              className="mt-space-2 inline-flex items-center gap-space-1 py-1 text-body text-on-header underline-offset-4 hover:underline focus-visible:underline"
            >
              <LineIcon name="download" />
              Download résumé (PDF)
            </a>
          </RevealOnScroll>
        </div>
        <RevealOnScroll>
          <div className="rounded-xl border border-on-header/10 bg-on-header/10 p-space-3 sm:p-space-4">
            <p className="text-label text-on-header/80">Now</p>
            <div className="mt-space-2 flex text-on-header [--logo-h:1.75rem]">
              <EmployerLogo employer="healthwarehouse" labelled />
            </div>
            <p className="mt-space-2 text-body text-on-header">Senior Software Engineer</p>
            <ul className="mt-space-3 space-y-space-2 border-t border-on-header/15 pt-space-3">
              {now.map((item) => (
                <li key={item} className="flex gap-space-2 text-body text-on-header">
                  <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-circle bg-on-header/60" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-space-3 border-t border-on-header/15 pt-space-3 text-body text-on-header/80">
              Twenty years of experience, from design and consulting to enterprise UI at Ingage,
              Kroger, CBTS, and Trivantis.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
