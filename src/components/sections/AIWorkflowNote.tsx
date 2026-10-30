import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { Button } from "@/components/ui/Button";

/** A small pointer to the AI workflow, kept in proportion with the work itself. */
export function AIWorkflowNote() {
  return (
    <NarrativeSection
      title="A small example of how I use AI."
      body="I use Claude Code on this site. A small set of hooks makes changes to its working rules wait for my review; Playwright and axe check the site itself."
    >
      <Button href="/ai" variant="bordered">
        See the setup
      </Button>
    </NarrativeSection>
  );
}
