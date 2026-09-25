"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { textH3 } from "@/lib/type";

/**
 * Real DS behavior (Header/README.md): flat top-level items, exact order
 * and label, default `on-header` (ink @ 80% opacity, so it keeps 4.5:1), current route +
 * hover/focus go fully opaque. Below the header breakpoint the nav collapses
 * behind a toggle; opening it reveals the same links stacked, full-width,
 * over the same gradient (blurred, so the page doesn't read through), at
 * h3 size with a dot marking the current page. The links fade down in
 * sequence, and the header's curved bottom edge moves down to the
 * panel's while it's open — no dropdown, no invented items. Five routes
 * (Home/Work/AI/About/Contact) per the approved site architecture;
 * `/work/healthwarehouse` is reached from `/work`, not top-level nav.
 */
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/ai", label: "AI" },
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
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile panel on route change so a link tap doesn't leave it
  // open — derived during render (React's "adjusting state on prop change"
  // pattern) rather than an effect, since it's not synchronizing with
  // anything external.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape closes the open panel from anywhere, and hands focus back to
  // the toggle so it doesn't drop to <body> when the links go inert.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Real transition is .4s (custom-pro-widget-nav-menu.min.css:
  // .elementor-nav-menu--main .elementor-nav-menu a{transition:.4s}) —
  // was wrongly 150ms in an earlier pass.
  const linkClasses = (active: boolean) =>
    `text-label transition-opacity duration-400 ${
      active
        ? "text-on-header opacity-100 font-medium"
        : "text-on-header opacity-80 hover:opacity-100 focus-visible:opacity-100"
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
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.25 rounded-sm lg:hidden focus-visible:outline-offset-4"
      >
        <span
          aria-hidden="true"
          className={`h-0.5 w-6 bg-on-header transition-transform duration-300 ease-accordion ${open ? "translate-y-1.75 rotate-45" : ""}`}
        />
        <span
          aria-hidden="true"
          className={`h-0.5 w-6 bg-on-header transition-opacity duration-300 ease-accordion ${open ? "opacity-0" : ""}`}
        />
        <span
          aria-hidden="true"
          className={`h-0.5 w-6 bg-on-header transition-transform duration-300 ease-accordion ${open ? "-translate-y-1.75 -rotate-45" : ""}`}
        />
      </button>

      {/* Always rendered so it can animate both ways; `inert` keeps the
          closed panel out of the tab order and the accessibility tree.
          `data-nav-open` also lets globals.css move the header's curved
          bottom edge down onto this panel while it's open. */}
      <div
        id="mobile-nav-panel"
        data-nav-open={open ? "" : undefined}
        inert={!open}
        className={`mobile-nav-panel absolute left-0 top-full w-full lg:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-space-3 pt-space-2 pb-space-6">
          {links.map(({ href, label }, i) => {
            const active = isActive(pathname, href);
            return (
              <li
                key={href}
                className="transition-[opacity,translate] duration-400 ease-accordion"
                style={{
                  opacity: open ? 1 : 0,
                  translate: open ? "0 0" : "0 -8px",
                  transitionDelay: open ? `${80 + i * 50}ms` : "0ms",
                }}
              >
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-space-2 py-space-1 text-on-header transition-opacity duration-400 ${textH3} ${
                    active ? "opacity-100" : "opacity-70 hover:opacity-100 focus-visible:opacity-100"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full bg-on-header transition-transform duration-400 ${
                      active ? "scale-100" : "scale-0"
                    }`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <svg
          aria-hidden="true"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 block h-full w-full"
        >
          <path
            d="M0,100 Q100,94 200,100"
            fill="none"
            stroke="color-mix(in srgb, var(--color-on-header) 10%, transparent)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </>
  );
}
