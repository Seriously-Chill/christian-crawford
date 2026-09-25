import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { textH2, textH3 } from "@/lib/type";

// Why the case study is worth opening: what the architecture achieved, all
// taken from the case study itself. How it's layered is left to its diagram.
const outcomes = [
  { value: "No forks", label: "Every brand runs on one shared codebase instead of its own copy." },
  { value: "~50 routes", label: "covered by automated accessibility tests on every change." },
  { value: "200+", label: "accessibility issues addressed across two platforms." },
];

/**
 * The featured-HealthWarehouse teaser on Home. It sits on white in the
 * reference's contained feature panel, deliberately off the gradient the
 * "What I do" cards use, so the one featured project reads as its own
 * moment rather than a fifth card. The copy leads with the problem (brands
 * pulling the product apart) and the right column with the outcomes, so it
 * says why the case study is worth reading. `/work` presents the same
 * project in its alternating rows (ProjectRows).
 */
export function ProjectFeature() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 pt-space-7">
        <RevealOnScroll>
          <FeaturePanel>
            <div>
              <div className="flex text-ink/60">
                <EmployerLogo employer="healthwarehouse" labelled className="[--logo-h:2rem]" />
              </div>
              <p className="mt-space-2 text-label text-accent">Case study</p>
              <h2 className={`mt-space-2 max-w-xl text-accent ${textH2}`}>
                Three pharmacy brands. One codebase. No forks.
              </h2>
              <p className="mt-space-3 max-w-md text-body lg:mt-space-4 text-ink/72">
                Every new brand brought requirements of its own: the kind that usually splits a
                product into separate apps. I built the platform from the ground up so they all run
                on one shared core, with configuration and feature flags carrying the differences.
              </p>
              <Tags items={["Next.js", "React", "GraphQL", "Zustand", "MUI"]} />
              <div className="mt-space-4">
                <Button href="/work/healthwarehouse" variant="bordered">
                  Read the case study
                </Button>
              </div>
            </div>
            <ul aria-label="What it achieved" className="space-y-space-2">
              {outcomes.map((item) => (
                <li key={item.value} className="rounded-lg border border-ink/10 bg-surface p-space-2 sm:p-space-3">
                  <p className={`text-accent ${textH3}`}>{item.value}</p>
                  <p className="mt-1 text-body text-ink/72">{item.label}</p>
                </li>
              ))}
            </ul>
          </FeaturePanel>
        </RevealOnScroll>
      </div>
    </section>
  );
}
