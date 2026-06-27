// Generates public/og-image.png (1200×630) at build time using sharp.
// sharp is already a devDependency — no new package needed.

import sharp from "sharp";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/og-image.png");

// SVG template — dark navy brand background, no external font dependency
const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#0f172a"/>

  <!-- Subtle dot grid -->
  <defs>
    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#1e3a5f" opacity="0.6"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="5" fill="#3b82f6"/>

  <!-- Left content column -->

  <!-- Tag label -->
  <rect x="80" y="140" width="8" height="48" fill="#3b82f6" rx="2"/>
  <text x="106" y="176" font-family="Georgia, 'Times New Roman', serif" font-size="22"
        font-weight="normal" fill="#94a3b8" letter-spacing="3">RESEARCH · ANALYSIS · LEARNING</text>

  <!-- Main title -->
  <text x="80" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="72"
        font-weight="bold" fill="#f1f5f9">The Valuation</text>
  <text x="80" y="355" font-family="Georgia, 'Times New Roman', serif" font-size="72"
        font-weight="bold" fill="#f1f5f9">Node</text>

  <!-- Subtitle -->
  <text x="80" y="430" font-family="Arial, Helvetica, sans-serif" font-size="28"
        fill="#64748b">Indian markets, from first principles.</text>

  <!-- Divider -->
  <rect x="80" y="475" width="80" height="3" fill="#3b82f6" rx="1"/>

  <!-- Topics row -->
  <text x="80" y="530" font-family="Arial, Helvetica, sans-serif" font-size="20"
        fill="#475569">Valuations  ·  Credit Analysis  ·  ESG  ·  Fintech  ·  Learning Library</text>

  <!-- Author + domain -->
  <text x="80" y="590" font-family="Arial, Helvetica, sans-serif" font-size="19"
        fill="#334155">Srinath Gajji</text>
  <text x="1120" y="590" font-family="Arial, Helvetica, sans-serif" font-size="19"
        fill="#334155" text-anchor="end">valuationnode.com</text>

  <!-- Bottom accent bar -->
  <rect x="0" y="625" width="1200" height="5" fill="#3b82f6"/>
</svg>`;

const buffer = Buffer.from(svg);

sharp(buffer)
  .png({ quality: 95 })
  .toFile(outPath)
  .then(() => console.log(`og-image.png written (${outPath})`))
  .catch((err) => {
    // Non-fatal: warn but don't break the build
    console.warn("⚠ OG image generation failed (non-fatal):", err.message);
  });
