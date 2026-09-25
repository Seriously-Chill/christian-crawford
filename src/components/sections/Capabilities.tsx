import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { CapabilityVisual } from "@/components/visuals/CapabilityVisual";
import { textH2 } from "@/lib/type";

const capabilities = [
  { title: "Architecture", body: "Shared foundations that serve different products and keep evolving.", visual: "architecture" as const },
  { title: "Product", body: "Real requirements, turned into experiences people trust.", visual: "product" as const },
  { title: "Frontend", body: "React, Next.js, GraphQL, and design systems built around the product.", visual: "frontend" as const },
  { title: "Quality", body: "Accessibility, testing, and performance built into the work.", visual: "quality" as const },
];

/**
 * Home §3, "What I do" — restyled after the reference site's product-line
 * grid: on-gradient glass cards, each led by a large abstract mark rather
 * than four small white text-only cards.
 */
export function Capabilities() {
  return (
    <section className="bg-page-gradient">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <RevealOnScroll className="text-center">
          <h2 className={`text-on-header ${textH2}`}>What I do.</h2>
        </RevealOnScroll>
        <RevealOnScroll className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
          {capabilities.map((item) => (
            <EvidenceCard key={item.title} title={item.title} onGradient>
              <p>{item.body}</p>
              <div className="mt-space-4">
                <CapabilityVisual variant={item.visual} className="h-44 sm:h-56" />
              </div>
            </EvidenceCard>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
