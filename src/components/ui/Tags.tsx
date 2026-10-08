import { Pill } from "@/components/ui/Pill";

/** A small pill list for a card's technology/category tags. */
export function Tags({
  items,
  onGradient = false,
  mono = false,
}: {
  items: string[];
  onGradient?: boolean;
  mono?: boolean;
}) {
  return (
    <ul className="mt-space-2 flex flex-wrap gap-space-1">
      {items.map((item) => (
        <Pill as="li" key={item} tone={onGradient ? "on-gradient" : "default"} mono={mono}>
          {item}
        </Pill>
      ))}
    </ul>
  );
}
