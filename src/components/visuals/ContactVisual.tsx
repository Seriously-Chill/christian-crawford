import Image from "next/image";

/** Decorative artwork for the contact section's complexity-to-clarity motif. */
export function ContactVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/contact-resolution.webp"
      alt=""
      width={1200}
      height={1200}
      unoptimized
      sizes="(max-width: 640px) 80vw, 480px"
      className={`h-48 w-48 object-contain sm:h-56 sm:w-56 ${className}`}
    />
  );
}
