import type { ReactNode } from "react";

/**
 * A small comparison: one row per thing compared, one column per side. From
 * `sm` up it reads as a quiet table; on phones each row becomes its own
 * card, with the column name above each value. ARIA table roles carry the
 * structure, so it reads as a table aloud at every width (a native `<table>`
 * loses its semantics in some browsers once it's restyled as blocks). The
 * per-cell column names are visual only; the column headers name the cells.
 * `columnsClass` is the `sm:` grid template, passed as a literal so Tailwind
 * sees it.
 */
export function ComparisonTable({
  label,
  columns,
  rows,
  columnsClass,
}: {
  label: string;
  columns: string[];
  rows: { label: string; cells: ReactNode[] }[];
  columnsClass: string;
}) {
  return (
    <div role="table" aria-label={label} className="grid gap-space-1 sm:gap-0">
      <div role="row" className={`sr-only sm:not-sr-only sm:grid sm:gap-space-3 sm:pb-space-2 ${columnsClass}`}>
        {columns.map((column) => (
          <span key={column} role="columnheader" className="text-label leading-snug text-ink/72">
            {column}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          role="row"
          className={`grid gap-space-1 rounded-lg border border-ink/10 bg-surface p-space-2 sm:gap-space-3 sm:rounded-none sm:border-x-0 sm:border-b-0 sm:bg-transparent sm:px-0 sm:py-space-2 ${columnsClass}`}
        >
          <span role="rowheader" className="text-body text-ink">
            {row.label}
          </span>
          {row.cells.map((cell, i) => (
            <div key={i} role="cell" className="text-body text-ink sm:text-ink/72">
              <span aria-hidden="true" className="block text-label leading-snug text-ink/72 sm:hidden">
                {columns[i + 1]}
              </span>
              <span className="mt-1 block sm:mt-0">{cell}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
