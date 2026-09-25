import Image from "next/image";

/**
 * The isolated box form represents the shared platform in the HealthWarehouse
 * architecture story; pass `alt` when it carries that meaning.
 */
export function ArchitectureVisual({ className = "", alt = "" }: { className?: string; alt?: string }) {
  return (
    <Image
      src="/visuals/nested-box.webp"
      alt={alt}
      width={1200}
      height={1200}
      unoptimized
      sizes="(max-width: 640px) 90vw, 560px"
      className={`mx-auto h-auto w-full max-w-xl object-contain ${className}`}
    />
  );
}
