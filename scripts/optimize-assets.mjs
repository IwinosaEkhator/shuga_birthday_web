import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

const root = process.cwd();
const source = join(root, "public", "shuga-wrapped-assets");
const imageOut = join(root, "public", "optimized", "images");
const videoOut = join(root, "public", "optimized", "video");
mkdirSync(imageOut, { recursive: true });
mkdirSync(videoOut, { recursive: true });

const images = [
  ["shuga/IMG_7720.JPG.jpeg", "hero-portrait"],
  ["camp/IMG-20251205-WA0231.jpg", "camp-group"],
  ["camp/shuga/IMG-20251205-WA0223.jpg", "camp-three"],
  ["camp/iwinosa_and_shuga/IMG-20251205-WA0217.jpg", "camp-iwinosa-shuga"],
  ["shuga/3096a201aced093ab54d8a96e8482b29.webp", "outside-portrait"],
  ["shuga/43054f1f5ee655e7c7f60789036d80aa.webp", "red-portrait"],
  ["shuga/227f4378fbdb9c887ef274526bcc8eeb.webp", "evidence-portrait"],
  ["shuga/WhatsApp Image 2026-11-03 at 18.04.34.jpeg", "starter-portrait"],
  ["shuga/05aa90ed4dc34cc73b7b960b96cb521d.webp", "quiet-portrait"],
  ["shuga/WhatsApp Image 2026-11-02 at 22.27.42.jpeg", "lagos-portrait"],
];

for (const [relative, name] of images) {
  const input = join(source, ...relative.split("/"));
  const pipeline = sharp(input).rotate().resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true });
  await pipeline.clone().webp({ quality: 80, effort: 5 }).toFile(join(imageOut, `${name}.webp`));
  await pipeline.clone().avif({ quality: 56, effort: 5 }).toFile(join(imageOut, `${name}.avif`));
  for (const width of [480, 800, 1200]) {
    const responsive = sharp(input).rotate().resize({ width, withoutEnlargement: true });
    await responsive.clone().webp({ quality: 78, effort: 5 }).toFile(join(imageOut, `${name}-${width}.webp`));
    await responsive.clone().avif({ quality: 54, effort: 5 }).toFile(join(imageOut, `${name}-${width}.avif`));
  }
}

const videos = [
  ["camp/iwinosa_and_shuga/VID-20251208-WA0083.mp4", "two-camp-peas.mp4"],
  ["camp/maroh_and_shuga/WhatsApp Video 2026-11-03 at 09.33.16.mp4", "original-plug.mp4"],
  ["camp/shuga/VID-20251206-WA0024.mp4", "shuga-in-motion.mp4"],
];

for (const [relative, outputName] of videos) {
  const input = join(source, ...relative.split("/"));
  const output = join(videoOut, outputName);
  execFileSync(ffmpegPath, ["-y", "-i", input, "-vf", "scale=min(960\\,iw):-2,fps=30", "-c:v", "libx264", "-preset", "medium", "-crf", "30", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "64k", output], { stdio: "inherit" });
}

const before = images.reduce((sum, [r]) => sum + statSync(join(source, ...r.split("/"))).size, 0) + videos.reduce((sum, [r]) => sum + statSync(join(source, ...r.split("/"))).size, 0);
const after = images.reduce((sum, [, n]) => sum + statSync(join(imageOut, `${n}.webp`)).size + statSync(join(imageOut, `${n}.avif`)).size, 0) + videos.reduce((sum, [, n]) => sum + statSync(join(videoOut, n)).size, 0);
console.log(JSON.stringify({ sourceMB: (before / 1048576).toFixed(2), derivativesMB: (after / 1048576).toFixed(2) }));
