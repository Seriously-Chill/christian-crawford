import { eras } from "@/components/sections/CareerProgression";

// Markers fill in era by era, from an open ring to the accent-filled
// present: the habits accumulate rather than replace each other.
const markers = [
  "border-2 border-ink/30",
  "border-2 border-ink/50",
  "border-2 border-accent",
  "border-[5px] border-accent",
  "bg-accent",
];

/**
 * Home's "same habit" proof: each era of the career as the habit it left,
 * on one line. Vertical below `lg`, where five columns would crush the
 * sentences; horizontal from `lg` up. The markers and rule are decorative.
 * The eras, and the full story behind each, live in `CareerProgression` on
 * /about.
 */
export function CareerArc() {
  return (
    <ol aria-label="What each part of my career taught me" className="grid lg:grid-cols-5">
      {eras.map((era, i) => (
        <li key={era.range} className="flex gap-space-2 lg:block">
          <div aria-hidden="true" className="flex flex-col items-center lg:flex-row">
            <span className={`size-4 shrink-0 rounded-circle ${markers[i]}`} />
            {i < eras.length - 1 ? (
              <span className="my-1 w-px flex-1 bg-ink/20 lg:mx-space-1 lg:my-0 lg:h-px lg:w-auto" />
            ) : null}
          </div>
          <div className="pb-space-4 lg:mt-space-2 lg:pb-0 lg:pr-space-3">
            <p className="text-label text-subtle">
              {era.short} · {era.range.split("–")[0]}
            </p>
            <p className="mt-space-1 text-body text-ink">{era.carried}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
