import { textH5 } from "@/lib/type";

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 24"
      className="mx-auto my-space-1 h-6 w-4 text-ink/40"
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

const flows = [
  {
    label: "Before",
    steps: [
      "A partner emails support",
      "Support waits on someone who can query the database, often an engineer",
      "The answer comes back by email, with no status or history",
    ],
  },
  {
    label: "With the portal",
    steps: [
      "A partner signs in to the portal",
      "They look up the order, fix the record, or pull the report themselves",
      "Support and engineers stay out of routine requests",
    ],
  },
];

/**
 * Partner portal case study: the same routine request, before and after.
 * Drawn like `SheetStackDiagram`, as HTML boxes and arrows so every label
 * stays real text and follows the picker themes.
 */
export function PartnerRequestFlow() {
  return (
    <figure aria-labelledby="partner-request-caption" className="max-w-3xl">
      <div className="grid gap-space-5 sm:grid-cols-2">
        {flows.map((flow, f) => (
          <div key={flow.label}>
            <h3 className={`text-ink ${textH5}`}>{flow.label}</h3>
            <ol className="mt-space-2">
              {flow.steps.map((step, i) => (
                <li key={step}>
                  {i > 0 ? <Arrow /> : null}
                  <div
                    className={`rounded-lg border bg-surface-raised p-space-2 text-body text-ink/72 ${
                      f === flows.length - 1 && i === flow.steps.length - 1
                        ? "border-accent"
                        : "border-ink/15"
                    }`}
                  >
                    {step}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <figcaption id="partner-request-caption" className="mt-space-3 text-body text-ink/72">
        The portal is still being built, so the second path is the design, not yet the daily
        routine.
      </figcaption>
    </figure>
  );
}
