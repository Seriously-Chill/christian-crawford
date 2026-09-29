/** A small pill list for a card's technology/category tags. */
export function Tags({
  items,
  onGradient = false,
}: {
  items: string[];
  onGradient?: boolean;
}) {
  return (
    <ul className="mt-space-2 flex flex-wrap gap-space-1">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-pill border px-space-2 py-1 text-label ${
            onGradient ? "border-on-header/30 text-on-header/80" : "border-ink/15 text-ink/70"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
