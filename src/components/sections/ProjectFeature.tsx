import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { textH2 } from "@/lib/type";

const content = {
  compact: {
    headline: "One platform. Different pharmacy brands.",
    body: "A shared React and Next.js platform uses configuration to support each brand without duplicating the core system.",
    tags: ["Next.js", "React", "GraphQL", "Zustand", "MUI"],
    cta: "View the case study",
  },
  full: {
    headline: "One pharmacy platform, built to support more than one product.",
    body: "At HealthWarehouse, I helped shape a shared React and Next.js platform for multiple pharmacy brands. Configuration and feature flags handle what differs; the core stays shared.",
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
          <p className="text-label text-on-header/80">HealthWarehouse</p>
          <h2 className={`mt-space-2 max-w-xl text-on-header ${textH2}`}>{headline}</h2>
          <p className="mt-space-3 max-w-md text-body text-on-header/80">{body}</p>
          <Tags items={tags} onGradient />
          <div className="mt-space-4">
            <Button href="/work/healthwarehouse" variant="bordered-inverse">
              {cta}
            </Button>
          </div>
        </RevealOnScroll>
        <RevealOnScroll
          delayMs={100}
          className="flex items-center justify-center justify-self-center rounded-lg border border-on-header/10 bg-on-header/10 p-space-4"
        >
          <HeroVisual variant="work" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
