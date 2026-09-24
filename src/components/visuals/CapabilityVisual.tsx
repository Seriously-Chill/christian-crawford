import Image from "next/image";

type Variant = "architecture" | "product" | "frontend" | "quality";

const visuals: Record<Variant, string> = {
  architecture: "/visuals/capability-architecture.webp",
  product: "/visuals/capability-product.webp",
  frontend: "/visuals/capability-frontend.webp",
  quality: "/visuals/capability-quality.webp",
};

/** Decorative rendered artwork for each capability card. */
export function CapabilityVisual({ variant, className = "" }: { variant: Variant; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      <Image
        src={visuals[variant]}
        alt=""
        width={1200}
        height={1200}
        unoptimized
        sizes="(max-width: 640px) 80vw, 40vw"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
