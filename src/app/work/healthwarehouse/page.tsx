import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { PlatformDiagram } from "@/components/visuals/PlatformDiagram";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { textH2, textH4, textH5 } from "@/lib/type";

export const metadata: Metadata = {
  title: "HealthWarehouse",
  description:
    "Building a React and Next.js pharmacy platform from the ground up, then architecting it to support multiple brands on a shared, configurable core — alongside accessibility and quality improvements.",
};

const architectureStack = [
  "Next.js App Router",
  "React",
  "GraphQL + Apollo Client",
  "Zustand",
  "MUI + Emotion",
  "NextAuth",
  "Formik + Yup",
  "Playwright + axe-core",
  "Configuration-driven",
  "Feature flags",
];

// The decision behind the architecture, told without internal names or code.
const decision = [
  {
    title: "What I ruled out",
    body: "A runtime brand switch: each brand is fixed when it's built, so switching at runtime only adds cost. And filename-based overrides: more powerful, but harder to follow than one explicit list.",
  },
  {
    title: "What an audit caught",
    body: "Per-brand files that had drifted into byte-identical copies. They collapsed back into one shared component and a single config value.",
  },
  {
    title: "What it made possible",
    body: "A third brand with its own fonts, colors, and corner radii, while the other two rendered byte-for-byte unchanged, with zero axe violations.",
  },
];

const evidence = [
  { value: "WCAG 2.2", label: "accessibility seal achieved" },
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

// Taken from the résumé, each led by what the work actually was.
const role = [
  { verb: "Led", text: "frontend architecture for the white-label pharmacy platform." },
  { verb: "Chose", text: "to keep one shared codebase rather than split brands into separate apps." },
  {
    verb: "Established",
    text: "architecture conventions for the App Router, React, GraphQL, Zustand, and MUI, including clear server/client boundaries.",
  },
  {
    verb: "Led",
    text: "accessibility work across two pharmacy platforms: 200+ issues addressed and a WCAG 2.2 accessibility seal.",
  },
  {
    verb: "Established",
    text: "automated accessibility coverage with Playwright and axe-core across ~50 routes and five browser/device profiles, plus SEO regression testing across ~80.",
  },
  { verb: "Owned", text: "frontend work on checkout, billing, and other critical patient workflows." },
  {
    verb: "Designed",
    text: "governance for AI-assisted development: repository contracts, decision logs, lifecycle hooks, and approval checkpoints.",
  },
  {
    verb: "Worked",
    text: "across design, product, backend engineering, and leadership to turn ambiguous requirements into technical decisions.",
  },
];

export default function HealthWarehousePage() {
  return (
    <>
      <PageIntro
        breadcrumb="HealthWarehouse"
        kicker="Case study"
        logo={<EmployerLogo employer="healthwarehouse" labelled className="[--logo-h:2.25rem]" />}
        title="One platform for three pharmacy brands."
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
        body="I built the platform from the ground up. As it grew to serve three pharmacy brands, each brought its own requirements. The challenge: support those differences without splitting into separate apps."
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
          The same discipline applies to quality: checked by automated suites, not
          audited once and forgotten.
        </p>
      </CaseStudySection>

      <CaseStudySection
        kicker="The key decision"
        title="Fork at the smallest unit."
        body="When brands diverge, the easy move is to copy the page and change it. That's how codebases split. The rule instead: brand configuration holds only data (colors, copy, flags), and anything that truly differs lives in the smallest possible per-brand component, chosen when each brand is built."
      >
        <div className="grid gap-space-3 sm:grid-cols-3">
          {decision.map((item) => (
            <EvidenceCard key={item.title} title={item.title}>
              {item.body}
            </EvidenceCard>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="evidence" kicker="Evidence" title="Quality checks across routes and real interactions.">
        <FeaturePanel>
          <div>
            <p className={`text-ink ${textH4}`}>Checked by tests, not audited once.</p>
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
        <ul className="grid gap-space-2 sm:grid-cols-2">
          {role.map((item) => (
            <li key={item.text} className="rounded-lg bg-surface-raised p-space-2 sm:p-space-3">
              <span className={`block text-accent ${textH5}`}>{item.verb}</span>
              <span className="mt-1 block text-body text-ink/72">{item.text}</span>
            </li>
          ))}
        </ul>
      </CaseStudySection>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
