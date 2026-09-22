import type { MetadataRoute } from "next";

const base = "https://christiancrawford.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work/healthwarehouse`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ai`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
