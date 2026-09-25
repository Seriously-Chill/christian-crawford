import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { textH2 } from "@/lib/type";

/**
 * The homepage's narrative beats (Work/Systems/About/Thinking) each get a
 * condensed teaser here rather than their full section content — the full
 * versions live on their own routes. Keeps the homepage introducing the
 * site instead of duplicating it.
 *
 * `onGradient`: the real Home page has its hero *and* its first content
 * grid both sitting directly on the page's gradient canvas (confirmed by
 * rendering, see globals.css) before the first white panel — this teaser
 * is the Work beat, so it gets the same treatment (white text and an
 * explicit `bg-page-gradient`) instead of the plain white panel the other
 * three beats use. The background lives on the full-width outer
 * `<section>`, not the `max-w-5xl` inner content — painting the gradient
 * on the narrower column would restart its 0%→100% interpolation at the
 * column's own edges instead of continuing the body's full-width
 * gradient underneath, producing a visible seam at the margins.
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
