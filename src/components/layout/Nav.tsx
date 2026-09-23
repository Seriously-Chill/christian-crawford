"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Real DS behavior (Header/README.md): flat top-level items, exact order
 * and label, default `on-header` (white @ ~60% opacity), current route +
 * hover/focus go fully opaque. Below the header breakpoint the nav collapses
 * behind a toggle; opening it reveals the same links stacked, full-width,
 * over the same gradient — no dropdown, no invented items. Four routes
 * (Home/Work/About/Contact) per the approved site architecture;
 * `/work/healthwarehouse` is reached from `/work`, not top-level nav.
 */
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile panel on route change so a link tap doesn't leave it
  // open — derived during render (React's "adjusting state on prop change"
  // pattern) rather than an effect, since it's not synchronizing with
  // anything external.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Real transition is .4s (custom-pro-widget-nav-menu.min.css:
  // .elementor-nav-menu--main .elementor-nav-menu a{transition:.4s}) —
  // was wrongly 150ms in an earlier pass.
  const linkClasses = (active: boolean) =>
    `text-label transition-opacity duration-400 ${
      active ? "text-on-header opacity-100 font-medium" : "text-on-header opacity-60 hover:opacity-100 focus-visible:opacity-100"
    }`;

  return (
    <>
      <ul className="hidden items-center gap-space-4 lg:flex">
        {links.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={linkClasses(active)}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.25 rounded-sm lg:hidden focus-visible:outline-offset-4"
      >
        <span
          aria-hidden="true"
          className={`h-0.5 w-6 bg-on-header transition-transform duration-150 ${open ? "translate-y-1.75 rotate-45" : ""}`}
        />
        <span aria-hidden="true" className={`h-0.5 w-6 bg-on-header transition-opacity duration-150 ${open ? "opacity-0" : ""}`} />
        <span
          aria-hidden="true"
          className={`h-0.5 w-6 bg-on-header transition-transform duration-150 ${open ? "-translate-y-1.75 -rotate-45" : ""}`}
        />
      </button>

      <div
        id="mobile-nav-panel"
        className={`absolute left-0 top-full w-full bg-header-gradient lg:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-space-1 px-space-3 py-space-3">
          {links.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`block py-space-1 text-h5 ${linkClasses(active)}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
