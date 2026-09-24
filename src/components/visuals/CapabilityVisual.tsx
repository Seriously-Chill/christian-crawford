import Image from "next/image";

type Variant = "architecture" | "product" | "frontend" | "quality";

// Cropped to their visible artwork (see artwork/blender/optimize_renders.mjs).
const visuals: Record<Variant, { src: string; width: number; height: number }> = {
  architecture: { src: "/visuals/capability-architecture.webp", width: 1124, height: 710 },
  product: { src: "/visuals/capability-product.webp", width: 1140, height: 815 },
  frontend: { src: "/visuals/capability-frontend.webp", width: 1136, height: 851 },
  quality: { src: "/visuals/capability-quality.webp", width: 1108, height: 829 },
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
