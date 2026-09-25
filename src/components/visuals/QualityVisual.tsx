import Image from "next/image";

/**
 * Isolated triangular core used as the quality and judgment form.
 * It stacks under the workflow list on small screens and sits beside it from `md` up.
 */
export function QualityVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/nested-triangle.webp"
      alt=""
      width={1200}
      height={1200}
      sizes="(max-width: 768px) 90vw, 400px"
      className={`h-auto w-full ${className}`}
    />
  );
}
