import { NarrativeSection } from "@/components/sections/NarrativeSection";

/**
 * The design background, told as explanation rather than a marketing claim:
 * what the habit is, and where it shows up in the engineering.
 */
export function DesignBackground() {
  return (
    <NarrativeSection onGradient title="Why the design years still matter.">
      <div className="max-w-xl space-y-space-3 text-body text-on-header/80">
        <p>
          Design training leaves a habit: noticing the moment a product asks something of the
          person using it. I still look for that moment first. It usually tells me more about the
          right architecture than the requirements doc does.
        </p>
        <p>
          It shows up in the engineering too. I build one shared foundation and configure only
          what really differs between brands, and I check accessibility with tests that run on
          every change, so it stays fixed after the audit.
        </p>
        <p>
          It’s also why I rarely stay in one lane. The interesting work happens while product,
          design, and engineering are still deciding what to build, and I’ve sat in all three
          seats.
        </p>
      </div>
    </NarrativeSection>
  );
}
