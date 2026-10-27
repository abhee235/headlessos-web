// Turns 2× PNG captures of the app into the WebP sources under src/assets/screens.
// Astro then builds the responsive sizes from these at build time.
//
//   node scripts/import-screens.mjs <folder-with-pngs> [name ...]
//
// Captures are 1600×1000 CSS px at device scale 2 (3200×2000). Keep them at that size:
// the gallery serves up to 2400 px wide.
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { basename, join } from "node:path";

const [src, ...only] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/import-screens.mjs <folder> [name ...]");
  process.exit(1);
}
const out = new URL("../src/assets/screens/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const files = readdirSync(src).filter((f) => f.endsWith(".png") && (!only.length || only.includes(basename(f, ".png"))));

for (const f of files) {
  const dest = join(out, `${basename(f, ".png")}.webp`);
  const info = await sharp(join(src, f)).webp({ quality: 90, effort: 6 }).toFile(dest);
  console.log(`${basename(dest)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
