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

const steps = [
  {
    url: "/customers",
    title: "The list",
    body: "Filtered and paged, like any other list page.",
  },
  {
    url: "/customers?customer=42",
    title: "A record opens over it",
    body: "The list stays put underneath. Refresh, or send the link, and the same customer is open.",
  },
  {
    url: "/customers?customer=42&order=7",
    title: "A related record stacks on top",
    body: "One of that customer's orders opens as a second panel. Back closes it, and the customer is still there.",
  },
];

/**
 * Partner portal case study: how the address bar carries which detail
 * panels are open. Drawn like `DifferenceRouting`, as HTML boxes and arrows so
 * every label stays real text and follows the picker themes. Read top-down,
 * the order a person clicks through. The URLs are illustrative, not the
 * portal's actual parameter names.
 */
export function SheetStackDiagram() {
  return (
    <figure aria-labelledby="sheet-stack-caption" className="max-w-3xl">
      <ol>
        {steps.map((step, i) => (
          <li key={step.url}>
            {i > 0 ? <Arrow /> : null}
            <div
              className={`rounded-lg border bg-surface-raised p-space-2 sm:p-space-3 ${
                i === steps.length - 1 ? "border-accent" : "border-ink/15"
              }`}
            >
              <p className="break-all text-label text-ink/72">{step.url}</p>
              <h3 className={`mt-space-1 text-ink ${textH5}`}>{step.title}</h3>
              <p className="mt-1 text-body text-ink/72">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption id="sheet-stack-caption" className="mt-space-3 text-body text-ink/72">
        The address bar holds which panels are open, so the view survives a refresh, the back
        button, and a shared link.
      </figcaption>
    </figure>
  );
}
