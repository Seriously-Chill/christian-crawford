import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { Button } from "@/components/ui/Button";

/**
 * "What I’m interested in now": forward-looking, not a solved problem.
 * Links on to `/ai`, where one of these interests is shown in practice.
 */
export function CurrentInterests() {
  return (
    <NarrativeSection
      title="What I’m exploring now."
      body={
        <>
          <p>
            I’m experimenting with AI coding tools and paying attention to how they change the work
            around code: setting shared context, reviewing decisions, and checking the result. I’ve
            added a small example here in this site’s own repo.
          </p>
        </>
      }
    >
      <Button href="/ai" variant="bordered">
        See the example
      </Button>
    </NarrativeSection>
  );
}
