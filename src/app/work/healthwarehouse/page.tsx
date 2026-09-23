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
    "How a shared React and Next.js platform supports multiple pharmacy brands, alongside accessibility and quality improvements.",
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
        body="HealthWarehouse supports multiple pharmacy brands, each with its own product requirements. Building a separate application for every brand would duplicate shared work and make future changes harder to maintain. The challenge was to support meaningful differences without multiplying the platform underneath them."
      >
        <div className="flex justify-center">
          <ArchitectureVisual />
        </div>
      </CaseStudySection>

      <CaseStudySection
        kicker="Architecture"
        title="Keep the core shared; configure what differs."
        body="The platform keeps a shared Next.js and React codebase, using configuration and feature flags for brand-specific behavior. That gives each product room for its own requirements while preserving common infrastructure and patterns."
      >
        <div className="grid gap-space-3 sm:grid-cols-3">
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
        <div className="mt-space-5 grid items-center gap-space-5 sm:grid-cols-[2fr_1fr]">
          <div>
            <h3 className={`text-ink ${textH4}`}>Critical patient workflows</h3>
            <div className="mt-space-3">
              <DetailGrid items={workflows} />
            </div>
          </div>
          <div className="hidden justify-center sm:flex">
            <QualityVisual className="w-full max-w-40" />
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
