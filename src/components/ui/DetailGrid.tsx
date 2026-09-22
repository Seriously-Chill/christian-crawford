/**
 * Production form of ProductGrid's "All types" tile pattern — same
 * surface-raised / radius-lg tile (24px; the top-level README and the
 * source preview.html agree on 24px even though that component's own
 * README says radius-sm — treating the two consistent sources as
 * authoritative), same `label` text style, just holding a different real
 * list (interaction flows, not product SKUs).
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
