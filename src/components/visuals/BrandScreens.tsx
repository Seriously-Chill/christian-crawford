import Image, { type StaticImageData } from "next/image";
import healthwarehouse from "@/assets/work/healthwarehouse.webp";
import springmeds from "@/assets/work/springmeds.webp";
import pharmcorx from "@/assets/work/pharmcorx.webp";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { textH5 } from "@/lib/type";
import { FigureCaption } from "@/components/visuals/FigureCaption";

// `site` is left out where the public URL isn't settled yet; the card shows TBD.
const brands: {
  name: string;
  site?: { href: string; host: string };
  image: StaticImageData;
  alt: string;
}[] = [
  {
    name: "HealthWarehouse",
    site: { href: "https://www.healthwarehouse.com/", host: "healthwarehouse.com" },
    image: healthwarehouse,
    alt: "HealthWarehouse homepage: green logo, Montserrat type, an orange search button, and square-cornered search chips.",
  },
  {
    name: "SpringMeds",
    site: { href: "https://www.springmeds.com/", host: "springmeds.com" },
    image: springmeds,
    alt: "SpringMeds homepage: the same header, search, and chips as HealthWarehouse, in green over a photo of leaves.",
  },
  {
    name: "PharmcoRx",
    image: pharmcorx,
    alt: "PharmcoRx homepage: its own header and a split hero with a slab-serif headline, Inter body type, and pill-shaped buttons.",
  },
];

/**
 * HealthWarehouse case study: the three brands' homepages side by side (two
 * live, PharmcoRx not launched yet), the visual proof that one codebase
 * carries three brands. Screenshots are the top of each homepage at 1280px,
 * captured September 2026 with cookie banners dismissed; they will drift
 * from the sites over time.
 */
export function BrandScreens() {
  return (
    <figure aria-labelledby="brand-screens-caption">
      <ul className="grid gap-space-4 sm:grid-cols-3 sm:gap-space-3">
        {brands.map((brand) => (
          <li key={brand.name}>
            <Image
              src={brand.image}
              alt={brand.alt}
              sizes="(min-width: 640px) 33vw, 100vw"
              className="h-auto w-full rounded-lg border border-line"
            />
            <h3 className={`mt-space-2 text-ink ${textH5}`}>{brand.name}</h3>
            {brand.site ? (
              <ExternalLink
                href={brand.site.href}
                className="mt-1 inline-block break-all text-body text-muted underline underline-offset-4 hover:text-accent"
              >
                {brand.site.host}
              </ExternalLink>
            ) : (
              <p className="mt-1 text-body text-muted">TBD</p>
            )}
          </li>
        ))}
      </ul>
      <FigureCaption id="brand-screens-caption">
        The homepages, September 2026. HealthWarehouse and SpringMeds are live and differ mostly by
        config. PharmcoRx is built but not launched yet; its header, footer, and homepage are
        per-brand components on the same platform.
      </FigureCaption>
    </figure>
  );
}
