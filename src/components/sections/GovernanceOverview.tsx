import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Tags } from "@/components/ui/Tags";
import { Button } from "@/components/ui/Button";
import { SOURCE_REPO } from "@/lib/links";
import { textH2 } from "@/lib/type";

const protectedFiles = [
  ".claude/settings.json",
  ".claude/hooks/*.sh",
  "CLAUDE.md",
  "AGENTS.md",
  "docs/agent-decision-log.md",
];

/**
 * Context before the hooks diagram: which repository this is (this site's,
 * not a client or employer codebase) and which files count as governance.
 * The mechanics live in `GovernanceFlow`, so this deliberately doesn't
 * restate them as cards.
 */
export function GovernanceOverview() {
  return (
    <section className="bg-page-gradient">
      <div className="mx-auto max-w-5xl px-space-3 pt-space-6 pb-space-7">
        <RevealOnScroll>
          <h2 className={`text-on-header ${textH2}`}>The repository behind this site.</h2>
          <p className="mt-space-3 max-w-xl text-body lg:mt-space-4 text-on-header/80">
            This page describes the repository for this site, the code you&apos;re reading now. I
            build it with Claude Code, and I added hooks that treat changes to the agent&apos;s own
            rules differently from everyday edits.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="mt-space-5">
          <p className="text-label text-on-header/80">Governance files the hooks protect</p>
          <Tags items={protectedFiles} onGradient />
          <div className="mt-space-4">
            <Button
              href={SOURCE_REPO}
              variant="bordered-inverse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View the repository on GitHub (opens in a new tab)"
            >
              View the repository on GitHub
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
