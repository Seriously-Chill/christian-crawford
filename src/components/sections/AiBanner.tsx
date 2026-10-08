import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { GOVERNED_FILES } from "@/components/sections/GovernanceOverview";
import { textH2 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

/**
 * Points Home visitors to /ai, which Home otherwise never mentions. Its
 * heading is its own, not /ai's h1 repeated. The right side lists the real
 * files that page's hooks protect, set as identifiers.
 */
export function AiBanner() {
  return (
    <Section spacing="end">
      <div className="grid gap-space-4 rounded-xl bg-accent p-space-3 sm:p-space-5 md:grid-cols-[3fr_2fr] md:items-center">
        <div>
          <p className="text-label text-on-accent-muted">AI in practice</p>
          <h2 className={`mt-space-2 text-surface lg:mt-space-3 ${textH2}`}>
            This site’s own repository is the evidence.
          </h2>
          <p className="mt-space-3 max-w-md text-body text-on-accent-muted">
            I build it with Claude Code. Hooks stop every change to the agent’s own rules and
            wait for my review, whether it came from an edit or a shell command.
          </p>
          <div className="mt-space-4">
            <Button href="/ai" variant="on-accent">
              See how it works
            </Button>
          </div>
        </div>
        <ul aria-label="Files the hooks protect" className="flex flex-wrap gap-space-1 md:justify-end">
          {GOVERNED_FILES.map((file) => (
            <Pill as="li" key={file} tone="on-accent" mono>
              {file}
            </Pill>
          ))}
        </ul>
      </div>
    </Section>
  );
}
