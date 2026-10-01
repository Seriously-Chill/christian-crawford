import type { MetadataRoute } from "next";

const base = "https://christiancrawford.dev";

// No `lastModified`: stamping every entry with the build time tells crawlers
// nothing, and Google ignores lastmod once it proves unreliable.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work/healthwarehouse`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work/partner-portal`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ai`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
