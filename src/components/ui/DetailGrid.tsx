/**
 * A grid of small `surface-raised` / `radius-lg` tiles in the `label` text
 * style, for short lists (a tech stack, interaction flows).
 */
export function DetailGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-space-2 sm:grid-cols-4">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg bg-surface-raised px-space-2 py-space-2 text-center text-label text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
