import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { GovernanceOverview } from "@/components/sections/GovernanceOverview";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { GovernanceFlow } from "@/components/visuals/GovernanceFlow";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { textH2, textH3 } from "@/lib/type";

export const metadata: Metadata = {
  title: "AI in practice",
  description:
    "How I use AI in engineering work, and the Claude Code hooks I added to this portfolio site's own repository to protect the rules the agent works within.",
};

const tradeOffs = [
  "The Bash check runs after the command, so it stops work for review but doesn’t undo the change.",
  "Shell changes to AGENTS.md aren’t flagged, because next dev rewrites that file on its own. Direct edits to it still ask first.",
  "When the hooks are first installed, no session baseline exists yet, so the first Bash check can flag existing governance files as changed. From the next session on, the baseline is in place.",
];

export default function AiPage() {
  return (
    <>
      <PageIntro
        breadcrumb="AI in practice"
        kicker="AI in practice"
        title="AI should help move the work forward. The rules around it deserve protection."
        tagline="I use AI to explore ideas, speed up implementation, and work through complexity. But useful output isn’t the only measure of a good AI workflow. The way an AI tool operates—and the rules that guide it—needs to stay visible and open to review."
        visual={<HeroVisual variant="ai" />}
      />
      <GovernanceOverview />
      <CurveDivider above="gradient-page" below="surface" />

      <CaseStudySection
        kicker="How it works"
        title="Two paths to the same files"
        body="Claude Code can change a file with its Edit and Write tools or with a shell command. Each path gets its own check, and they share one record of what's already been reviewed."
      >
        <GovernanceFlow />
      </CaseStudySection>

      <CaseStudySection
        kicker="Why governance files"
        title="Rules need a different check than code"
        body="A bug in a component shows up in tests, in review, or on the page. A change to the hooks or instructions an agent follows is different: it can quietly remove the check that would have caught the next problem. So changes to those files stop and wait for me instead of riding along with ordinary work."
      />

      <CaseStudySection
        kicker="Why this subset"
        title="Only the checks this repo needs"
        body="These hooks are a scaled-down version of a larger set from another project. That set also covers brand configuration, API and authentication changes, quality gates, documentation drift, and accessibility—concerns this small site doesn't have. I kept the governance checks and left the rest out."
      >
        <p className="mx-auto max-w-xl text-center text-body text-ink/72">
          The repository&apos;s decision log records what was kept, what was dropped, and the
          adjustments made along the way, so the setup can be read and questioned rather than
          taken on trust.
        </p>
      </CaseStudySection>

      <CurveDivider above="surface" below="gradient-page" />

      <section className="bg-page-gradient">
        <div className="mx-auto max-w-5xl px-space-3 py-space-7">
          <RevealOnScroll className="text-center">
            <p className="text-label text-on-header/80">Scope</p>
            <h2 className={`mt-space-2 text-on-header lg:mt-space-3 ${textH2}`}>A focused safeguard, not a safety net</h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={100} className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
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
                <ul className="mx-auto max-w-2xl space-y-space-2">
                  {tradeOffs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </EvidenceCard>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CurveDivider above="gradient-page" below="surface" />

      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-space-3 py-space-7">
          <RevealOnScroll>
            <p className={`mx-auto max-w-2xl text-center text-ink ${textH3}`}>
              AI can help produce the work. I&apos;m responsible for the system it works within—and
              for reviewing what it produces.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
