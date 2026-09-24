import { textH2 } from "@/lib/type";

export function HighlightCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-surface-raised p-space-4 text-center">
      <p className={`text-accent ${textH2}`}>{value}</p>
      <p className="mt-space-1 text-body text-ink/72">{label}</p>
    </div>
  );
}
