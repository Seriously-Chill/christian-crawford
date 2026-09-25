import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const renders = path.join(here, "renders");
const output = path.join(repo, "public", "visuals");
const assets = [
  "nested-assembled",
  "nested-exploded",
  "nested-sphere",
  "nested-box",
  "nested-diamond",
  "nested-triangle",
];

await mkdir(output, { recursive: true });
for (const asset of assets) {
  const source = path.join(renders, `${asset}.png`);
  const { width, height } = await sharp(source)
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95, effort: 6 })
    .toFile(path.join(output, `${asset}.webp`));
  console.log(`${asset}.webp ${width}x${height}`);
}

console.log(`Optimized nested-form renders written to ${output}`);
