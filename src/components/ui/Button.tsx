import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "@/components/ui/ExternalLink";

/**
 * The site's one button shape is a pill. Don't add a square or radius-lg
 * variant.
 *
 *  - primary: surface fill, accent label; hover inverts
 *  - bordered: for a light ground
 *  - bordered-inverse: for a gradient or other colored ground
 *  - on-accent: primary's look on an `accent` fill (the AI banner).
 *    Primary's hover fill is `accent` itself, so there the pill would
 *    vanish into the ground; this one inverts to a surface outline
 *    instead, keeping its shape like every other button's hover.
 *
 * Every button on the site is a link. `external` opens it in a new tab
 * (`ExternalLink`).
 */
type Variant = "primary" | "bordered" | "bordered-inverse" | "on-accent";

const base =
  "inline-flex items-center justify-center rounded-pill px-[23px] py-[11px] text-label transition-colors duration-hover";

const variants: Record<Variant, string> = {
  primary: "bg-surface text-accent border border-button-edge hover:bg-accent hover:text-surface",
  bordered: "bg-transparent text-accent border border-accent hover:bg-accent hover:text-surface",
  "bordered-inverse": "bg-transparent text-on-header border border-on-header hover:bg-on-header hover:text-primary",
  "on-accent": "bg-surface text-accent border border-surface hover:bg-transparent hover:text-surface",
};

export function Button({
  href,
  variant = "primary",
  external = false,
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  children: ReactNode;
}) {
  const className = `${base} ${variants[variant]}`;
  if (external) {
    return (
      <ExternalLink href={href} className={className}>
        {children}
      </ExternalLink>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
