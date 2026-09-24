import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const renders = path.join(here, "renders");
const output = path.join(repo, "public", "visuals");
const assets = [
  "hero-system",
  "healthwarehouse-platform",
  "featured-work",
  "capability-architecture",
  "capability-product",
  "capability-frontend",
  "capability-quality",
  "contact-resolution",
  "quality-evidence",
  "ai-governance",
];
// Renders are cropped to their visible pixels plus this margin, so the
// artwork fills its frame instead of floating in transparent padding.
// Only the AI hero keeps its square canvas (it's laid out as a square).
const cropped = new Set(assets.filter((asset) => asset !== "ai-governance"));
const cropMargin = 0.04;

/** Bounding box of pixels with visible alpha, as a sharp `extract` region. */
async function visibleBounds(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  const pad = Math.round(Math.max(right - left, bottom - top) * cropMargin);
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  return {
    left,
    top,
    width: Math.min(info.width, right + pad + 1) - left,
    height: Math.min(info.height, bottom + pad + 1) - top,
  };
}

await mkdir(output, { recursive: true });
for (const asset of assets) {
  const source = path.join(renders, `${asset}.png`);
  let image = sharp(source);
  if (cropped.has(asset)) image = image.extract(await visibleBounds(source));
  const { width, height } = await image
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95, effort: 6 })
    .toFile(path.join(output, `${asset}.webp`));
  console.log(`${asset}.webp ${width}x${height}`);
}

console.log(`Optimized transparent renders written to ${output}`);
