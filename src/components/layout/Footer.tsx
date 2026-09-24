import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { textH3 } from "@/lib/type";

/**
 * Correction, confirmed by rendering the real page (a text-only CSS read
 * missed this entirely): the real footer is a solid, flat `primary` blue
 * band with white text — not a neutral white utility bar, and not a
 * gradient either. Footer/README's real three-part layout (contact info /
 * nav columns / social) is reproduced here with our own info in place of
 * igel.ua's address/phone/social/retailer content, which belongs to that
 * site, not this portfolio.
 *
 * Text opacity: the header/CTA gradient's lighter, cyan-leaning half gives
 * `on-header/72` and `/60` enough contrast, but the same opacity against
 * this flat, darker `primary` fails WCAG AA (axe caught this at 3.43:1 /
 * 2.84:1, and even `/90` still only reached 4.44:1 — against the required
 * 4.5:1) — full opacity clears it at ~5.1:1. Every text node here stays at
 * full `text-on-header`; hierarchy comes from order/spacing, not fade.
 *
 * The closing statement + CTA (previously the separate `ClosingCta`
 * component, included per-page before this one) now lives here instead,
 * after the nav grid and before the copyright line — matching the
 * structural ordering of the iyO One reference's own footer (grouped nav,
 * then a large closing statement, right before the bottom bar) rather
 * than a standalone band before an unrelated nav footer. `/contact` still
 * gets its own dedicated closing section with the real email/LinkedIn
 * buttons; this statement repeating there too is consistent with this
 * footer's contact links already intentionally repeating on that page.
 */
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/ai", label: "AI" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary">
      <div className="mx-auto grid max-w-6xl gap-space-5 px-space-3 py-space-6 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-sm focus-visible:outline-offset-4"
            aria-label="Christian Crawford — home"
          >
            <span
              aria-hidden="true"
              className="block h-[31px] w-[26px] shrink-0 bg-on-header [mask:url(/logo-mark.svg)_center/contain_no-repeat]"
            />
            <span className="text-label text-on-header">
              Christian Crawford
            </span>
          </Link>
          <p className="mt-space-3 max-w-xs text-label text-on-header">
            Based in Cincinnati. Working wherever interesting problems are.
          </p>
        </div>

        <div>
          <p className="text-label text-on-header">Contact</p>
          <ul className="mt-space-2 space-y-space-1 text-label text-on-header">
            <li>
              <a
                href="mailto:christian.crawford@pm.me"
                className="inline-block py-1 hover:underline focus-visible:underline"
              >
                christian.crawford@pm.me
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/christiancrawford"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1 hover:underline focus-visible:underline"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <p className="text-label text-on-header">Site</p>
          <ul className="mt-space-2 space-y-space-1 text-label text-on-header">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block py-1 hover:underline focus-visible:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-on-header/20 py-space-6 text-center">
        <p className={`mx-auto max-w-xl px-space-3 text-on-header ${textH3}`}>
          Working through something difficult? I&apos;d like to hear about it.
        </p>
        <div className="mt-space-5">
          <Button href="/contact" variant="bordered-inverse">
            Get in touch
          </Button>
        </div>
      </div>
      <div className="border-t border-on-header/20">
        <div className="mx-auto max-w-6xl px-space-3 py-space-3">
          <p className="text-label text-on-header">
            © {new Date().getFullYear()} Christian Crawford.
          </p>
        </div>
      </div>
    </footer>
  );
}
