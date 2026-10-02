import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { LineIcon } from "@/components/ui/LineIcon";
import { textH2, textWordmark } from "@/lib/type";
import { EMAIL, LINKEDIN_URL, NAV_LINKS, RESUME_PDF, SOURCE_REPO } from "@/lib/links";

const link = "inline-flex items-center gap-space-1 py-1 hover:underline focus-visible:underline";

/**
 * A flat `primary` band with `on-header` text: a closing statement with its
 * CTAs, the wordmark and link columns, then a bottom bar.
 *
 * Every text node stays at full `text-on-header`. The faded opacities that
 * pass on the header gradient fail WCAG AA on this flatter, darker
 * `primary` (even `/90` measured 4.44:1), so hierarchy comes from size,
 * order, and spacing instead.
 *
 * Column headings use the flat 20px `text-h5`: the responsive h5 steps down
 * to 14px on phones, below the 16px links under it.
 *
 * The closing statement also appears on `/contact`, as the footer's contact
 * links do. That repetition is intentional.
 */
export function Footer() {
  return (
    <footer className="bg-primary text-on-header">
      <div className="mx-auto grid max-w-6xl gap-space-4 px-space-3 py-space-7 md:grid-cols-[3fr_2fr] md:items-end">
        <p className={textH2}>Working through something difficult? I’d like to hear about it.</p>
        <div className="flex flex-wrap gap-space-2 md:justify-end">
          <Button href="/contact">Get in touch</Button>
          <Button href={`mailto:${EMAIL}`} variant="bordered-inverse">
            Email me
          </Button>
        </div>
      </div>

      <div className="border-t border-on-header/20">
        <div className="mx-auto grid max-w-6xl gap-space-5 px-space-3 py-space-6 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="rounded-sm focus-visible:outline-offset-4" aria-label="Christian Crawford — home">
              <span className={textWordmark}>Christian Crawford</span>
            </Link>
            <p className="mt-space-3 max-w-xs text-body">
              Based in Cincinnati. Open to remote roles, or hybrid locally.
            </p>
          </div>

          <div>
            <p className="text-h5">Contact</p>
            <ul className="mt-space-2 space-y-space-1 text-body">
              <li>
                <a href={`mailto:${EMAIL}`} className={link}>
                  <LineIcon name="mail" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <ExternalLink href={LINKEDIN_URL} className={link}>
                  <LineIcon name="external" />
                  LinkedIn
                </ExternalLink>
              </li>
              <li>
                <a href={RESUME_PDF} className={link}>
                  <LineIcon name="download" />
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer">
            <p className="text-h5">Site</p>
            <ul className="mt-space-2 space-y-space-1 text-body">
              {NAV_LINKS.map(({ href, label }) => (
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
            <ExternalLink href={SOURCE_REPO} className="hover:underline focus-visible:underline">
              Source on GitHub
            </ExternalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
