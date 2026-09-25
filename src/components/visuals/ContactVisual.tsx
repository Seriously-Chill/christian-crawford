import Image from "next/image";

/** Isolated sphere form for the conversation and product-experience motif. */
export function ContactVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/nested-sphere.webp"
      alt=""
      width={1200}
      height={1200}
      sizes="(max-width: 640px) 80vw, 480px"
      className={`h-auto w-56 sm:w-64 ${className}`}
    />
  );
}
