import Image from "next/image";

type Variant = "architecture" | "product" | "frontend" | "quality";

const visuals: Record<Variant, { src: string; width: number; height: number }> = {
  architecture: { src: "/visuals/nested-box.webp", width: 1200, height: 1200 },
  product: { src: "/visuals/nested-sphere.webp", width: 1200, height: 1200 },
  frontend: { src: "/visuals/nested-diamond.webp", width: 1200, height: 1200 },
  quality: { src: "/visuals/nested-triangle.webp", width: 1200, height: 1200 },
};

/** Decorative rendered artwork for each capability card. */
export function CapabilityVisual({ variant, className = "" }: { variant: Variant; className?: string }) {
  const visual = visuals[variant];
  return (
    <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      <Image
        src={visual.src}
        alt=""
        width={visual.width}
        height={visual.height}
        unoptimized
        sizes="(max-width: 640px) 80vw, 40vw"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
