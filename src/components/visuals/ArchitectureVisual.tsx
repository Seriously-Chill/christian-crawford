import Image from "next/image";

/**
 * Rendered HealthWarehouse shared-platform artwork: brand modules above one
 * shared base. Shown in the case study's Architecture section, where it
 * illustrates the shared core / configured differences split — pass `alt`
 * there so it carries that meaning; it stays decorative without one.
 */
export function ArchitectureVisual({ className = "", alt = "" }: { className?: string; alt?: string }) {
  return (
    <Image
      src="/visuals/healthwarehouse-platform.webp"
      alt={alt}
      width={1200}
      height={1200}
      unoptimized
      sizes="(max-width: 640px) 90vw, 560px"
      className={`mx-auto h-auto w-full max-w-xl object-contain ${className}`}
    />
  );
}
