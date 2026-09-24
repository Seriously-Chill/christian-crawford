import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Tags } from "@/components/ui/Tags";
import { textH2 } from "@/lib/type";

const protectedFiles = [
  ".claude/settings.json",
  ".claude/hooks/*.sh",
  ".claude/rules/*.md",
  "CLAUDE.md",
  "AGENTS.md",
  "docs/agent-decision-log.md",
];

/**
 * `/ai` §2 — sets the context before the diagram: which repository this
 * is (this portfolio site's, not a client or employer codebase) and which
 * files count as "governance." The mechanics live in `GovernanceFlow`
 * below, so this section deliberately doesn't restate them as cards.
 * Sits directly under `PageIntro` on the same gradient.
 */
export function GovernanceOverview() {
  return (
    <section className="bg-page-gradient">
      <div className="mx-auto max-w-5xl px-space-3 pb-space-7">
        <RevealOnScroll className="text-center">
          <h2 className={`text-on-header ${textH2}`}>The repository behind this site.</h2>
          <p className="mx-auto mt-space-3 max-w-xl text-body text-on-header/80">
            Everything on this page describes the Git repository for this portfolio website—the
            code you&apos;re reading now. I build it with Claude Code, and I added a small set of
            hooks that treat changes to the agent&apos;s own instructions and enforcement files
            differently from ordinary page and component edits.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100} className="mt-space-5 text-center">
          <p className="text-label text-on-header/80">Governance files the hooks protect</p>
          <Tags items={protectedFiles} onGradient align="center" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
