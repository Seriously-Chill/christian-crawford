import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

/** Spec section 8: woven in as explanation, not a separate marketing claim. */
export function DesignBackground() {
  return (
    <section className="mx-auto max-w-5xl px-space-3 py-space-6">
      <RevealOnScroll className="max-w-2xl space-y-space-3 text-body text-ink/72">
        <p>
          Starting in design isn&apos;t a footnote to the engineering that came after — it&apos;s
          part of how the engineering works. Visual design, interaction, and multimedia all
          train the same habit an architecture decision needs later: noticing what the person
          on the other end of the system actually experiences, not just what the code does.
        </p>
        <p>
          That&apos;s why the useful unit here has never been a single framework. It&apos;s the
          ability to move between product, UX, design, and engineering on the same problem —
          and to know which of those disciplines it actually needs first.
        </p>
      </RevealOnScroll>
    </section>
  );
}
