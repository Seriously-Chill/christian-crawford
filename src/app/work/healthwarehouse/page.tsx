import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { PlatformDiagram } from "@/components/visuals/PlatformDiagram";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { textH2, textH4 } from "@/lib/type";

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

const evidence = [
  { value: "200+", label: "accessibility issues addressed across two platforms" },
  { value: "~50", label: "routes covered by automated accessibility testing" },
  { value: "~80", label: "routes covered by automated SEO regression testing" },
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
      <CurveDivider above="gradient-page" below="surface" />

      <CaseStudySection
        kicker="The problem"
        title="Real differences, no forks."
        body="I built the platform from the ground up. As it grew to serve more pharmacy brands, each brought its own requirements. The challenge: support those differences without splitting into separate apps."
      />

      <CaseStudySection
        id="architecture"
        kicker="Architecture"
        title="Keep the core shared; configure what differs."
        body="One shared Next.js and React codebase serves every brand."
      >
        <PlatformDiagram />
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

      <CaseStudySection id="evidence" kicker="Evidence" title="Quality checks across routes and real interactions.">
        <FeaturePanel>
          <div>
            <p className={`text-ink ${textH4}`}>Checked on every change, not audited once.</p>
            <p className="mt-space-3 text-body text-ink/72">
              Playwright and axe-core test real interactions, not just static pages. The SEO suite
              checks metadata, headings, structured data, and language attributes.
            </p>
          </div>
          <ul className="grid gap-space-4">
            {evidence.map((item) => (
              <li key={item.label}>
                <span className={`block text-accent ${textH2}`}>{item.value}</span>
                <span className="mt-1 block text-body text-ink/72">{item.label}</span>
              </li>
            ))}
          </ul>
        </FeaturePanel>
        <div className="mt-space-5">
          <h3 className={`text-ink ${textH4}`}>Critical patient workflows</h3>
          <div className="mt-space-3">
            <DetailGrid items={workflows} />
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
