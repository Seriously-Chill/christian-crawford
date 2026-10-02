import { textH5 } from "@/lib/type";

/**
 * Short titled points as `surface-raised` tiles, two across from `sm` up:
 * a case study's role and next steps. `accent` sets the titles in `accent`,
 * for the role lists, where each title is the verb.
 */
export function TileList({
  items,
  accent = false,
}: {
  items: { title: string; body: string }[];
  accent?: boolean;
}) {
  return (
    <ul className="grid gap-space-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.body} className="rounded-lg bg-surface-raised p-space-2 sm:p-space-3">
          <span className={`block ${accent ? "text-accent" : "text-ink"} ${textH5}`}>{item.title}</span>
          <span className="mt-1 block text-body text-ink/72">{item.body}</span>
        </li>
      ))}
    </ul>
  );
}
