/**
 * A short sequence as pills joined by arrows, wrapping onto as many lines as
 * it needs. The arrows are decorative; the ordered list carries the order.
 */
export function StepChain({ label, steps }: { label: string; steps: string[] }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-x-space-1 gap-y-space-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-space-1">
          <span className="rounded-pill border border-ink/15 bg-surface px-space-2 py-1 text-label text-ink/72">
            {step}
          </span>
          {i < steps.length - 1 ? (
            <span aria-hidden="true" className="text-ink/40">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
