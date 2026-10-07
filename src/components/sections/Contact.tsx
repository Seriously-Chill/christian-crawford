import { CurveDivider } from "@/components/visuals/CurveDivider";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { LineIcon } from "@/components/ui/LineIcon";
import { EMAIL, LINKEDIN_URL, RESUME_PDF } from "@/lib/links";
import { textH1, textH5 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

const tile = "rounded-lg glass p-space-3 text-left";
const linkTile = `${tile} block transition-colors duration-hover hover:glass-lit`;

/**
 * On the header's gradient. Each contact detail is its own glass tile; the
 * three reachable ones link straight through.
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
      <ul className="mt-space-5 grid gap-space-3 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <a href={`mailto:${EMAIL}`} className={linkTile}>
            <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
              <LineIcon name="mail" />
              Email
            </span>
            <span className="mt-space-1 block text-body text-on-header-muted wrap-break-word">
              christian.crawford<wbr />@pm.me
            </span>
          </a>
        </li>
        <li>
          <ExternalLink href={LINKEDIN_URL} className={linkTile}>
            <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
              <LineIcon name="external" />
              LinkedIn
            </span>
            <span className="mt-space-1 block text-body text-on-header-muted">in/christiancrawford</span>
          </ExternalLink>
        </li>
        <li>
          <a href={RESUME_PDF} className={linkTile}>
            <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
              <LineIcon name="download" />
              Résumé
            </span>
            <span className="mt-space-1 block text-body text-on-header-muted">Download the PDF</span>
          </a>
        </li>
        <li className={tile}>
          <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
            <LineIcon name="pin" />
            Based in
          </span>
          <span className="mt-space-1 block text-body text-on-header-muted">Cincinnati, Ohio</span>
        </li>
      </ul>
    </Section>
  );
}
