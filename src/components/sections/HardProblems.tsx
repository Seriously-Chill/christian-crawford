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
          <h2 className={`text-ink ${textH2}`}>Simple is the hard part.</h2>
          <p className="mt-space-3 max-w-xl text-body lg:mt-space-4 text-ink/72">
            Most of my work starts messy: competing requirements, legacy systems, or a blank page.
            The job is finding the shape that makes it simple to use and simple to build on.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
