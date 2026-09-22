import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { textH2 } from "@/lib/type";

/**
 * The homepage's narrative beats (Work/Systems/About/Thinking) each get a
 * condensed teaser here rather than their full section content — the full
 * versions live on their own routes. Keeps the homepage introducing the
 * site instead of duplicating it.
 */
export function NarrativeTeaser({
  kicker,
  title,
  body,
  href,
  linkLabel,
  children,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl px-space-3 py-space-6">
      <RevealOnScroll>
        <p className="text-label text-primary">{kicker}</p>
        <h2 className={`mt-space-2 max-w-2xl text-ink ${textH2}`}>{title}</h2>
        <p className="mt-space-3 max-w-xl text-body text-ink/72">{body}</p>
      </RevealOnScroll>

      {children}

      <RevealOnScroll delayMs={100} className="mt-space-4">
        <Button href={href} variant="bordered">
          {linkLabel}
        </Button>
      </RevealOnScroll>
    </section>
  );
}
