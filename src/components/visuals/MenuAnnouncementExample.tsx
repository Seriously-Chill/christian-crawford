import { textH4, textH5 } from "@/lib/type";
import { FigureCaption } from "@/components/visuals/FigureCaption";
import { DiagramBox } from "@/components/visuals/DiagramBox";

// From the fix's own commit (June 2026). The instructions are quoted as
// shipped.
const steps = [
  {
    label: "Tried",
    title: "Announce it when the menu opens",
    body: "A live region spoke the keyboard instructions as the submenu opened.",
  },
  {
    label: "Why it failed",
    title: "Focus moved at the same moment",
    body: "Focus jumping into the submenu raced the announcement, and JAWS and NVDA dropped it.",
  },
  {
    label: "Shipped",
    title: "Describe each item on focus",
    body: "Each top-level menu item points to hidden instructions with aria-describedby, read on focus, before anything opens: “Press Enter or Space to open…”",
  },
];

/**
 * HealthWarehouse evidence: the mega menu's screen-reader instructions, as
 * the approach that failed, why, and the one that shipped. Real text
 * throughout.
 */
export function MenuAnnouncementExample() {
  return (
    <figure aria-labelledby="menu-announcement-caption">
      <h3 className={`text-ink ${textH4}`}>The menu’s instructions, second attempt</h3>
      <ol className="mt-space-3 grid gap-space-3 sm:grid-cols-3">
        {steps.map((step, i) => (
          <DiagramBox as="li" key={step.label} tone={i === steps.length - 1 ? "highlight" : "item"}>
            <p className="text-label text-muted">{step.label}</p>
            <p className={`mt-space-1 text-ink ${textH5}`}>{step.title}</p>
            <p className="mt-1 text-body text-muted">{step.body}</p>
          </DiagramBox>
        ))}
      </ol>
      <FigureCaption id="menu-announcement-caption">
        The site’s main menu, June 2026. An earlier fix had already stopped VoiceOver reading
        each category name twice, by removing region roles and a live region the menu didn’t
        need.
      </FigureCaption>
    </figure>
  );
}
