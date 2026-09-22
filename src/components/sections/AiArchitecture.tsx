import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { textH2, textH4 } from "@/lib/type";

const practices = [
  "Repository contracts",
  "Decision logs",
  "Quality gates",
  "Validation of AI-generated changes",
];

/** Spec section 9: forward-looking, open-question framing — not a declared solution. */
export function AiArchitecture() {
  return (
    <section id="now" className="mx-auto max-w-5xl px-space-3 py-space-7">
      <RevealOnScroll>
        <p className="text-label text-primary">What I&apos;m thinking about now</p>
        <h1 className={`mt-space-2 max-w-2xl text-ink ${textH2}`}>
          If code gets easier to generate, what has to get harder to maintain?
        </h1>
      </RevealOnScroll>

      <RevealOnScroll delayMs={100} className="mt-space-4 max-w-2xl space-y-space-3 text-body text-ink/72">
        <p>
          The interesting question about AI-assisted development was never how to use it to
          write code faster. It&apos;s what happens to everything code used to force you to
          slow down for — architecture, testing, contracts, review — once generating the code
          itself stops being the bottleneck.
        </p>
        <p>
          This isn&apos;t a solved problem, and treating it like one would be dishonest. It&apos;s
          an open extension of the same question running through everything above: not how to
          build something, but how to keep it something people can trust and maintain once
          it&apos;s real.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delayMs={200} className="mt-space-5">
        <h2 className={`text-ink ${textH4}`}>Where that&apos;s landed in practice, so far</h2>
        <div className="mt-space-3">
          <DetailGrid items={practices} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
