import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { HighlightCard } from "@/components/ui/HighlightCard";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { textH2, textH4 } from "@/lib/type";

const workflows = [
  "Checkout",
  "Billing",
  "Patient management",
  "Prescriptions",
  "Autoreorder",
  "Search",
  "Forms",
  "Mobile navigation",
];

export function Complexity() {
  return (
    <section id="complexity" className="mx-auto max-w-5xl px-space-3 py-space-7">
      <RevealOnScroll>
        <h2 className={`max-w-2xl text-ink ${textH2}`}>
          Complex systems don&apos;t have to feel complicated.
        </h2>
        <p className="mt-space-3 max-w-xl text-body text-ink/72">
          The evidence for that isn&apos;t a claim about process. It&apos;s what actually shipped
          on a real healthcare platform.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delayMs={100} className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
        <EvidenceCard title="One codebase, multiple brands">
          A Next.js/React white-label pharmacy platform serves several brands from one shared
          codebase. Configuration and feature flags carry the differences between them — not
          separate applications duplicating the same infrastructure.
        </EvidenceCard>
        <EvidenceCard title="Accessibility, tested automatically">
          200+ accessibility issues addressed across two pharmacy platforms, leading to a
          WCAG 2.2 accessibility seal — backed by automated Playwright/axe-core testing, not a
          one-time audit.
        </EvidenceCard>
      </RevealOnScroll>

      <RevealOnScroll delayMs={200} className="mt-space-4 grid gap-space-3 sm:grid-cols-3">
        <HighlightCard value="200+" label="accessibility issues addressed across two platforms" />
        <HighlightCard value="~50" label="routes covered by automated accessibility testing" />
        <HighlightCard value="~80" label="routes covered by automated SEO regression testing" />
      </RevealOnScroll>

      <RevealOnScroll delayMs={300} className="mt-space-5">
        <h3 className={`text-ink ${textH4}`}>The workflows that had to hold up</h3>
        <p className="mt-space-2 max-w-xl text-body text-ink/72">
          Every one of these is a real interaction flow the automated accessibility suite
          exercises directly, on a platform where reliability isn&apos;t optional.
        </p>
        <div className="mt-space-3">
          <DetailGrid items={workflows} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
