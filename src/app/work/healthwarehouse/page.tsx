import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { HighlightCard } from "@/components/ui/HighlightCard";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { ArchitectureVisual } from "@/components/visuals/ArchitectureVisual";
import { QualityVisual } from "@/components/visuals/QualityVisual";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { textH4 } from "@/lib/type";

export const metadata: Metadata = {
  title: "HealthWarehouse",
  description:
    "Building a React and Next.js pharmacy platform from the ground up, then architecting it to support multiple brands on a shared, configurable core — alongside accessibility and quality improvements.",
};

const architectureStack = [
  "Next.js App Router",
  "React",
  "GraphQL",
  "Zustand",
  "MUI",
  "Configuration-driven",
  "Feature flags",
  "Accessibility",
];

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

const role = [
  "Ground-up platform build",
  "Frontend architecture",
  "Design system patterns",
  "Accessibility and automated testing",
  "Cross-team technical decisions",
  "AI-assisted engineering practices",
];

export default function HealthWarehousePage() {
  return (
    <>
      <PageIntro
        breadcrumb="HealthWarehouse"
        kicker="Case study"
        logo={<EmployerLogo employer="healthwarehouse" labelled className="[--logo-h:2.25rem]" />}
        title="One platform for multiple pharmacy brands."
        meta={[
          { label: "Role", value: "Senior Software Engineer" },
          { label: "Focus", value: "Architecture · Frontend · Accessibility · Product" },
          { label: "Stack", value: "Next.js · React · GraphQL · Zustand · MUI" },
        ]}
      />
      <div className="bg-page-gradient">
        <div className="mx-auto flex max-w-5xl justify-center px-space-3 pb-space-6">
          <HeroVisual variant="case-study" />
        </div>
      </div>
      <CurveDivider above="gradient-page" below="surface" />

      <CaseStudySection
        kicker="The problem"
        title="Real differences, no forks."
        body="I built the platform from the ground up. As it grew to serve more pharmacy brands, each brought its own requirements. The challenge: support those differences without splitting into separate apps."
      />

      <CaseStudySection
        kicker="Architecture"
        title="Keep the core shared; configure what differs."
        body="One shared Next.js and React codebase serves every brand."
      >
        <ArchitectureVisual alt="A carved wooden box representing the shared platform." />
        <div className="mt-space-3 grid gap-space-3 sm:grid-cols-3">
          <EvidenceCard title="Shared core">Infrastructure and patterns every brand uses.</EvidenceCard>
          <EvidenceCard title="Configuration">Carries each brand&apos;s own behavior.</EvidenceCard>
          <EvidenceCard title="Feature flags">Turn variation on and off without splitting the code.</EvidenceCard>
        </div>
        <div className="mt-space-5">
          <h3 className={`text-ink ${textH4}`}>The architecture underneath it</h3>
          <div className="mt-space-3">
            <DetailGrid items={architectureStack} />
          </div>
        </div>
        <p className="mx-auto mt-space-5 max-w-xl text-center text-body text-ink/72">
          The same discipline applies to quality: checked automatically on every change, not
          audited once and forgotten.
        </p>
      </CaseStudySection>

      <CaseStudySection kicker="Evidence" title="Quality checks across routes and real interactions.">
        <div className="grid gap-space-3 sm:grid-cols-3">
          <HighlightCard value="200+" label="accessibility issues addressed across two platforms" />
          <HighlightCard value="~50" label="routes covered by automated accessibility testing" />
          <HighlightCard value="~80" label="routes covered by automated SEO regression testing" />
        </div>
        <p className="mx-auto mt-space-5 max-w-xl text-center text-body text-ink/72">
          Playwright and axe-core test real interactions, not just static pages. The SEO suite checks metadata, headings, structured data, and language attributes.
        </p>
        <div className="mt-space-5 grid items-center gap-space-3 md:grid-cols-[3fr_2fr] md:gap-space-5">
          <div>
            <h3 className={`text-ink ${textH4}`}>Critical patient workflows</h3>
            <div className="mt-space-3">
              <DetailGrid items={workflows} />
            </div>
          </div>
          <div className="flex justify-center">
            <QualityVisual className="max-w-sm" />
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection kicker="Role" title="What I actually did">
        <DetailGrid items={role} />
      </CaseStudySection>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
