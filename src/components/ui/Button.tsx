import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

/**
 * The site's one button shape is a pill. Don't add a square or radius-lg
 * variant.
 *
 *  - primary: surface fill, accent label; hover inverts
 *  - bordered: for a light ground
 *  - bordered-inverse: for a gradient or other colored ground
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
