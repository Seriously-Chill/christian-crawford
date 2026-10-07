import { Pill } from "@/components/ui/Pill";

/**
 * A short sequence as pills joined by arrows, wrapping onto as many lines as
 * it needs. The arrows are decorative; the ordered list carries the order.
 */
export function StepChain({ label, steps }: { label: string; steps: string[] }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-x-space-1 gap-y-space-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-space-1">
          <Pill filled>{step}</Pill>
          {i < steps.length - 1 ? (
            <span aria-hidden="true" className="text-faint">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
