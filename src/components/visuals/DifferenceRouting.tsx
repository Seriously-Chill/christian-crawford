import { textH5 } from "@/lib/type";

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 24"
      className="my-1 h-6 w-4 shrink-0 text-ink/40 sm:my-0 sm:-rotate-90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v18M3 15l5 5 5-5" />
    </svg>
  );
}

// Each path's example is a real one from the codebase.
const paths = [
  {
    kind: "A value",
    detail: "A color, a feature flag, the pharmacist's hours",
    destination: "The brand's config",
    example: "Pharmacist hours: one shared component reads each brand's hours string.",
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
        <p className="text-label text-ink/72">When this differs</p>
        <span />
        <p className="text-label text-ink/72">it goes to</p>
      </div>
      <ul className="grid gap-space-3">
        {paths.map((path) => (
          <li key={path.kind} className="grid items-center sm:grid-cols-[1fr_1rem_1.25fr] sm:gap-space-2">
            <div className="rounded-lg border border-ink/15 bg-surface p-space-2">
              <p className={`text-ink ${textH5}`}>{path.kind}</p>
              <p className="mt-1 text-body text-ink/72">{path.detail}</p>
            </div>
            <div className="flex justify-center">
              <Arrow />
              <span className="sr-only">goes to</span>
            </div>
            <div className="rounded-lg border border-accent bg-surface p-space-2">
              <p className={`text-ink ${textH5}`}>{path.destination}</p>
              <p className="mt-1 text-body text-ink/72">{path.example}</p>
            </div>
          </li>
        ))}
      </ul>
      <figcaption id="difference-routing-caption" className="mt-space-3 max-w-xl text-body text-ink/72">
        Where a difference between brands goes. Config and components are both picked when a brand is
        built, never while it runs.
      </figcaption>
    </figure>
  );
}
