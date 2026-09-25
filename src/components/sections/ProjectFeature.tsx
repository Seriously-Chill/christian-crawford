import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { textH2 } from "@/lib/type";

const content = {
  compact: {
    headline: "One platform. Different pharmacy brands.",
    body: "Each brand gets what it needs from one shared React and Next.js codebase. Configuration and feature flags handle the differences.",
    tags: ["Next.js", "React", "GraphQL", "Zustand", "MUI"],
    cta: "View the case study",
  },
  full: {
    headline: "One pharmacy platform. Many brands.",
    body: "I built it from the ground up in React and Next.js, then shaped it to serve multiple brands from one shared core.",
    tags: ["Architecture", "React", "Next.js", "GraphQL", "Accessibility"],
    cta: "Explore the case study",
  },
};

/**
 * The featured-HealthWarehouse composition — shared by Home §4 and `/work`
 * §2, where it should carry the strongest visual emphasis on the page.
 * `compact` swaps in Home's shorter headline/copy for the teaser context;
 * the layout and visual weight stay the same either way.
 */
export function ProjectFeature({ compact = false }: { compact?: boolean }) {
  const { headline, body, tags, cta } = content[compact ? "compact" : "full"];

  return (
    <section className="bg-page-gradient">
      <div className="mx-auto grid max-w-5xl items-center gap-space-5 px-space-3 py-space-7 sm:grid-cols-[3fr_2fr]">
        <RevealOnScroll>
          <div className="flex">
            <EmployerLogo employer="healthwarehouse" labelled className="text-on-header [--logo-h:2rem]" />
          </div>
          <h2 className={`mt-space-2 max-w-xl text-on-header lg:mt-space-3 ${textH2}`}>{headline}</h2>
          <p className="mt-space-3 max-w-md text-body lg:mt-space-4 text-on-header/80">{body}</p>
          <Tags items={tags} onGradient />
          <div className="mt-space-4">
            <Button href="/work/healthwarehouse" variant="bordered-inverse">
              {cta}
            </Button>
          </div>
        </RevealOnScroll>
        <RevealOnScroll
          delayMs={100}
          className="flex w-full max-w-sm items-center justify-center justify-self-center rounded-lg border border-on-header/10 bg-on-header/10 p-space-3 sm:max-w-none sm:p-space-4"
        >
          <HeroVisual variant="feature" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
