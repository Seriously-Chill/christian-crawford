import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { GovernanceOverview } from "@/components/sections/GovernanceOverview";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { textH2, textH3 } from "@/lib/type";

export const metadata: Metadata = {
  title: "AI in practice",
  description:
    "How I use AI in engineering work, and the project-level governance layer I built around Claude Code to protect the rules it works within.",
};

const followUp = "mx-auto mt-space-5 max-w-xl text-center text-body text-ink/72";

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
        kicker="Confirmation gate"
        title="Protect the rules that shape the work"
        body="If Claude Code tries to edit a governance file directly, a hook asks for confirmation. The protected files include the Claude Code hook settings and scripts, the project’s agent instructions, and the decision log that explains why the safeguards exist."
      >
        <DetailGrid items={["Hook settings", "Hook scripts", "Agent instructions", "Decision log"]} />
        <p className={followUp}>
          That distinction matters: an agent changing application code is different from an agent
          quietly changing the rules it follows.
        </p>
      </CaseStudySection>

      <CaseStudySection
        kicker="Bash change check"
        title="Catch the alternate route"
        body="A direct-edit check can’t see every way a file might be changed. A second hook checks after Bash commands and looks for changes to the same governance files. This helps catch edits made through shell commands such as sed, redirects, or file copies."
      >
        <DetailGrid items={["sed edits", "Redirects", "File copies", "Other shell writes"]} />
        <p className={followUp}>
          The two checks cover different paths through the tools, so the governance layer is harder
          to weaken by accident.
        </p>
        <p className="mx-auto mt-space-2 max-w-xl text-center text-label text-ink/72">
          The command has already run by then, so the check stops and asks rather than undoing it.
          AGENTS.md is left to the confirmation gate, because next dev rewrites it on its own.
        </p>
      </CaseStudySection>

      <CaseStudySection
        kicker="Decision log"
        title="Make the reasoning inspectable"
        body="The decision log records what the safeguards protect, why this project uses them, and which controls from another project were intentionally left out. That keeps the setup understandable instead of turning it into unexplained automation."
      >
        <DetailGrid items={["What it protects", "Why it exists", "What was left out", "Known gaps"]} />
      </CaseStudySection>

      <CurveDivider above="surface" below="gradient-page" />

      <section className="bg-page-gradient">
        <div className="mx-auto max-w-5xl px-space-3 py-space-7">
          <RevealOnScroll className="text-center">
            <p className="text-label text-on-header/80">Scope</p>
            <h2 className={`mt-space-2 text-on-header ${textH2}`}>Build safeguards for the project at hand</h2>
            <p className="mx-auto mt-space-3 max-w-xl text-body text-on-header/80">
              This isn&apos;t a universal AI security system. It&apos;s a focused, project-level
              safeguard for Claude Code&apos;s governance files. It asks for confirmation on direct
              edits and checks for shell-based changes; it doesn&apos;t automatically validate every
              piece of generated application code.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delayMs={100} className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
            <EvidenceCard title="What it does" onGradient>
              Guards the files that define how Claude Code works in this repo.
            </EvidenceCard>
            <EvidenceCard title="What it doesn’t" onGradient>
              Validate generated application code. That still takes tests and review.
            </EvidenceCard>
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
