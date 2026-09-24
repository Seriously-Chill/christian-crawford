import Image from "next/image";

/** Decorative artwork for the contact section's complexity-to-clarity motif. */
export function ContactVisual({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/visuals/contact-resolution.webp"
      alt=""
      width={1004}
      height={554}
      unoptimized
      sizes="(max-width: 640px) 80vw, 480px"
      className={`h-auto w-56 sm:w-64 ${className}`}
    />
  );
}
