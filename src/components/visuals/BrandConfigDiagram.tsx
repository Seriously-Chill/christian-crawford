import Link from "next/link";
import { textH5 } from "@/lib/type";

// The 18 feature flags every brand config declares, in the configs' own
// order, as each brand sets them (1 = on). Same keys, different values: the
// whole point. Read from the three config files, not made up.
const brands = [
  {
    flags: "110111001111111011",
    face: "font-sans",
    button: "bg-accent rounded-[3px]",
    logo: "bg-accent",
  },
  {
    flags: "000100000000001001",
    face: "font-sans",
    button: "border-2 border-accent rounded-[3px]",
    logo: "border-2 border-accent",
  },
  {
    // Brand three: its own display face (a slab serif, drawn here with the
    // system serif), pill buttons, and rounder corners.
    flags: "000101000000001001",
    face: "font-serif",
    button: "bg-ink rounded-pill",
    logo: "bg-ink",
  },
];

const perBrand = ["Colors", "Typefaces", "Corners", "18 feature flags", "Logos and copy"];

function BrandSite({ brand }: { brand: (typeof brands)[number] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md bg-surface p-2 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)] sm:gap-2 sm:p-space-2">
      <span className={`h-2 w-1/2 rounded-pill ${brand.logo}`} />
      <span className={`mt-1 text-[22px] leading-none text-ink sm:text-[28px] ${brand.face}`}>Aa</span>
      <span className="h-1 w-full rounded-pill bg-ink/10" />
      <span className="h-1 w-3/4 rounded-pill bg-ink/10" />
      <span className={`mt-1 h-3 w-2/3 sm:h-4 ${brand.button}`} />
      <span className="mt-1 grid grid-cols-9 gap-0.5 sm:gap-0.75">
        {[...brand.flags].map((on, i) => (
          <span key={i} className={`aspect-square rounded-circle ${on === "1" ? "bg-ink/70" : "bg-ink/10"}`} />
        ))}
      </span>
    </div>
  );
}

/**
 * Home's hero figure, and the site's thesis drawn from real work: three
 * pharmacy brands converging on one codebase, with what each brand's config
 * carries in between. It sits on the hero's glass panel, so its lines and
 * text use the on-header colors; the one strong edge is the shared
 * codebase, where the drawing leads.
 *
 * The miniature sites are decorative (`aria-hidden`); the sr-only line and
 * the visible text carry the same facts. Their brand colors are `accent`,
 * so they follow the color picker: the site's own theme config, standing in
 * for a brand's.
 */
export function BrandConfigDiagram() {
  return (
    <figure aria-labelledby="brand-config-caption" className="text-on-header">
      <p className="text-label text-on-header-muted">Three pharmacy brands</p>
      <p className="sr-only">
        Three brand sites. Two share a typeface and square corners; the third has its own
        typefaces, pill buttons and rounder corners. Each has its own colors, and each switches
        the same 18 feature flags on or off differently.
      </p>
      <div aria-hidden="true" className="mt-space-2 grid grid-cols-3 gap-space-1 sm:gap-space-2">
        {brands.map((brand, i) => (
          <BrandSite key={i} brand={brand} />
        ))}
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        className="block h-7 w-full text-on-header-line sm:h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M50 0C50 24 150 16 150 40M150 0v40M250 0C250 24 150 16 150 40" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="rounded-lg border border-on-header-line px-space-2 py-space-2">
        <p className="text-label text-on-header">Each brand’s config</p>
        <p className="mt-1 text-sm leading-snug text-on-header-muted">{perBrand.join(" · ")}</p>
      </div>
      <span aria-hidden="true" className="mx-auto block h-space-2 w-px bg-on-header-line" />
      <div className="rounded-lg border-2 border-on-header px-space-2 py-space-2">
        <p className={`text-on-header ${textH5}`}>One shared codebase</p>
        <p className="mt-1 text-sm leading-snug text-on-header">
          Every form and checkout step. 7 components pick a per-brand version; ~270 are shared.
        </p>
      </div>
      <figcaption id="brand-config-caption" className="mt-space-2 text-sm leading-snug text-on-header-muted">
        From the HealthWarehouse platform’s three brand configs: the same keys, set differently.
        Dots are the flags.{" "}
        <Link href="/work/healthwarehouse#architecture" className="text-on-header underline underline-offset-2">
          See the architecture
        </Link>
      </figcaption>
    </figure>
  );
}
