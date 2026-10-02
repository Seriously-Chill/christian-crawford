import { EvidenceCard } from "@/components/ui/EvidenceCard";

/**
 * A row of `EvidenceCard`s, one column on phones. Three cards sit three
 * across from `sm` up; two or four sit two across, so no row is left with
 * a single card.
 */
export function EvidenceGrid({
  items,
  className = "",
}: {
  items: { title: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={`grid gap-space-3 ${items.length % 3 === 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"} ${className}`}>
      {items.map((item) => (
        <EvidenceCard key={item.title} title={item.title}>
          {item.body}
        </EvidenceCard>
      ))}
    </div>
  );
}
