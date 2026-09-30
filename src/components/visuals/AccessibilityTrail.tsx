import { textH5 } from "@/lib/type";

// Markers fill in step by step: an open finding on the left, a closed and
// guarded one on the right.
const steps = [
  { name: "Found", detail: "Audits of two platforms", marker: "border-2 border-ink/30" },
  { name: "Fixed", detail: "Forms, keyboard, dialogs", marker: "border-2 border-accent" },
  { name: "Verified", detail: "WCAG 2.2 AA seal", marker: "border-[5px] border-accent" },
  { name: "Kept fixed", detail: "Automated tests", marker: "bg-accent" },
];

/**
 * Home's quality proof: the path every accessibility finding took, as four
 * steps on one line. Vertical on phones, where four columns would crush the
 * text; horizontal from `sm` up. The markers and rule are decorative.
 */
export function AccessibilityTrail() {
  return (
    <ol aria-label="From audit findings to regression tests" className="grid sm:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.name} className="flex gap-space-2 sm:block">
          <div aria-hidden="true" className="flex flex-col items-center sm:flex-row">
            <span className={`size-4 shrink-0 rounded-circle ${step.marker}`} />
            {i < steps.length - 1 ? (
              <span className="my-1 w-px flex-1 bg-ink/20 sm:mx-space-1 sm:my-0 sm:h-px sm:w-auto" />
            ) : null}
          </div>
          <div className="pb-space-3 sm:mt-space-2 sm:pb-0 sm:pr-space-2">
            <p className={`text-ink ${textH5}`}>{step.name}</p>
            <p className="mt-1 text-body text-ink/72">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
