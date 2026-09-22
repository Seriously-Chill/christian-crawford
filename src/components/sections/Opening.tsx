import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textDisplay } from "@/lib/type";

/**
 * Production form of the Design System's Hero pattern (display headline,
 * one tagline line, primary + secondary CTA side by side — see the
 * artifact's Hero/README) carrying the spec's "What I Build" positioning
 * instead of the source's marketing copy. Generous vertical padding via
 * space-7 (80px) — the token's own usage note calls it out for exactly
 * this: "used sparingly between hero-scale sections."
 *
 * The real Home hero stages in on load (motion.md's sitewide entrance
 * system) rather than appearing all at once: headline → tagline → CTAs,
 * ~150ms apart, over the real hero-tier 2000ms duration. `playOnLoad`
 * plays this even though the hero is already in the initial viewport,
 * which `RevealOnScroll`'s default scroll-triggered mode wouldn't do.
 */
export function Opening() {
  return (
    <section className="mx-auto max-w-5xl px-space-3 py-space-7">
      <RevealOnScroll playOnLoad durationMs={2000}>
        <p className="text-label text-primary mb-space-3">Christian Crawford</p>
        <h1 className={`max-w-3xl text-ink ${textDisplay}`}>
          Frontend architecture. Complex product systems.
        </h1>
      </RevealOnScroll>
      <RevealOnScroll playOnLoad durationMs={2000} delayMs={150}>
        <p className="mt-space-4 max-w-xl text-h5 text-ink/72">
          I build things from scratch. I also spend a lot of time figuring out
          why existing systems got complicated in the first place — and how to
          make them simpler for the people who have to work with them.
        </p>
      </RevealOnScroll>
      <RevealOnScroll playOnLoad durationMs={2000} delayMs={300}>
        <div className="mt-space-5 flex flex-wrap gap-space-2">
          <Button href="/work">See the work</Button>
          <Button href="/contact" variant="bordered">
            Get in touch
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  );
}
