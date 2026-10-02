import type { ReactNode } from "react";

/**
 * A link to another site, opened in a new tab. Screen readers hear "opens
 * in a new tab" after the visible text, so the accessible name still starts
 * with what's on screen (WCAG 2.5.3).
 */
export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
