/**
 * Employer marks from `public/employers/` (sources in its README). The files
 * are white-on-transparent, so they're drawn as a CSS mask filled with
 * `currentColor` — the same technique as the header's logo mark — letting
 * one asset read as ink on white sections and `on-header` on the gradient,
 * and follow the color picker's themes.
 *
 * Logos differ a lot in proportion and stroke weight, so each carries an
 * optical `scale` against the shared base height (`--logo-h`) to keep a row
 * of them visually even rather than mathematically equal.
 */
const employers = {
  healthwarehouse: { name: "HealthWarehouse", src: "/employers/healthwarehouse-white.svg", ratio: 181 / 25, scale: 0.8 },
  ingage: { name: "Ingage Partners", src: "/employers/ingage-white.svg", ratio: 415 / 139, scale: 1.05 },
  kroger: { name: "Kroger", src: "/employers/kroger-white.svg", ratio: 141 / 53, scale: 1.15 },
  cbts: { name: "CBTS", src: "/employers/cbts-white.png", ratio: 442 / 171, scale: 0.78 },
  "cincinnati-bell": { name: "Cincinnati Bell", src: "/employers/cincinnati-bell-white.svg", ratio: 232 / 25, scale: 0.55 },
  trivantis: { name: "Trivantis", src: "/employers/trivantis-white.png", ratio: 288 / 48, scale: 0.55 },
  ginghamsburg: { name: "Ginghamsburg Church", src: "/employers/ginghamsburg-white.png", ratio: 245 / 41, scale: 0.8 },
} as const;

export type Employer = keyof typeof employers;

/**
 * Decorative by default: every placement sits next to the employer's name in
 * text, so the mark shouldn't be announced twice. Pass `labelled` where the
 * logo stands in for the name.
 */
export function EmployerLogo({
  employer,
  labelled = false,
  className = "",
}: {
  employer: Employer;
  labelled?: boolean;
  className?: string;
}) {
  const { name, src, ratio, scale } = employers[employer];
  return (
    <span
      {...(labelled ? { role: "img", "aria-label": name } : { "aria-hidden": true })}
      className={`inline-block shrink-0 bg-current mask-contain mask-left mask-no-repeat ${className}`}
      style={{
        height: `calc(var(--logo-h, 1.5rem) * ${scale})`,
        aspectRatio: ratio,
        maskImage: `url(${src})`,
      }}
    />
  );
}
