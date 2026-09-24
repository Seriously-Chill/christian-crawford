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
  "nested-brands",
  "nested-brands-compact",
  "nested-layers",
  "nested-xray-core",
  "nested-xray-middle",
  "nested-xray-shell",
  "nested-sphere",
  "nested-triangle",
];

// Soft shadows can run past the frame; fading alpha to zero over the outer
// band keeps a clipped shadow from reading as a hard-edged plate on the page.
const FEATHER = 0.08;

async function feathered(source) {
  const { data, info } = await sharp(source)
    .resize({ width: 1600, height: 1200, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const band = FEATHER * Math.min(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = Math.min(x, y, width - 1 - x, height - 1 - y) / band;
      if (t >= 1) continue;
      const i = (y * width + x) * channels + 3;
      data[i] = Math.round(data[i] * t * t * (3 - 2 * t));
    }
  }
  return sharp(data, { raw: info });
}

await mkdir(output, { recursive: true });
for (const asset of assets) {
  const image = await feathered(path.join(renders, `${asset}.png`));
  const { width, height } = await image
    .webp({ quality: 90, alphaQuality: 95, effort: 6 })
    .toFile(path.join(output, `${asset}.webp`));
  console.log(`${asset}.webp ${width}x${height}`);
}

console.log(`Optimized nested-form renders written to ${output}`);
