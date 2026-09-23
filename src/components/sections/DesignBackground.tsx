import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

/**
 * Spec section 8: woven in as explanation, not a separate marketing claim.
 * Explicit `bg-surface` now that the page's default canvas is the gradient
 * (see globals.css) — this continues CareerProgression's white panel above
 * it seamlessly rather than reverting to the gradient between them.
 */
export function DesignBackground() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-6">
        <RevealOnScroll className="max-w-2xl space-y-space-3 text-body text-ink/72">
          <p>
            Design training leaves a specific habit: noticing the moment a product asks something
            of the person using it, before that moment ever reaches code. I still look for that
            moment first — it usually tells me more about the right architecture than the
            requirements doc does.
          </p>
          <p>
            Moving between design, product, UX, and engineering helps me see a problem from more
            than one angle. It also helps me work out where a solution should begin: with the
            interface, the architecture, or a clearer understanding of the need.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
