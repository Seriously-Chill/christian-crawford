import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { textH2 } from "@/lib/type";

const interests = [
  {
    title: "AI + Architecture",
    body: "As code gets easier to generate, shared context matters more. Repository guidance and decision records help people and AI tools make consistent changes.",
  },
  {
    title: "AI + Testing",
    body: "A change can look right and still break something. AI-generated code needs tests that catch what review misses.",
  },
  {
    title: "AI + Developer Experience",
    body: "Clear, repeatable workflows make changes easier to review, whoever or whatever wrote the code.",
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
          <p className="mx-auto mt-space-3 max-w-xl text-body lg:mt-space-4 text-ink/72">
            AI is changing how software gets built. I&apos;m most interested in what that means
            for architecture, testing, and the people working in large codebases.
          </p>
        </RevealOnScroll>
        <RevealOnScroll className="mt-space-5 grid gap-space-3 sm:grid-cols-3">
          {interests.map((item) => (
            <EvidenceCard key={item.title} title={item.title}>
              {item.body}
            </EvidenceCard>
          ))}
        </RevealOnScroll>
        <RevealOnScroll className="mt-space-5 text-center">
          <Button href="/ai" variant="bordered">
            See how I work with AI
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
