import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { textH2 } from "@/lib/type";

/**
 * A condensed teaser for one of the homepage's narrative beats. The full
 * content lives on its own route, so Home introduces the site instead of
 * duplicating it.
 *
 * `onGradient` sets the teaser on the page gradient with `on-header` text.
 * The background goes on the full-width `<section>`, not the `max-w-5xl`
 * column, for the same reason as in `Opening`.
 */
export function NarrativeTeaser({
  kicker,
  title,
  body,
  href,
  linkLabel,
  onGradient = false,
  children,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  onGradient?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={onGradient ? "bg-page-gradient" : "bg-surface"}>
      <div className="mx-auto max-w-5xl px-space-3 py-space-6">
        <RevealOnScroll>
          <p className={`text-label ${onGradient ? "text-on-header/80" : "text-accent"}`}>{kicker}</p>
          <h2 className={`mt-space-2 max-w-2xl lg:mt-space-3 ${onGradient ? "text-on-header" : "text-accent"} ${textH2}`}>{title}</h2>
          <p className={`mt-space-3 max-w-xl text-body lg:mt-space-4 ${onGradient ? "text-on-header/80" : "text-ink/72"}`}>{body}</p>
        </RevealOnScroll>

        {children}

        <RevealOnScroll className="mt-space-4">
          <Button href={href} variant={onGradient ? "bordered-inverse" : "bordered"}>
            {linkLabel}
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
