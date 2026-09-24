import Image from "next/image";

type Variant = "home" | "work" | "case-study" | "ai";

const visuals: Record<Variant, { src: string; sizeClass: string }> = {
  home: { src: "/visuals/hero-system.webp", sizeClass: "aspect-square w-64 sm:w-80 md:w-[26rem] lg:w-[30rem] xl:w-[34rem]" },
  work: { src: "/visuals/featured-work.webp", sizeClass: "aspect-square w-40 sm:w-52 md:w-60" },
  "case-study": { src: "/visuals/hero-system.webp", sizeClass: "aspect-square w-48 sm:w-64 md:w-80" },
  ai: { src: "/visuals/ai-governance.webp", sizeClass: "aspect-square w-64 sm:w-80 md:w-full" },
};

/** Optimized transparent artwork used in the home, work, case-study, and AI heroes. */
export function HeroVisual({ variant = "home", className = "" }: { variant?: Variant; className?: string }) {
  const visual = visuals[variant];
  return (
    <Image
      src={visual.src}
      alt=""
      width={1200}
      height={1200}
      unoptimized
      priority={variant === "home"}
      sizes="(max-width: 640px) 80vw, 544px"
      className={`${visual.sizeClass} object-contain ${className}`}
    />
  );
}
