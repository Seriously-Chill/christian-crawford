import Image from "next/image";
import healthwarehouse from "@/assets/work/healthwarehouse.webp";
import springmeds from "@/assets/work/springmeds.webp";
import pharmcorx from "@/assets/work/pharmcorx.webp";

/** Real product work in the opening: three brands with noticeably different voices. */
export function BrandScreensCollage() {
  return (
    <figure aria-label="Three pharmacy brand homepage designs">
      <div className="relative mx-auto aspect-[1.12] w-full max-w-[34rem]">
        <div className="absolute left-[2%] top-[5%] z-10 w-[66%] -rotate-3 border border-line bg-surface p-1.5 shadow-[0_16px_32px_-20px_rgb(0_0_0/45%)]">
          <Image
            src={springmeds}
            alt="SpringMeds homepage: green, image-led design with a shared pharmacy search and navigation."
            sizes="(min-width: 768px) 32vw, 72vw"
            className="block h-auto w-full"
          />
          <p className="px-1 pt-1.5 text-label text-ink">SpringMeds</p>
        </div>
        <div className="absolute bottom-[6%] left-[5%] z-20 w-[68%] -rotate-1 border border-line bg-surface p-1.5 shadow-[0_16px_32px_-20px_rgb(0_0_0/45%)]">
          <Image
            src={healthwarehouse}
            alt="HealthWarehouse homepage: a compact pharmacy search layout with its own green identity."
            sizes="(min-width: 768px) 33vw, 72vw"
            className="block h-auto w-full"
          />
          <p className="px-1 pt-1.5 text-label text-ink">HealthWarehouse</p>
        </div>
        <div className="absolute right-[1%] top-[25%] z-30 w-[68%] rotate-2 border border-line bg-surface p-1.5 shadow-[0_16px_32px_-20px_rgb(0_0_0/45%)]">
          <Image
            src={pharmcorx}
            alt="PharmcoRx homepage: a split layout with a slab-serif headline, warm pink details, and pill-shaped buttons."
            sizes="(min-width: 768px) 33vw, 72vw"
            className="block h-auto w-full"
          />
          <p className="px-1 pt-1.5 text-label text-ink">PharmcoRx</p>
        </div>
      </div>
      <figcaption className="sr-only">
        Three pharmacy brands on one platform, each with a distinct visual identity.
      </figcaption>
    </figure>
  );
}
