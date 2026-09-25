import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { LineIcon } from "@/components/ui/LineIcon";
import { textH2 } from "@/lib/type";

// Each card links to where that claim is backed up, with its own link name
// so a screen-reader link list doesn't read four identical "More details".
const capabilities = [
  {
    icon: "layers" as const,
    title: "Architecture",
    body: "Shared foundations that serve different products and keep evolving.",
    href: "/work/healthwarehouse#architecture",
    link: "See the architecture",
  },
  {
    icon: "person" as const,
    title: "Product",
    body: "Real requirements, turned into experiences people trust.",
    href: "/work/healthwarehouse",
    link: "Read the case study",
  },
  {
    icon: "code" as const,
    title: "Frontend",
    body: "React, Next.js, GraphQL, and design systems built around the product.",
    href: "/work",
    link: "See the work",
  },
  {
    icon: "shield" as const,
    title: "Quality",
    body: "Accessibility, testing, and performance built into the work.",
    href: "/work/healthwarehouse#evidence",
    link: "See the evidence",
  },
];

/**
 * Home §3, "What I do" — restyled after the reference site's product-line
 * grid: four on-gradient glass cards, each led by a line icon and ending
 * in its own link through to the evidence, like the reference's
 * "More details".
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
            <EvidenceCard key={item.title} title={item.title} logo={<LineIcon name={item.icon} variant="badge" />} onGradient>
              <p>{item.body}</p>
              <div className="mt-space-3">
                <Button href={item.href} variant="bordered-inverse">
                  {item.link}
                </Button>
              </div>
            </EvidenceCard>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
