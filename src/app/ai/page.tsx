import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { GovernanceOverview } from "@/components/sections/GovernanceOverview";
import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { GovernanceFlow } from "@/components/visuals/GovernanceFlow";
import { WorkShiftDiagram } from "@/components/visuals/WorkShiftDiagram";
import { textH4 } from "@/lib/type";
import { Button } from "@/components/ui/Button";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { StatList } from "@/components/ui/StatList";
import { Tags } from "@/components/ui/Tags";
import { SOURCE_REPO } from "@/lib/links";

export const metadata: Metadata = {
  title: "AI in practice",
  description:
    "How I use AI in engineering work, and the Claude Code hooks I added to this portfolio site’s own repository to protect the rules the agent works within.",
};

const siteStack = [
  "Next.js 16 App Router",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Server Components",
  "Playwright",
  "axe-core",
  "Lighthouse CI",
  "Claude Code",
];

const siteChecks = [
  { value: "303", label: "automated Playwright tests across every page, run in Chromium and WebKit" },
  { value: "28", label: "color settings each page is checked at for WCAG 2.2 AA contrast" },
  { value: "22", label: "keyboard tests for navigation, menus, and the color picker" },
];

const tradeOffs = [
  "The Bash check runs after the command. It stops work for review but doesn’t undo the change.",
  "Shell changes to AGENTS.md aren’t flagged, because next dev rewrites that file itself. Direct edits still ask first.",
  "On first install there’s no baseline yet, so the first Bash check may flag existing governance files. After that, the baseline is set.",
];

export default function AiPage() {
  return (
    <>
      <PageIntro
        breadcrumb="AI in practice"
        kicker="AI in practice"
        title="AI helps write the code. I protect the rules it follows."
        tagline="Useful output isn’t the only test of an AI workflow. The rules guiding the tool need to stay visible and open to review."
      />
      <CurveDivider above="gradient-page" below="surface" />

      <NarrativeSection
        title="Implementation got faster. The judgment moved to either side of it."
        body="An agent writes code quickly, so less of my time goes to typing it. More goes to setting up what the agent works within, and to proving what it produced is right."
      >
        <WorkShiftDiagram />
      </NarrativeSection>

      <CurveDivider above="surface" below="gradient-page" />
      <GovernanceOverview />
      <CurveDivider above="gradient-page" below="surface" />

      <NarrativeSection
        title="Two paths to the same files"
        body="Claude Code can change a file with its Edit and Write tools or with a shell command. Each path gets its own check, and they share one record of what’s already been reviewed."
      >
        <GovernanceFlow />
      </NarrativeSection>

      <NarrativeSection
        title="Rules need a different check than code"
        body="A bug in a component shows up in tests, review, or on the page. A change to the agent’s rules can quietly remove the check that would catch the next problem. So those changes stop and wait for me."
      />

      <NarrativeSection
        title="Only the checks this repo needs"
        body={
          <>
            <p>
              These hooks are trimmed down from a larger set in another project that also covers
              branding, APIs, auth, quality gates, docs, and accessibility. This small site only
              needs the governance checks.
            </p>
            <p>
              The decision log records what I kept, what I dropped, and why, so the setup can be
              questioned rather than taken on trust.
            </p>
          </>
        }
      />

      <CurveDivider above="surface" below="gradient-page" />

      <NarrativeSection onGradient title="What the hooks catch, and what they don’t">
        <div className="grid gap-space-3 sm:grid-cols-2">
          <EvidenceCard title="What it covers" onGradient>
            Changes to the selected governance files in this repository, whether they come from a
            direct edit or a shell command.
          </EvidenceCard>
          <EvidenceCard title="What it doesn’t" onGradient>
            Whether AI-generated application code is correct. That still takes tests and my own
            review.
          </EvidenceCard>
          <div className="sm:col-span-2">
            <EvidenceCard title="Trade-offs" onGradient>
              <ul className="max-w-2xl list-disc space-y-space-2 pl-space-3">
                {tradeOffs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </EvidenceCard>
          </div>
        </div>
      </NarrativeSection>

      <CurveDivider above="gradient-page" below="surface" />

      <NarrativeSection
        id="built"
        title="Built the way I’d build it for a team"
        body="The same habits as the case study, at a smaller scale: a design system turned into tokens, Server Components by default, and accessibility checked by tests rather than by eye."
      >
        <FeaturePanel>
          <div>
            <h3 className={`text-ink ${textH4}`}>Every hue the color picker can make is tested.</h3>
            <p className="mt-space-3 text-body text-muted">
              The picker in the header can put the site on any color, gray, white, or black, so
              the contrast suite checks every page at each of them. The suites run in CI on every
              push, so a change that breaks contrast at any setting fails the build, whether I
              wrote it or an agent did. Only six components run in the browser; everything else
              renders on the server.
            </p>
            <Tags items={siteStack} />
            <div className="mt-space-4">
              <Button href={SOURCE_REPO} variant="bordered" external>
                View the source on GitHub
              </Button>
            </div>
          </div>
          <StatList items={siteChecks} />
        </FeaturePanel>
      </NarrativeSection>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
