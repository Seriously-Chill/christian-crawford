import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { DifferenceRouting } from "@/components/visuals/DifferenceRouting";
import { DialogFixExample } from "@/components/visuals/DialogFixExample";
import { MenuAnnouncementExample } from "@/components/visuals/MenuAnnouncementExample";
import { BrandScreens } from "@/components/visuals/BrandScreens";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { textH2, textH4, textH5 } from "@/lib/type";

export const metadata: Metadata = {
  title: "HealthWarehouse",
  description:
    "How one team-built pharmacy platform serves three brands from one codebase: the rule that keeps brand differences small, where it bent, how PharmcoRx tested it, and the accessibility work checked alongside it.",
};

// Everything on this page comes from the platform's repository: its three
// brand configs, its decision log, its measured baselines, and the fixes'
// own commits. Brand one is HealthWarehouse, two SpringMeds, three PharmcoRx.

// Read from the three brand configs.
// What the work changed for the platform and the team, each backed by a
// section further down.
const changed = [
  {
    title: "A rule the team builds by",
    body: "The other engineers follow the smallest-unit rule when they add a brand difference. It's how the platform grows, not just how I built it.",
  },
  {
    title: "A new brand is a config file",
    body: "PharmcoRx joined without a structural change, instead of starting as a copy of another brand's app.",
  },
  {
    title: "A redesign stays in its brand",
    body: "PharmcoRx got its own typefaces, header, footer, and homepage. Measured against a baseline, the other two brands came out unchanged.",
  },
];

const differences = [
  { label: "Typefaces", cells: ["Montserrat", "Montserrat", "Inter and Hepta Slab"] },
  { label: "Corners", cells: ["8px", "8px", "16px cards, pill buttons"] },
  { label: "Feature flags on", cells: ["14 of 18", "3 of 18", "4 of 18"] },
  { label: "Legal copy", cells: ["Shared", "Its own", "Shared"] },
];

const how = [
  {
    title: "Picked when a brand is built",
    body: "Each brand is fixed at build time, for config and components alike. Nothing switches brands while the app runs.",
  },
  {
    title: "Kept honest by audit",
    body: "When I audited the per-brand files, two had drifted into byte-identical copies and a third differed by one value. They collapsed into one shared component and a config string.",
  },
];

const boundaries = [
  {
    title: "Four forks are whole components",
    body: "Of the seven per-brand components, four are large: the header, footer, homepage layout, and logo. PharmcoRx's design changed their structure, not just their values. To keep that fork to markup, I moved the header's behavior into a hook both headers share.",
  },
  {
    title: "Every build carries every version",
    body: "The helper that picks a brand's component imports all of its versions, so each brand ships the others' code. Resolving by filename at build time would drop them. I deferred it: more build setup than a handful of small components justified then. It's the next step now that headers fork.",
  },
  {
    title: "Fonts one brand uses",
    body: "PharmcoRx adds about 116 KB of fonts. HealthWarehouse and SpringMeds carry about 3 KB of font CSS they never use, because the font loader can't branch on the brand. Measured, and too small to fix yet.",
  },
  {
    title: "One build per brand",
    body: "Build-time brands keep runtime simple, but each brand is its own build and deploy. A stale build can pass for the wrong brand: one measurement ran against one, and checking the page title caught it.",
  },
];

const phases = ["Baseline", "Design system", "Header and footer", "Homepage", "Interior pages", "Content", "Re-measure"];

// From the rollout's decision log and its baseline captures (September 2026).
const results = [
  {
    label: "Theme",
    cells: ["Reproduces the previous theme exactly", "Its own typefaces, corners, and colors"],
  },
  {
    label: "Header, footer, logo",
    cells: [
      "Footer and logo code moved over byte-for-byte. The header's behavior moved into the shared hook, then sign-in, the mini-cart, and sign-out were exercised on running builds.",
      "Its own versions, on the same hook",
    ],
  },
  {
    label: "axe-core: 42 routes, 5 browser and device profiles",
    cells: ["210 of 210 scans clean on HealthWarehouse. SpringMeds wasn't re-scanned.", "210 of 210 scans clean"],
  },
  {
    label: "Lighthouse: 6 routes, desktop and mobile",
    cells: ["No change beyond run-to-run noise", "Meets its targets, except mobile homepage load"],
  },
];

const checks = [
  { value: "42", label: "routes scanned by axe-core, in five browser and device profiles" },
  { value: "210 / 210", label: "scans clean in the last recorded run, September 2026" },
  { value: "83", label: "routes in the SEO regression suite" },
];

const next = [
  {
    title: "Gate the suites",
    body: "Run the accessibility suites in CI, and make the route script fail when a scan does.",
  },
  {
    title: "Cover every brand",
    body: "SpringMeds has no accessibility script of its own yet.",
  },
  {
    title: "Ship each brand only its own code",
    body: "Resolve per-brand components by filename at build time, the step deferred above.",
  },
  {
    title: "Fix the landmarks",
    body: "The header and footer sit inside the main content area, so no brand exposes them as banner and footer landmarks. Found while adding tests; left for its own change.",
  },
];

