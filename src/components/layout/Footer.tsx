import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LineIcon } from "@/components/ui/LineIcon";
import { textH2, textH3 } from "@/lib/type";
import { SOURCE_REPO } from "@/lib/links";

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
 * Three tiers, top to bottom, so the footer has real hierarchy rather than
 * one flat run of 16px labels: the closing statement at `h2` scale with
 * its CTAs (the page's last big moment, not squeezed between link
 * columns); the brand block and link columns, with the wordmark set large
 * in the header's own light style (standing in for the reference's large
 * footer mark) and `h5` column headings as the reference uses (the flat
 * 20px `text-h5`, since the responsive h5 steps down to 14px on phones,
 * below the 16px links under it); then the
 * bottom bar split left/right like the reference's copyright / "made by"
 * line. `/contact` still gets its own dedicated closing section; the
 * statement repeating there is consistent with the footer's contact links
 * already intentionally repeating on that page.
 */
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/ai", label: "AI" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const link = "inline-flex items-center gap-space-1 py-1 hover:underline focus-visible:underline";

export function Footer() {
  return (
    <footer className="bg-primary text-on-header">
      <div className="mx-auto grid max-w-6xl gap-space-4 px-space-3 py-space-7 md:grid-cols-[3fr_2fr] md:items-end">
        <p className={textH2}>Working through something difficult? I&apos;d like to hear about it.</p>
        <div className="flex flex-wrap gap-space-2 md:justify-end">
          <Button href="/contact">Get in touch</Button>
          <Button href="mailto:christian.crawford@pm.me" variant="bordered-inverse">
            Email me
          </Button>
        </div>
      </div>

      <div className="border-t border-on-header/20">
        <div className="mx-auto grid max-w-6xl gap-space-5 px-space-3 py-space-6 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="rounded-sm focus-visible:outline-offset-4" aria-label="Christian Crawford — home">
              <span className={textH3.replace("font-medium", "font-light")}>Christian Crawford</span>
            </Link>
            <p className="mt-space-3 max-w-xs text-body">
              Based in Cincinnati. Open to remote roles, or hybrid locally.
            </p>
          </div>

          <div>
            <p className="text-h5">Contact</p>
            <ul className="mt-space-2 space-y-space-1 text-body">
              <li>
                <a href="mailto:christian.crawford@pm.me" className={link}>
                  <LineIcon name="mail" />
                  christian.crawford@pm.me
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/christiancrawford"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  <LineIcon name="external" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer">
            <p className="text-h5">Site</p>
            <ul className="mt-space-2 space-y-space-1 text-body">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-on-header/20">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-space-2 px-space-3 py-space-3 text-label">
          <p>© {new Date().getFullYear()} Christian Crawford.</p>
          <div className="flex flex-wrap gap-space-3">
            <Link href="/ai#built" className="hover:underline focus-visible:underline">
              How this site is built
            </Link>
            <a
              href={SOURCE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source on GitHub (opens in a new tab)"
              className="hover:underline focus-visible:underline"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
