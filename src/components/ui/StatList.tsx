import { textH2 } from "@/lib/type";

/**
 * Headline figures for a light panel: each value large in `accent`, with
 * what it counts underneath.
 */
export function StatList({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="grid gap-space-4">
      {items.map((item) => (
        <li key={item.label}>
          <span className={`block text-accent ${textH2}`}>{item.value}</span>
          <span className="mt-1 block text-body text-ink/72">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
