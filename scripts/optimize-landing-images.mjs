/**
 * Generates the WebP derivatives used by /local-movers-melbourne.
 *
 * The originals in public/ are 1.8–2.7 MB PNGs shared with the rest of the
 * site. This pre-resizes them to the widths the landing page actually renders
 * (at 2x DPR) so the page ships a fraction of the bytes and the Next image
 * optimizer has almost nothing left to do on a cold request.
 *
 * Run: node scripts/optimize-landing-images.mjs
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUT_DIR = path.join(PUBLIC_DIR, "landing");

/** [source, output, rendered width at 2x DPR, quality] */
const targets = [
  ["movera.jpeg", "hero.webp", 1600, 58],
  ["House.png", "house.webp", 800, 68],
  ["House_removalist.png", "two-men.webp", 800, 68],
  ["loading-unloading.png", "furniture.webp", 800, 68],
  ["office_removal.png", "office.webp", 800, 68],
  ["Packing.png", "packing.webp", 800, 68],
  ["special-move.png", "specialty.webp", 800, 68],
  ["desktop-fleet.png", "fleet-desktop.webp", 1200, 68],
  ["mobile-fleet.png", "fleet-mobile.webp", 900, 68],
  // Background for the closing "get a quote" band. Swap the source for a real
  // customer-service / call-centre photo and re-run this script.
  ["support-source.png", "support.webp", 1600, 58],
  // Video posters for the reviews slider — cards render at 280px wide.
  ["review.jpeg", "review-poster-a.webp", 560, 66],
  ["review1.jpeg", "review-poster-b.webp", 560, 66],
  ["Logo.png", "logo.webp", 96, 88],
  ["facebook.png", "facebook.webp", 72, 88],
  ["twitter.png", "twitter.webp", 72, 88],
  ["instagram.png", "instagram.webp", 72, 88],
  ["youtube.png", "youtube.webp", 72, 88],
];

await mkdir(OUT_DIR, { recursive: true });

for (const [source, output, width, quality] of targets) {
  const inputPath = path.join(PUBLIC_DIR, source);
  if (!existsSync(inputPath)) {
    console.warn(`skip ${source} — not found`);
    continue;
  }
  const outputPath = path.join(OUT_DIR, output);

  const info = await sharp(inputPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(outputPath);

  console.log(
    `${source} → landing/${output}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`,
  );
}
