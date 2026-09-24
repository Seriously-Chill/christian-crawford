import Link from "next/link";
import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH2 } from "@/lib/type";

/**
 * Real layout, confirmed by rendering every inner page (Products,
 * Innovations, About, Contacts), not just Home: a short breadcrumb +
 * kicker + h1 (+ optional one-line tagline) strip sitting directly on the
 * page's gradient canvas, followed by white body content — not the
 * full-viewport hero this project briefly gave every page, and not a
 * plain white heading block either. Home's own hero (`Opening`) is the
 * one real exception (full-viewport, no breadcrumb) — this is for every
 * other page.
 *
 * `visual` is optional artwork beside the text, the same text-left /
 * render-right split Home's `Opening` uses. It stacks under the text below
 * `md`. Pages without one keep the single text column unchanged.
 */
export function PageIntro({
  breadcrumb,
  kicker,
  title,
  tagline,
  meta,
  visual,
}: {
  breadcrumb: string;
  kicker: string;
  title: string;
  tagline?: string;
  meta?: { label: string; value: string }[];
  visual?: ReactNode;
}) {
  return (
    <section className="bg-page-gradient">
      <div
        className={`mx-auto max-w-5xl px-space-3 py-space-6 ${
          visual ? "grid items-center gap-space-5 md:grid-cols-[3fr_2fr]" : ""
        }`}
      >
        <RevealOnScroll playOnLoad durationMs={2000}>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-space-1 text-label text-on-header/60">
              <li>
                <Link href="/" className="hover:text-on-header focus-visible:text-on-header">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li aria-current="page" className="text-on-header">
                {breadcrumb}
              </li>
            </ol>
          </nav>
          <p className="mt-space-4 text-label text-on-header/80">{kicker}</p>
          <h1 className={`mt-space-2 max-w-2xl text-on-header ${textH2}`}>{title}</h1>
          {tagline ? <p className="mt-space-3 max-w-xl text-body text-on-header/80">{tagline}</p> : null}
          {meta ? (
            <dl className="mt-space-4 flex flex-wrap gap-space-4">
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-label text-on-header/60">{label}</dt>
                  <dd className="mt-1 text-body text-on-header">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </RevealOnScroll>
        {visual ? (
          <RevealOnScroll playOnLoad durationMs={2000} delayMs={100} className="flex justify-center">
            {visual}
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
  );
}
