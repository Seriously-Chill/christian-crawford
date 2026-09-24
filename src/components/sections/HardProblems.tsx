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
          <h2 className={`text-ink ${textH2}`}>Some of what I&apos;ve built started from nothing.</h2>
          <p className="mt-space-3 max-w-xl text-body lg:mt-space-4 text-ink/72">
            A first website for an organization that had never had one. New applications for
            clients who didn&apos;t have one yet. That&apos;s blank-page work — figuring out the
            right shape before any of it exists.
          </p>
          <p className="mt-space-2 max-w-xl text-body text-ink/72">
            At HealthWarehouse, I built the React and Next.js platform from the ground up. Then
            came the other kind of work — architecting that system to support multiple pharmacy
            brands on a shared, configurable core.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
