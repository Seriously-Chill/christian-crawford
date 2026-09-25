import Image from "next/image";

type Variant = "home" | "work" | "feature" | "case-study" | "ai";

// The home hero reveals the four fitted layers; the featured-work image shows
// the closed sphere. Each specialized page uses its one relevant form.
const visuals: Record<Variant, { src: string; width: number; height: number; sizeClass: string }> = {
  home: {
    src: "/visuals/nested-exploded.webp",
    width: 1200,
    height: 1200,
    sizeClass: "w-56 sm:w-[17rem] md:w-[22rem] lg:w-[25.5rem] xl:w-[29rem]",
  },
  work: { src: "/visuals/nested-assembled.webp", width: 1200, height: 1200, sizeClass: "w-72" },
  feature: { src: "/visuals/nested-assembled.webp", width: 1200, height: 1200, sizeClass: "w-full" },
  "case-study": {
    src: "/visuals/nested-box.webp",
    width: 1200,
    height: 1200,
    sizeClass: "w-full max-w-sm sm:max-w-md md:max-w-lg",
  },
  ai: { src: "/visuals/nested-triangle.webp", width: 1200, height: 1200, sizeClass: "aspect-square w-64 sm:w-80 md:w-full" },
};

/** Optimized transparent artwork showing the assembled form or one relevant layer. */
export function HeroVisual({ variant = "home", className = "" }: { variant?: Variant; className?: string }) {
  const visual = visuals[variant];
  return (
    <Image
      src={visual.src}
      alt=""
      width={visual.width}
      height={visual.height}
      unoptimized
      priority={variant === "home"}
      sizes="(max-width: 640px) 80vw, 544px"
      className={`h-auto ${visual.sizeClass} object-contain ${className}`}
    />
  );
}
