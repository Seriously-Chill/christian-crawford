import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiArchitecture } from "@/components/sections/AiArchitecture";
import { essays } from "@/lib/essays";

export function generateStaticParams() {
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) return {};
  return { title: essay.title, description: essay.description };
}

export default async function ThinkingEssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) notFound();

  return (
    <>
      {slug === "ai-assisted-development" && <AiArchitecture />}

      <div className="mx-auto max-w-5xl px-space-3 pb-space-6">
        <Link href="/thinking" className="text-label text-primary hover:underline">
          ← Back to Thinking
        </Link>
      </div>
    </>
  );
}
