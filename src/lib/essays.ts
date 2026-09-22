export type Essay = {
  slug: string;
  title: string;
  description: string;
};

/**
 * Backing list for /thinking (index) and /thinking/[slug] (article) — the
 * DS's own News section is an index + individual article routes
 * (sitemap.md); this is that same shape, applied to essays instead of
 * press articles. One entry today, room for more without touching the
 * route structure.
 */
export const essays: Essay[] = [
  {
    slug: "ai-assisted-development",
    title: "If code gets easier to generate, what has to get harder to maintain?",
    description:
      "The interesting question about AI-assisted development was never how to use it to write code faster.",
  },
];
