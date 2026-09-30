import Image, { type StaticImageData } from "next/image";
import healthwarehouse from "@/assets/work/healthwarehouse.webp";
import springmeds from "@/assets/work/springmeds.webp";
import pharmcorx from "@/assets/work/pharmcorx.webp";
import { textH5 } from "@/lib/type";

const brands: { name: string; href: string; host: string; image: StaticImageData; alt: string }[] = [
  {
    name: "HealthWarehouse",
    href: "https://www.healthwarehouse.com/",
    host: "healthwarehouse.com",
    image: healthwarehouse,
    alt: "HealthWarehouse homepage: green logo, Montserrat type, an orange search button, and square-cornered search chips.",
  },
  {
    name: "SpringMeds",
    href: "https://www.springmeds.com/",
    host: "springmeds.com",
    image: springmeds,
    alt: "SpringMeds homepage: the same header, search, and chips as HealthWarehouse, in green over a photo of leaves.",
  },
  {
    name: "PharmcoRx",
    href: "https://pharmcorx.healthwarehouse.com/",
    host: "pharmcorx.healthwarehouse.com",
    image: pharmcorx,
    alt: "PharmcoRx homepage: its own header and a split hero with a slab-serif headline, Inter body type, and pill-shaped buttons.",
  },
];

/**
 * HealthWarehouse case study: the three live homepages side by side, the
 * visual proof that one codebase carries three brands. Screenshots are the
 * top of each homepage at 1280px, captured September 2026 with cookie
 * banners dismissed; they will drift from the live sites over time.
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
              className="h-auto w-full rounded-lg border border-ink/15"
            />
            <h3 className={`mt-space-2 text-ink ${textH5}`}>{brand.name}</h3>
            <a
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block break-all text-body text-ink/72 underline underline-offset-4 hover:text-accent"
            >
              {brand.host}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <figcaption id="brand-screens-caption" className="mt-space-3 max-w-2xl text-body text-ink/72">
        The live homepages, September 2026. HealthWarehouse and SpringMeds differ mostly by config;
        PharmcoRx&apos;s header, footer, and homepage are per-brand components on the same
        platform.
      </figcaption>
    </figure>
  );
}
