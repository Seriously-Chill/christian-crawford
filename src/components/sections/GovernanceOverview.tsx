import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { Tags } from "@/components/ui/Tags";
import { Button } from "@/components/ui/Button";
import { SOURCE_REPO } from "@/lib/links";

/** The governance files this repo's Claude Code hooks protect (.claude/hooks/). */
export const GOVERNED_FILES = [
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
    <NarrativeSection
      onGradient
      title="The repository behind this site."
      body="This page describes the repository for this site, the code you’re reading now. I build it with Claude Code, and I added hooks that treat changes to the agent’s own rules differently from everyday edits."
    >
      <p className="text-label text-on-header-muted">Governance files the hooks protect</p>
      <Tags items={GOVERNED_FILES} onGradient />
      <div className="mt-space-4">
        <Button href={SOURCE_REPO} variant="bordered-inverse" external>
          View the repository on GitHub
        </Button>
      </div>
    </NarrativeSection>
  );
}
