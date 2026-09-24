import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { Tags } from "@/components/ui/Tags";
import { textH2 } from "@/lib/type";

const protectedFiles = ["Hook settings", "Hook scripts", "CLAUDE.md", "AGENTS.md", "Decision log"];

/**
 * `/ai` §2 — the governance layer at a glance, in the same on-gradient
 * glass-card language as Home's "What I do." grid. The hierarchy is the
 * layout itself: the two enforcement checks sit side by side as equals
 * (different tool paths, same files), the decision log spans the full
 * width beneath them (it explains both rather than enforcing anything),
 * and the files all three cover close the section as a tag row. Sits
 * directly under `PageIntro` on the same gradient, like `/work`'s
 * `ProjectFeature`.
 */
export function GovernanceOverview() {
  return (
    <section className="bg-page-gradient">
      <div className="mx-auto max-w-5xl px-space-3 pb-space-7">
        <RevealOnScroll className="text-center">
          <h2 className={`text-on-header ${textH2}`}>Two checks and a record.</h2>
          <p className="mx-auto mt-space-3 max-w-xl text-body text-on-header/80">
            In this project, I added a governance layer around Claude Code. It treats changes to
            the agent&apos;s own instructions and enforcement hooks differently from ordinary
            application edits.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100} className="mt-space-5 grid gap-space-3 sm:grid-cols-2">
          <EvidenceCard title="Confirmation gate" tags={["Edit / Write", "Before the edit"]} onGradient>
            Asks for confirmation before Claude Code edits a governance file directly.
          </EvidenceCard>
          <EvidenceCard title="Bash change check" tags={["Bash", "After the command"]} onGradient>
            Looks for governance files changed by a shell command, and stops to ask about them.
          </EvidenceCard>
          <div className="sm:col-span-2">
            <EvidenceCard title="Decision log" tags={["What", "Why", "What was left out"]} onGradient>
              Explains what both checks protect and why this project uses them.
            </EvidenceCard>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={200} className="mt-space-5 text-center">
          <p className="text-label text-on-header/80">Protected files</p>
          <Tags items={protectedFiles} onGradient align="center" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
