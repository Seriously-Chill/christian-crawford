import Link from "next/link";
import type { ReactNode } from "react";
import { textH1 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

/**
 * The top of every inner page: breadcrumb, kicker, h1, and an optional
 * tagline on the page gradient, followed by white body content. Home's
 * full-viewport `Opening` is the one exception. `logo` is an optional mark
 * (e.g. a case study's employer) shown above the kicker.
 */
export function PageIntro({
  breadcrumb,
  kicker,
  title,
  tagline,
  meta,
  logo,
}: {
  breadcrumb: string;
  kicker: string;
  title: string;
  tagline?: string;
  meta?: { label: string; value: string }[];
  logo?: ReactNode;
}) {
  return (
    <Section ground="gradient">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-space-1 text-label text-on-header-muted">
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
      {logo ? <div className="mt-space-4 flex text-on-header">{logo}</div> : null}
      <p className={`${logo ? "mt-space-3" : "mt-space-4"} text-label text-on-header-muted`}>{kicker}</p>
      <h1 className={`mt-space-2 max-w-[15em] text-on-header lg:mt-space-3 ${textH1}`}>{title}</h1>
      {tagline ? <p className="mt-space-3 max-w-xl lg:mt-space-4 text-body text-on-header-muted">{tagline}</p> : null}
      {meta ? (
        <dl className="mt-space-4 flex flex-wrap gap-space-4">
          {meta.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-label text-on-header-muted">{label}</dt>
              <dd className="mt-1 text-body text-on-header">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Section>
  );
}
