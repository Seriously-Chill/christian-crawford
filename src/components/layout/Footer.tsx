import Image from "next/image";
import Link from "next/link";

/**
 * Correction, confirmed by rendering the real page (a text-only CSS read
 * missed this entirely): the real footer is a solid, flat `primary` blue
 * band with white text — not a neutral white utility bar, and not a
 * gradient either. Footer/README's "nav column repeating the primary
 * nav" is real and carries over; the address/phone/social/retailer
 * content docked above it on the source doesn't (belongs to igel.ua, not
 * this portfolio — see the DS export's own README).
 *
 * Text opacity: the header/CTA gradient's lighter, cyan-leaning half
 * gives `on-header/72` and `/60` enough contrast, but the same opacity
 * against this flat, darker `primary` fails WCAG AA (axe caught this at
 * 3.43:1 / 2.84:1, and even `/90` still only reached 4.44:1 — against
 * the required 4.5:1) — full opacity clears it at ~5.1:1.
 */
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/systems", label: "Systems" },
  { href: "/about", label: "About" },
  { href: "/thinking", label: "Thinking" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-space-4 px-space-3 py-space-5 sm:flex-row sm:items-start sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5 rounded-sm focus-visible:outline-offset-4" aria-label="Christian Crawford — home">
          <Image src="/logo-mark.svg" alt="" width={26} height={31} />
          <span className="text-label text-on-header">Christian Crawford</span>
        </Link>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-space-3 gap-y-space-1 text-label text-on-header">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:underline focus-visible:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-on-header/20">
        <div className="mx-auto max-w-6xl px-space-3 py-space-3">
          <p className="text-label text-on-header">© {new Date().getFullYear()} Christian Crawford.</p>
        </div>
      </div>
    </footer>
  );
}
