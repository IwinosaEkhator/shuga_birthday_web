import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public", "optimized", "rolls");
const files = [
  ["roll-01", "camp/IMG-20251205-WA0234.jpg"],
  ["roll-02", "camp/IMG-20251205-WA0227.jpg"],
  ["roll-03", "camp/iwinosa_and_shuga/WhatsApp Image 2026-11-03 at 09.35.43.jpeg"],
  ["roll-04", "camp/shuga/f8a35f39b8fa8cea06be70fae03f6c81.webp"],
  ["roll-05", "camp/shuga/93014c7d97dcb597f45bf16bfd7a0ad2.webp"],
  ["roll-06", "camp/shuga/419d96c124287e6ccbce6fa02d6dcff1.webp"],
  ["roll-07", "camp/shuga/0b0ba4445394b3bc7e1d3e66b84b0606.webp"],
  ["roll-08", "shuga/ff554b580f6cc7d524dc3a359ddad6be.webp"],
  ["roll-09", "shuga/efb5d7cfd871092166942253e5a358e8.webp"],
  ["roll-10", "shuga/7791ab6f1f266d75e5ad4bbd34d6e83e.webp"],
];

await mkdir(output, { recursive: true });
for (const [name, relative] of files) {
  const source = join(root, "public", "shuga-wrapped-assets", relative);
  await sharp(source).rotate().resize({ width: 360, height: 450, fit: "cover" }).webp({ quality: 68 }).toFile(join(output, `${name}-thumb.webp`));
  await sharp(source).rotate().resize({ width: 1440, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(output, `${name}.webp`));
}
