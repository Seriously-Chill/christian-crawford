import Image from "next/image";

/** Decorative illustration for the case study's quality evidence section. */
export function QualityVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/quality-evidence.webp"
      alt=""
      width={1200}
      height={1200}
      unoptimized
      sizes="(max-width: 640px) 50vw, 160px"
      className={`h-auto w-full object-contain ${className}`}
    />
  );
}
