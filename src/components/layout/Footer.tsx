import Link from "next/link";

/**
 * DS behavior adapted: Footer/README documents a nav column repeating the
 * primary nav on every route. This site has no address/phone/social to
 * echo (that content belongs to igel.ua, not this portfolio — see the DS
 * export's own README), so only the real part of that pattern — the
 * repeated nav, for redundancy on a page a visitor lands on mid-scroll —
 * carries over.
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
    <footer className="border-t border-ink/10 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-space-3 px-space-3 py-space-4 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-space-3 gap-y-space-1 text-label text-ink/72">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-ink focus-visible:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-label text-ink/60">© {new Date().getFullYear()} Christian Crawford.</p>
      </div>
    </footer>
  );
}
