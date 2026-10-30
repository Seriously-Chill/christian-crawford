import { CurveDivider } from "@/components/visuals/CurveDivider";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { LineIcon } from "@/components/ui/LineIcon";
import { EMAIL, LINKEDIN_URL, RESUME_PDF } from "@/lib/links";
import { textH1, textH5 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

const row = "flex items-start gap-space-2 py-space-3 text-left";
const linkRow = `${row} underline-offset-4 transition-colors duration-hover hover:underline`;

/**
 * On the header's gradient. Contact routes sit in an open list with rules,
 * rather than four matching tiles; the three reachable ones link straight through.
 */
export function Contact() {
  return (
    <Section
      ground="header-gradient"
      spacing="lg"
      after={<CurveDivider above="gradient-header" below="primary" />}
    >
      <h1 className={`text-on-header ${textH1}`}>
        Let’s talk about what you’re building.
      </h1>
      <p className="mt-space-3 max-w-xl text-body text-on-header-muted">
        Open to senior frontend and frontend architecture roles: remote, or hybrid in Cincinnati.
      </p>
      <ul className="mt-space-5 grid border-t border-on-header-line sm:grid-cols-2 sm:gap-x-space-5">
        <li className="border-b border-on-header-line">
          <a href={`mailto:${EMAIL}`} className={linkRow}>
            <LineIcon name="mail" />
            <span>
              <span className={`block text-on-header ${textH5}`}>Email</span>
              <span className="mt-1 block text-body text-on-header-muted wrap-break-word">
                christian.crawford<wbr />@pm.me
              </span>
            </span>
          </a>
        </li>
        <li className="border-b border-on-header-line">
          <ExternalLink href={LINKEDIN_URL} className={linkRow}>
            <LineIcon name="external" />
            <span>
              <span className={`block text-on-header ${textH5}`}>LinkedIn</span>
              <span className="mt-1 block text-body text-on-header-muted">in/christiancrawford</span>
            </span>
          </ExternalLink>
        </li>
        <li className="border-b border-on-header-line">
          <a href={RESUME_PDF} className={linkRow}>
            <LineIcon name="download" />
            <span>
              <span className={`block text-on-header ${textH5}`}>Résumé</span>
              <span className="mt-1 block text-body text-on-header-muted">Download the PDF</span>
            </span>
          </a>
        </li>
        <li className="border-b border-on-header-line">
          <div className={row}>
            <LineIcon name="pin" />
            <span>
              <span className={`block text-on-header ${textH5}`}>Based in</span>
              <span className="mt-1 block text-body text-on-header-muted">Cincinnati, Ohio</span>
            </span>
          </div>
        </li>
      </ul>
    </Section>
  );
}
