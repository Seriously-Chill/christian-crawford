import { textH5 } from "@/lib/type";
import { FlowArrow } from "@/components/visuals/FlowArrow";
import { FigureCaption } from "@/components/visuals/FigureCaption";
import { DiagramBox } from "@/components/visuals/DiagramBox";

// Each path's example is a real one from the codebase.
const paths = [
  {
    kind: "A value",
    detail: "A color, a feature flag, the pharmacist’s hours",
    destination: "The brand’s config",
    example: "Pharmacist hours: one shared component reads each brand’s hours string.",
  },
  {
    kind: "Markup",
    detail: "A different sentence, or a different structure",
    destination: "The smallest per-brand component",
    example: "Shipping copy: each brand writes its opening line; the sentence they share is its own file.",
  },
  {
    kind: "Behavior",
    detail: "What a component does, when only its layout differs",
    destination: "Stays shared, in a hook",
    example: "The header: two layouts, one hook for sign-in, the mini-cart, and sign-out.",
  },
];

/**
 * HealthWarehouse architecture: the forking rule as three routes, each a
 * kind of difference and where it lives, with a real example. The arrows are
 * decorative; an sr-only "goes to" carries the same link in speech. Drawn
 * in HTML like the site's other diagrams, so it reflows and follows the
 * picker themes.
 */
export function DifferenceRouting() {
  return (
    <figure aria-labelledby="difference-routing-caption" className="max-w-4xl">
      <div aria-hidden="true" className="hidden gap-space-2 pb-space-2 sm:grid sm:grid-cols-[1fr_1rem_1.25fr]">
        <p className="text-label text-muted">When this differs</p>
        <span />
        <p className="text-label text-muted">it goes to</p>
      </div>
      <ul className="grid gap-space-3">
        {paths.map((path) => (
          <li key={path.kind} className="grid items-center sm:grid-cols-[1fr_1rem_1.25fr] sm:gap-space-2">
            <DiagramBox compact>
              <p className={`text-ink ${textH5}`}>{path.kind}</p>
              <p className="mt-1 text-body text-muted">{path.detail}</p>
            </DiagramBox>
            <div className="flex justify-center">
              <FlowArrow className="my-1 sm:my-0 sm:-rotate-90" />
              <span className="sr-only">goes to</span>
            </div>
            <DiagramBox tone="highlight" compact>
              <p className={`text-ink ${textH5}`}>{path.destination}</p>
              <p className="mt-1 text-body text-muted">{path.example}</p>
            </DiagramBox>
          </li>
        ))}
      </ul>
      <FigureCaption id="difference-routing-caption">
        Where a difference between brands goes. Config and components are both picked when a brand is
        built, never while it runs.
      </FigureCaption>
    </figure>
  );
}
