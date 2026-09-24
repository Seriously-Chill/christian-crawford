import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { textH2 } from "@/lib/type";

const interests = [
  {
    title: "AI + Architecture",
    body: "As code gets easier to generate, shared context matters more. I'm exploring how repository guidance and decision records can help teams and AI tools make consistent changes.",
  },
  {
    title: "AI + Testing",
    body: "AI-generated changes still need strong evidence. I'm interested in tests and quality checks that catch regressions even when a change looks reasonable at first glance.",
  },
  {
    title: "AI + Developer Experience",
    body: "Good development workflows make expectations clear and repeatable, whoever writes the code. That gives teams a clearer basis for reviewing changes and keeping the system maintainable.",
  },
];

/**
 * About §4, "What I'm interested in now" — forward-looking, not a solved
 * problem. Links on to `/ai`, where one of these interests is shown in practice.
 */
export function CurrentInterests() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <RevealOnScroll className="text-center">
          <h2 className={`text-ink ${textH2}`}>I&apos;m interested in what&apos;s next.</h2>
          <p className="mx-auto mt-space-3 max-w-xl text-body text-ink/72">
            AI-assisted development is changing how software gets built. I&apos;m interested in
            what that means for architecture, testing, maintainability, and the way humans work
            with large codebases.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={100} className="mt-space-5 grid gap-space-3 sm:grid-cols-3">
          {interests.map((item) => (
            <EvidenceCard key={item.title} title={item.title}>
              {item.body}
            </EvidenceCard>
          ))}
        </RevealOnScroll>
        <RevealOnScroll delayMs={200} className="mt-space-5 text-center">
          <Button href="/ai" variant="bordered">
            See how I work with AI
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
