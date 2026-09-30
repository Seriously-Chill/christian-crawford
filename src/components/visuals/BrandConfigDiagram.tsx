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

const perBrand = ["Colors", "Typefaces", "Corner radius", "18 feature flags", "Logos and copy"];

function BrandSite({ brand }: { brand: (typeof brands)[number] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-ink/15 bg-surface p-2 sm:gap-2 sm:p-space-2">
      <span className={`h-2 w-1/2 rounded-pill ${brand.logo}`} />
      <span className={`mt-1 text-[22px] leading-none text-ink sm:text-[30px] ${brand.face}`}>Aa</span>
      <span className="h-1 w-full rounded-pill bg-ink/10" />
      <span className="h-1 w-3/4 rounded-pill bg-ink/10" />
      <span className={`mt-1 h-3 w-2/3 sm:h-5 ${brand.button}`} />
      <span className="mt-1 grid grid-cols-9 gap-[2px] sm:grid-cols-[repeat(18,minmax(0,1fr))] sm:gap-[3px]">
        {[...brand.flags].map((on, i) => (
          <span key={i} className={`aspect-square rounded-circle ${on === "1" ? "bg-ink/70" : "bg-ink/10"}`} />
        ))}
      </span>
    </div>
  );
}

/**
 * Home's architecture proof: three brand sites converging on one codebase,
 * with what each brand's config carries in between. The miniature sites are
 * decorative (`aria-hidden`); the sr-only line and the visible text carry the
 * same facts. Drawn in HTML and token colors like `DifferenceRouting`, so it
 * follows the picker themes. Brands stay unnamed, as on the case study.
 */
export function BrandConfigDiagram() {
  return (
    <figure aria-labelledby="brand-config-caption">
      <p className="text-label text-ink/72">Three brands</p>
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
        className="block h-8 w-full text-ink/30 sm:h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M50 0C50 24 150 16 150 40M150 0v40M250 0C250 24 150 16 150 40" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="rounded-lg border border-ink/10 bg-surface p-space-2 sm:p-space-3">
        <p className="text-label text-ink">What each brand&apos;s config carries</p>
        <ul className="mt-space-2 flex flex-wrap gap-space-1">
          {perBrand.map((item) => (
            <li key={item} className="rounded-pill border border-ink/15 px-space-2 py-1 text-label text-ink/72">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-space-1 rounded-lg border border-accent bg-surface p-space-2 sm:p-space-3">
        <p className={`text-ink ${textH5}`}>One shared codebase</p>
        <p className="mt-1 text-body text-ink/72">
          Every form and checkout step. Seven components pick a per-brand version; the other ~270
          are shared.
        </p>
      </div>
      <figcaption id="brand-config-caption" className="mt-space-3 text-label leading-normal text-ink/72">
        Drawn from the three brand configs: the same keys, set differently. Dots are the flags, on
        or off.
      </figcaption>
    </figure>
  );
}
