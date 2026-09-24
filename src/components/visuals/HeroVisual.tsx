import Image from "next/image";

type Variant = "home" | "work" | "feature" | "case-study" | "ai";

// `hero-system` and `featured-work` are cropped to their visible artwork (see
// artwork/blender/optimize_renders.mjs), so their boxes follow the render's
// own aspect ratio rather than a square with transparent padding around it.
const visuals: Record<Variant, { src: string; width: number; height: number; sizeClass: string }> = {
  home: {
    src: "/visuals/hero-system.webp",
    width: 886,
    height: 772,
    sizeClass: "w-56 sm:w-[17rem] md:w-[22rem] lg:w-[25.5rem] xl:w-[29rem]",
  },
  work: { src: "/visuals/featured-work.webp", width: 937, height: 813, sizeClass: "w-72" },
  feature: { src: "/visuals/featured-work.webp", width: 937, height: 813, sizeClass: "w-full" },
  "case-study": {
    src: "/visuals/hero-system.webp",
    width: 886,
    height: 772,
    sizeClass: "w-full max-w-sm sm:max-w-md md:max-w-lg",
  },
  ai: { src: "/visuals/ai-governance.webp", width: 1200, height: 1200, sizeClass: "aspect-square w-64 sm:w-80 md:w-full" },
};

/** Optimized transparent artwork used in the home, work, case-study, and AI heroes. */
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
