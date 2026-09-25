import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { textH2, textH4 } from "@/lib/type";

const progression = [
  "Design",
  "Multimedia",
  "Creative Management",
  "Software Development",
  "Consulting",
  "Architecture",
];

/**
 * `/work` §3–5. CBTS/Trivantis/Ginghamsburg deliberately isn't a third
 * generic card — that progression is part of the site's central idea, so it
 * gets its own compact visual (condensed from `/about`'s `CareerProgression`
 * timeline language) rather than a two-line blurb next to Ingage and Kroger.
 */
export function OtherWork() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <RevealOnScroll className="text-center">
          <h2 className={`text-ink ${textH2}`}>Other work.</h2>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100} className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
          <EvidenceCard
            title="Ingage Partners"
            tags={["React", "Angular", "JAMstack"]}
            logo={<EmployerLogo employer="ingage" className="[--logo-h:2rem]" />}
          >
            More than ten client engagements, from early-stage products to enterprise
            modernization, with integrations including Mapbox, AWS, and Contentful.
          </EvidenceCard>
          <EvidenceCard
            title="Kroger"
            tags={["React", "AngularJS", "Enterprise"]}
            logo={<EmployerLogo employer="kroger" className="[--logo-h:2rem]" />}
          >
            Frontend modernization for ClickList and internal applications: responsive interfaces
            on evolving enterprise systems.
          </EvidenceCard>
        </RevealOnScroll>

        <RevealOnScroll delayMs={200} className="mt-space-5">
          <h3 className={`text-ink ${textH4}`}>Earlier work</h3>
          <p className="mt-space-2 max-w-xl text-body text-ink/72">
            I started out building digital experiences at CBTS, Trivantis, and Ginghamsburg. That foundation still shapes how I work.
          </p>
          <div className="mt-space-3 flex flex-wrap items-center gap-x-space-4 gap-y-space-2 text-ink/60 [--logo-h:1.5rem]">
            <EmployerLogo employer="cbts" />
            <EmployerLogo employer="trivantis" />
            <EmployerLogo employer="ginghamsburg" />
          </div>
          <ol className="mt-space-4 flex flex-wrap items-center gap-x-space-1 gap-y-space-2">
            {progression.map((step, i) => (
              <li key={step} className="flex items-center gap-space-1">
                <span className="rounded-pill border border-ink/15 bg-ink/3 px-space-2 py-1 text-label text-ink/70">
                  {step}
                </span>
                {i < progression.length - 1 ? (
                  <span aria-hidden="true" className="text-ink/30">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </RevealOnScroll>
      </div>
    </section>
  );
}
