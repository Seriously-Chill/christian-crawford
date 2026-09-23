import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH2 } from "@/lib/type";

/**
 * Home §2. Deliberately sparse per the brief — no visual here; the
 * complexity→structure visual language lives in the hero and on /contact.
 */
export function HardProblems() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <RevealOnScroll>
          <h2 className={`text-ink ${textH2}`}>The harder the problem, the more useful clear thinking becomes.</h2>
          <p className="mt-space-3 max-w-xl text-body text-ink/72">
            I&apos;m at my best when a product has outgrown its original shape: requirements are
            tangled, the code is harder to change, and teams need a way forward that works for
            both the product and the people building it.
          </p>
          <p className="mt-space-2 max-w-xl text-body text-ink/72">
            I help make the next step clearer — and the system behind it easier to live with.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
