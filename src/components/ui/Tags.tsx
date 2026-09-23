/**
 * Small pill list for a card's technology/category tags — built only from
 * existing tokens (`radius-pill`, `text-label`), no new visual language.
 * Shared by `EvidenceCard` and `ProjectFeature`.
 */
export function Tags({
  items,
  onGradient = false,
  align = "start",
}: {
  items: string[];
  onGradient?: boolean;
  align?: "start" | "center";
}) {
  return (
    <ul className={`mt-space-2 flex flex-wrap gap-space-1 ${align === "center" ? "justify-center" : ""}`}>
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
