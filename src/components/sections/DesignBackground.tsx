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
            It&apos;s also why I rarely stay in one lane. Most of the interesting work happens at
            the point where product, design, and engineering are still negotiating what to build —
            and that&apos;s easier to navigate having sat in all three seats.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
