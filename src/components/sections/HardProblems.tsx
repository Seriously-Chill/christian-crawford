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
          <h2 className={`text-ink ${textH2}`}>
            Some problems start on a blank page. Others start in the middle of someone else&apos;s
            decisions.
          </h2>
          <p className="mt-space-3 max-w-xl text-body text-ink/72">
            I like both. A new product means figuring out the right shape before any of it exists.
            An existing one means understanding why it got complicated before I touch anything.
          </p>
          <p className="mt-space-2 max-w-xl text-body text-ink/72">
            Either way, the work is the same: connect product, design, and engineering into
            something people can actually use.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
