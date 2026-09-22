import type { MetadataRoute } from "next";
import { essays } from "@/lib/essays";

const base = "https://christiancrawford.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/systems`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/thinking`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];

  const essayRoutes: MetadataRoute.Sitemap = essays.map((essay) => ({
    url: `${base}/thinking/${essay.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...routes, ...essayRoutes];
}
