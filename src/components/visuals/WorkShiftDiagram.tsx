import { textH5 } from "@/lib/type";
import { FigureCaption } from "@/components/visuals/FigureCaption";
import { DiagramBox } from "@/components/visuals/DiagramBox";

type Stage = { name: string; weight: number; swatch: string; text: string };

// Each stage keeps one swatch across both rows, so the eye can follow it.
// Context engineering is an outline rather than a fill: in the gray theme,
// accent and ink tints land too close together to tell apart.
const swatch = {
  specs: "bg-ink/25",
  context: "border-2 border-accent",
  implementation: "bg-ink/65",
  verification: "bg-accent",
};

const rows: { id: string; title: string; stages: Stage[] }[] = [
  {
    id: "before",
    title: "Before AI",
    stages: [
      { name: "Specs", weight: 2, swatch: swatch.specs, text: "Working out what to build." },
      {
        name: "Implementation",
        weight: 7,
        swatch: swatch.implementation,
        text: "Where most of the engineering time went.",
      },
      { name: "Testing", weight: 2, swatch: swatch.verification, text: "Checking it once it was built." },
    ],
  },
  {
    id: "after",
    title: "With AI",
    stages: [
      { name: "Specs", weight: 2, swatch: swatch.specs, text: "Unchanged: working out what to build." },
      {
        name: "Context engineering",
        weight: 3,
        swatch: swatch.context,
        text: "The rules the agent works within: CLAUDE.md, AGENTS.md, the hooks, and the decision log.",
      },
      {
        name: "Implementation",
        weight: 1,
        swatch: swatch.implementation,
        text: "Much faster to produce. Still reviewed, and still mine to answer for.",
      },
      {
        name: "Testing and verification",
        weight: 5,
        swatch: swatch.verification,
        text: "Automated tests of every page in two browsers, at all 28 color settings. The counts are further down.",
      },
    ],
  },
];

/**
 * `/ai`: where engineering time goes with and without an AI agent. Each
 * row is a bar whose segments are sized by rough share of the work, with a
 * list underneath that carries the same stages as real text. The bar is
 * decorative (`aria-hidden`); everything it shows is in the list, and the
 * caption says the widths are illustrative, not measured. Drawn in HTML
 * like `GovernanceFlow`, so it follows the picker themes and reflows.
 */
export function WorkShiftDiagram() {
  return (
    <figure aria-labelledby="work-shift-caption" className="max-w-4xl">
      <div className="grid gap-space-4">
        {rows.map((row) => (
          <DiagramBox as="section" key={row.id} tone="frame" aria-labelledby={`shift-${row.id}`}>
            <h3 id={`shift-${row.id}`} className={`text-ink ${textH5}`}>
              {row.title}
            </h3>
            <div aria-hidden="true" className="mt-space-2 flex h-4 gap-1">
              {row.stages.map((stage) => (
                <span
                  key={stage.name}
                  className={`min-w-2 rounded-pill ${stage.swatch}`}
                  style={{ flexGrow: stage.weight, flexBasis: 0 }}
                />
              ))}
            </div>
            <ol className={`mt-space-3 grid gap-space-2 ${row.stages.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
              {row.stages.map((stage) => (
                <li key={stage.name} className="rounded-md bg-surface-raised px-space-2 py-space-2">
                  <p className="flex items-center gap-space-1 text-label text-ink">
                    <span aria-hidden="true" className={`size-3 shrink-0 rounded-circle ${stage.swatch}`} />
                    {stage.name}
                  </p>
                  <p className="mt-space-1 text-body text-muted">{stage.text}</p>
                </li>
              ))}
            </ol>
          </DiagramBox>
        ))}
      </div>
      <FigureCaption id="work-shift-caption">
        Widths show rough share of the work, not measurements.
      </FigureCaption>
    </figure>
  );
}
