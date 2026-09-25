import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

/**
 * The Design System defines exactly one button shape sitewide: a pill
 * (radius-pill, 100px) with 12px/24px padding and a `label` text style.
 * There is no square or radius-lg variant anywhere in the source.
 *
 * Three real variants are documented across the source components:
 *  - primary: surface fill / primary label, hover inverts (Button preview.html)
 *  - bordered: transparent / primary border+label, for a light ground (Hero)
 *  - bordered-inverse: transparent / on-header border+label, for the
 *    header's own gradient (documented in ContactForm's README as the real
 *    submit-button treatment on a colored ground)
 *
 * Real hover transition is `.3s` (Elementor's own base button rule) — was
 * wrongly set to 150ms in an earlier pass; checked against the source CSS.
 */
type Variant = "primary" | "bordered" | "bordered-inverse";

const base =
  "inline-flex items-center justify-center rounded-pill text-label transition-colors duration-300";

const variants: Record<Variant, string> = {
  primary:
    "bg-surface text-accent border border-button-edge px-[23px] py-[11px] hover:bg-accent hover:text-surface",
  bordered:
    "bg-transparent text-accent border border-accent px-[23px] py-[11px] hover:bg-accent hover:text-surface",
  "bordered-inverse":
    "bg-transparent text-on-header border border-on-header px-[23px] py-[11px] hover:bg-on-header hover:text-primary",
};

type BaseProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

type LinkButtonProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

type NativeButtonProps = BaseProps & {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  disabled?: boolean;
};

export type ButtonProps = LinkButtonProps | NativeButtonProps;

function isLink(props: ButtonProps): props is LinkButtonProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const classes =
    `${base} ${variants[variant]} ${props.className ?? ""}`.trim();

  if (isLink(props)) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        aria-label={props["aria-label"]}
        className={classes}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
      className={classes}
    >
      {props.children}
    </button>
  );
}
