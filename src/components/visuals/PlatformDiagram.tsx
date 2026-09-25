import { textH5 } from "@/lib/type";

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 24"
      className="mx-auto my-space-1 h-6 w-4 text-ink/40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 22V4M3 9l5-5 5 5" />
    </svg>
  );
}

/**
 * HealthWarehouse architecture diagram, drawn the same way as `/ai`'s
 * GovernanceFlow: HTML boxes and arrows, so every label stays real text at
 * every width and follows the picker themes. Read bottom-up, the way the
 * platform is built: one shared core, configuration and feature flags on
 * top of it, and each brand's site on top of that. There are three brands;
 * their names are left out.
 */
export function PlatformDiagram() {
  return (
    <figure aria-labelledby="platform-diagram-caption" className="mx-auto max-w-3xl">
      <ol className="flex flex-col-reverse">
        <li className="rounded-lg border border-accent bg-surface-raised p-space-2 text-center sm:p-space-3">
          <h3 className={`text-ink ${textH5}`}>Shared core</h3>
          <p className="mt-1 text-body text-ink/72">
            One Next.js and React codebase: infrastructure, patterns, and the design system every
            brand uses.
          </p>
        </li>
        <li>
          <Arrow />
          <div className="rounded-lg border border-ink/10 bg-surface-raised p-space-2 text-center sm:p-space-3">
            <h3 className={`text-ink ${textH5}`}>Configuration and feature flags</h3>
            <p className="mt-1 text-body text-ink/72">
              Carry each brand&apos;s own behavior, and turn variation on and off without splitting
              the code.
            </p>
          </div>
          <Arrow />
        </li>
        <li>
          <h3 className="sr-only">Brand layer</h3>
          <p className="sr-only">Each pharmacy brand&apos;s site, built on the same core.</p>
          <div aria-hidden="true" className="grid grid-cols-3 gap-space-2">
            {["Brand", "Brand", "Brand"].map((label, i) => (
              <div key={i} className="rounded-lg border border-ink/10 bg-surface p-space-2 text-center sm:p-space-3">
                <p className={`text-ink ${textH5}`}>{label}</p>
                <p className="mt-1 text-label text-ink/60">own site</p>
              </div>
            ))}
          </div>
        </li>
      </ol>
      <figcaption id="platform-diagram-caption" className="mt-space-3 text-center text-body text-ink/72">
        Built bottom-up: all three brands run on the same core, and configuration carries what differs.
      </figcaption>
    </figure>
  );
}
