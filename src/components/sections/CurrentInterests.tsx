import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { Button } from "@/components/ui/Button";
import { EvidenceGrid } from "@/components/ui/EvidenceGrid";

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
 * "What I’m interested in now": forward-looking, not a solved problem.
 * Links on to `/ai`, where one of these interests is shown in practice.
 */
export function CurrentInterests() {
  return (
    <NarrativeSection
      title="I’m interested in what’s next."
      body="AI is changing how software gets built. I’m most interested in what that means for architecture, testing, and the people working in large codebases."
    >
      <EvidenceGrid items={interests} />
      <div className="mt-space-5">
        <Button href="/ai" variant="bordered">
          See how I work with AI
        </Button>
      </div>
    </NarrativeSection>
  );
}
