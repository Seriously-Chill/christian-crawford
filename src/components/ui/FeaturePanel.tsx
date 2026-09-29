import type { ReactNode } from "react";

/**
 * A contained panel on a white section that lifts one idea above the
 * running text around it.
 */
export function FeaturePanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid items-center gap-space-4 rounded-xl bg-surface-raised p-space-3 sm:p-space-5 md:grid-cols-2 md:gap-space-5 ${className}`}
    >
      {children}
    </div>
  );
}
