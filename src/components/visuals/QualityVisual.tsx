import Image from "next/image";

/**
 * Decorative illustration for the case study's quality evidence section.
 * Shown at every width; the file is cropped to its visible artwork (see
 * artwork/blender/optimize_renders.mjs). It stacks under the workflow list on small
 * screens and sits beside it from `md` up.
 */
export function QualityVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/quality-evidence.webp"
      alt=""
      width={715}
      height={777}
      unoptimized
      sizes="(max-width: 768px) 90vw, 400px"
      className={`h-auto w-full ${className}`}
    />
  );
}