// From the repository's history. Most of this was shared work; each line is
// the part that was mine.
const role = [
  { verb: "Built", text: "the brand system: the configs and the per-brand component helper." },
  { verb: "Established", text: "the smallest-unit rule, which the team now follows when adding brand differences." },
  { verb: "Ran", text: "PharmcoRx's redesign in seven measured phases." },
  { verb: "Moved", text: "the app from the Pages Router to the App Router." },
  { verb: "Wrote", text: "the Playwright and axe-core suites: routes, interaction flows, keyboard, and SEO." },
  {
    verb: "Fixed",
    text: "most of the accessibility issues audits found; the form-error announcements were shared work with two teammates.",
  },
  { verb: "Did", text: "most of the frontend work on checkout and payments." },
  {
    verb: "Designed",
    text: "governance for AI-assisted development: repository contracts, decision logs, lifecycle hooks, and approval checkpoints.",
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
        tagline="A team-built React and Next.js pharmacy platform. I've been one of its engineers since November 2023: I built its multi-brand system, made most of its accessibility fixes, and wrote its Playwright test suites."
        meta={[
          { label: "Role", value: "Senior Software Engineer" },
          { label: "Since", value: "November 2023" },
          { label: "Focus", value: "Architecture · Frontend · Accessibility" },
          { label: "Stack", value: "Next.js · React · GraphQL · Zustand · MUI" },
        ]}
      />
      <CurveDivider above="gradient-page" below="surface" />

      <CaseStudySection kicker="What changed" title="Three brands that stay one platform.">
        <BrandScreens />
        <div className="mt-space-6 grid gap-space-3 sm:grid-cols-3">
          {changed.map((item) => (
            <EvidenceCard key={item.title} title={item.title}>
              {item.body}
            </EvidenceCard>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        kicker="The problem"
        title="Three brands, different in real ways."
        body="Each brand has its own colors, typefaces, corners, features, and legal copy. The easy way to handle that is to copy a page and change it. Do that often enough and you have three apps."
      >
        <ComparisonTable
          label="How the three brands differ"
          columns={["", "HealthWarehouse", "SpringMeds", "PharmcoRx"]}
          columnsClass="sm:grid-cols-[9rem_1fr_1fr_1fr]"
          rows={differences}
        />
      </CaseStudySection>

      <CaseStudySection
        id="architecture"
        kicker="The rule"
        title="Fork at the smallest unit."
        body="A difference between brands goes to the smallest place that can hold it. Config holds data only. Anything that truly differs lives in the smallest per-brand component that can carry it."
      >
        <DifferenceRouting />
        <div className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
          {how.map((item) => (
            <EvidenceCard key={item.title} title={item.title}>
              {item.body}
            </EvidenceCard>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        kicker="Where it bent"
        title="The rule had boundaries."
        body="PharmcoRx needed more than small forks could carry. These are the costs I accepted, and why."
      >
        <div className="grid gap-space-3 sm:grid-cols-2">
          {boundaries.map((item) => (
            <EvidenceCard key={item.title} title={item.title}>
              {item.body}
            </EvidenceCard>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        kicker="The test"
        title="PharmcoRx was the test."
        body="It arrived in June 2026 as a config file, env files, and build scripts, with no structural change. Its redesign in September needed its own typefaces, corners, header, footer, and homepage, and the other two brands had to come out unchanged."
      >
        <ol aria-label="Redesign phases" className="flex flex-wrap items-center gap-x-space-1 gap-y-space-2">
          {phases.map((phase, i) => (
            <li key={phase} className="flex items-center gap-space-1">
              <span className="rounded-pill border border-ink/15 bg-surface px-space-2 py-1 text-label text-ink/72">
                {i} · {phase}
              </span>
              {i < phases.length - 1 ? (
                <span aria-hidden="true" className="text-ink/40">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-space-5">
          <ComparisonTable
            label="Measured after the redesign, against the baseline"
            columns={["Check", "HealthWarehouse and SpringMeds", "PharmcoRx"]}
            columnsClass="sm:grid-cols-[12rem_1fr_1fr]"
            rows={results}
          />
        </div>
        <p className="mt-space-4 max-w-xl text-body text-ink/72">
          Big swings in the sweep were re-run on their own before I trusted them, and none held up.
          One gap was real, and it predated the redesign: in that measurement, PharmcoRx&apos;s mobile
          homepage took about 7 seconds to show its main image, against a 2.5-second target. The
          cause was placeholder photos, then still waiting on licensed ones.
        </p>
      </CaseStudySection>

      <CaseStudySection
        id="evidence"
        kicker="Accessibility"
        title="What screen readers were actually told."
        body="Audits kept finding markup that looked fine and told a screen reader something wrong. Two examples, from the fixes themselves."
      >
        <DialogFixExample />
        <div className="mt-space-6">
          <MenuAnnouncementExample />
        </div>
        <FeaturePanel className="mt-space-6">
          <div>
            <h3 className={`text-ink ${textH4}`}>Checked by tests, run by hand.</h3>
            <p className="mt-space-3 text-body text-ink/72">
              Playwright and axe-core scan every listed route, plus the states people reach through
              forms, dialogs, and checkout. The suites run by hand, not in CI, and the route script
              exits successfully even when a scan fails. Today they report problems; they don&apos;t
              block them.
            </p>
            <p className="mt-space-3 text-body text-ink/72">
              The HealthWarehouse site also carries a third-party WCAG 2.2 accessibility seal.
            </p>
          </div>
          <ul className="grid gap-space-4">
            {checks.map((item) => (
              <li key={item.label}>
                <span className={`block text-accent ${textH2}`}>{item.value}</span>
                <span className="mt-1 block text-body text-ink/72">{item.label}</span>
              </li>
            ))}
          </ul>
        </FeaturePanel>
      </CaseStudySection>

      <CaseStudySection
        kicker="Next"
        title="What I'd change now."
        body="Each of these was a deliberate call at the time. With another pass:"
      >
        <ul className="grid gap-space-2 sm:grid-cols-2">
          {next.map((item) => (
            <li key={item.title} className="rounded-lg bg-surface-raised p-space-2 sm:p-space-3">
              <span className={`block text-ink ${textH5}`}>{item.title}</span>
              <span className="mt-1 block text-body text-ink/72">{item.body}</span>
            </li>
          ))}
        </ul>
      </CaseStudySection>

      <CaseStudySection kicker="Role" title="What was mine">
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
