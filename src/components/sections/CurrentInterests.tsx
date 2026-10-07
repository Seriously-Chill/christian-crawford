import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { Button } from "@/components/ui/Button";

/**
 * "What I’m interested in now": forward-looking, not a solved problem.
 * Links on to `/ai`, where one of these interests is shown in practice.
 */
export function CurrentInterests() {
  return (
    <NarrativeSection
      title="I’m interested in what’s next."
      body="AI is changing how software gets built. I’m most interested in what that means for architecture, testing, and the people working in large codebases."
    >
      <div className="max-w-xl space-y-space-3 text-body text-ink/72">
        <p>
          As code gets easier to generate, shared context matters more. Repository guidance and
          decision records help people and AI tools make consistent changes.
        </p>
        <p>
          A change can look right and still break something, so AI-generated code needs tests
          that catch what review misses. And the workflow around it should keep every change
          easy to review, whoever or whatever wrote it.
        </p>
      </div>
      <div className="mt-space-5">
        <Button href="/ai" variant="bordered">
          See how I work with AI
        </Button>
      </div>
    </NarrativeSection>
  );
}
