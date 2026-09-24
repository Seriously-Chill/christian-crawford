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
  "Next.js / React architecture",
  "GraphQL integration",
  "State management",
  "Design system patterns",
  "Accessibility",
  "Automated testing",
  "SEO regression testing",
  "Product collaboration",
  "UX collaboration",
  "Backend collaboration",
  "Technical decision making",
  "AI-assisted engineering practices",
];

export default function HealthWarehousePage() {
  return (
    <>
      <PageIntro
        breadcrumb="HealthWarehouse"
        kicker="Case study"
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
        title="One platform. Multiple products."
        body="I built the HealthWarehouse platform from the ground up. It now supports multiple pharmacy brands, each with its own product requirements. The challenge was supporting real differences between those brands without splitting them into separate applications or duplicating the platform underneath them."
      />

      <CaseStudySection
        kicker="Architecture"
        title="Keep the core shared; configure what differs."
        body="As the platform grew to serve more brands, I architected it as one shared Next.js and React codebase, with configuration and feature flags carrying what's different between brands. Each brand gets room for its own requirements without forking the core."
      >
        <ArchitectureVisual alt="Illustration: three separate brand modules above a single shared platform base." />
        <div className="mt-space-3 grid gap-space-3 sm:grid-cols-3">
          <EvidenceCard title="Shared core">Shared infrastructure and patterns support every brand.</EvidenceCard>
          <EvidenceCard title="Configuration">
            Configuration carries product-specific behavior.
          </EvidenceCard>
          <EvidenceCard title="Feature flags">
            Feature flags control variation without splitting the codebase.
          </EvidenceCard>
        </div>
        <div className="mt-space-5">
          <h3 className={`text-ink ${textH4}`}>The architecture underneath it</h3>
          <div className="mt-space-3">
            <DetailGrid items={architectureStack} />
          </div>
        </div>
        <p className="mx-auto mt-space-5 max-w-xl text-center text-body text-ink/72">
          That same discipline extended into accessibility and quality — checked automatically on
          every change, not audited once and forgotten.
        </p>
      </CaseStudySection>

      <CaseStudySection kicker="Evidence" title="Quality checks across routes and real interactions.">
        <div className="grid gap-space-3 sm:grid-cols-3">
          <HighlightCard value="200+" label="accessibility issues addressed across two platforms" />
          <HighlightCard value="~50" label="routes covered by automated accessibility testing" />
          <HighlightCard value="~80" label="routes covered by automated SEO regression testing" />
        </div>
        <p className="mx-auto mt-space-5 max-w-xl text-center text-body text-ink/72">
          Playwright and axe-core checks cover roughly 50 routes and key flows, including checkout, prescriptions, forms, and mobile navigation. A separate SEO regression suite checks roughly 80 routes for metadata, headings, structured data, language attributes, and link accessibility.
        </p>
        <div className="mt-space-5 grid items-center gap-space-3 md:grid-cols-[3fr_2fr] md:gap-space-5">
          <div>
            <h3 className={`text-ink ${textH4}`}>Critical patient workflows</h3>
            <div className="mt-space-3">
              <DetailGrid items={workflows} />
            </div>
          </div>
          <div className="flex justify-center">
            <QualityVisual className="max-w-80" />
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection
        kicker="Product"
        title="Architecture that supports everyday patient tasks."
        body="The platform supports checkout, billing, prescriptions, and autoreorder. These workflows bring accessibility, performance, and healthcare requirements into the everyday experience of patients."
      />

      <CaseStudySection kicker="Result" title="A platform built to evolve.">
        <div className="grid gap-space-3 sm:grid-cols-3">
          <EvidenceCard title="Shared">One codebase.</EvidenceCard>
          <EvidenceCard title="Configurable">Different products without duplication.</EvidenceCard>
          <EvidenceCard title="Testable">Automated checks support ongoing quality.</EvidenceCard>
        </div>
      </CaseStudySection>

      <CaseStudySection kicker="Role" title="What I actually did">
        <DetailGrid items={role} />
      </CaseStudySection>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
