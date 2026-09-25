import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { textH2 } from "@/lib/type";

const governed = [".claude/settings.json", ".claude/hooks/*.sh", "CLAUDE.md", "AGENTS.md"];

/**
 * Production form of the reference's solid promo panel ("PR GROUP
 * Catalog"): one saturated block on a white section pointing somewhere else.
 * Here it points Home visitors to /ai, which Home otherwise never mentions.
 * The right side lists the real files that page's hooks protect.
 */
export function AiBanner() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 pb-space-7">
        <RevealOnScroll className="grid gap-space-4 rounded-xl bg-accent p-space-3 sm:p-space-5 md:grid-cols-[3fr_2fr] md:items-center">
          <div>
            <p className="text-label text-surface/80">AI in practice</p>
            <h2 className={`mt-space-2 text-surface lg:mt-space-3 ${textH2}`}>
              AI helps write the code. I protect the rules it follows.
            </h2>
            <p className="mt-space-3 max-w-md text-body text-surface/80">
              This site&apos;s own repository runs Claude Code with hooks that flag every change
              to the agent&apos;s rules for my review.
            </p>
            <div className="mt-space-4">
              <Button href="/ai">See how it works</Button>
            </div>
          </div>
          <ul aria-label="Files the hooks protect" className="flex flex-wrap gap-space-1 md:justify-end">
            {governed.map((file) => (
              <li
                key={file}
                className="rounded-pill border border-surface/30 px-space-2 py-1 text-label text-surface"
              >
                {file}
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
