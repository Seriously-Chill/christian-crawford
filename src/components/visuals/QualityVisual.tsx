import Image from "next/image";

/**
 * Decorative illustration for the case study's quality evidence section.
 * Shown at every width, cropped to 3:2 to drop the render's empty canvas
 * above and below the object. It stacks under the workflow list on small
 * screens and sits beside it from `md` up.
 */
export function QualityVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/quality-evidence.webp"
      alt=""
      width={1200}
      height={1200}
      unoptimized
      sizes="320px"
      className={`aspect-[3/2] w-full object-cover ${className}`}
    />
  );
}
