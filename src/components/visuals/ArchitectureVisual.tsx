import Image from "next/image";

/** Rendered placeholder for the HealthWarehouse shared-platform architecture. */
export function ArchitectureVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/healthwarehouse-platform.webp"
      alt=""
      width={1200}
      height={1200}
      unoptimized
      sizes="(max-width: 640px) 90vw, 560px"
      className={`mx-auto h-auto w-full max-w-xl object-contain ${className}`}
    />
  );
}
