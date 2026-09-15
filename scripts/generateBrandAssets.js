// Generates all brand image assets in public/ from the master files in images/.
// Run: node scripts/generateBrandAssets.js   (sharp is already a devDependency)
//
// Sources (do not edit these, they are the originals):
//   images/vn_logo_bg.png  mark, transparent background
//   images/vn_logo.png     mark on white (used for the iOS touch icon, which
//                          does not render transparency well)
//   images/text_logo.png   wordmark "THE VALUATION NODE" on white
//
// Outputs (public/):
//   logo.png                 512x512 transparent mark (header, footer, JSON-LD)
//   apple-touch-icon.png     180x180 mark on white
//   favicon-32.png, favicon-logo.png (64), favicon.ico (16+32+48, PNG-in-ICO)
//   logo-wordmark.png        wordmark, transparent, navy + green (light theme)
//   logo-wordmark-dark.png   wordmark, transparent, off-white + green (dark theme)

import sharp from "sharp";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = (f) => resolve(root, "images", f);
const out = (f) => resolve(root, "public", f);

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const DARK_TEXT = [237, 234, 228]; // #EDEAE4, the light foreground used on dark surfaces

async function mark(size, { onWhite = false, pad = 0 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const base = onWhite ? src("vn_logo.png") : src("vn_logo_bg.png");
  const trimmed = await sharp(base).trim({ threshold: onWhite ? 10 : 1 }).toBuffer();
  return sharp(trimmed)
    .resize(inner, inner, { fit: "contain", background: onWhite ? WHITE : TRANSPARENT })
    .extend({
      top: Math.floor((size - inner) / 2),
      bottom: Math.ceil((size - inner) / 2),
      left: Math.floor((size - inner) / 2),
      right: Math.ceil((size - inner) / 2),
      background: onWhite ? WHITE : TRANSPARENT,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// Wrap PNG buffers into a single .ico (PNG-in-ICO, supported by all current browsers).
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  const dir = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...pngs.map((p) => p.buf)]);
}

// Key the wordmark off its white background and optionally recolour the navy
// letters for dark surfaces. Alpha is derived from luminance so anti-aliased
// edges stay smooth; edge colours are un-blended from white.
async function wordmark({ dark = false, height = 200 } = {}) {
  const { data, info } = await sharp(src("text_logo.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const outBuf = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    let a = (240 - lum) / 120; // bg (lum ~248) -> 0, green (~116) and navy (~28) -> 1
    a = Math.max(0, Math.min(1, a));
    if (a <= 0.02) {
      outBuf[i] = outBuf[i + 1] = outBuf[i + 2] = 0;
      outBuf[i + 3] = 0;
      continue;
    }
    // un-blend from white so semi-transparent edge pixels keep the ink colour
    let cr = Math.max(0, Math.min(255, (r - (1 - a) * 255) / a));
    let cg = Math.max(0, Math.min(255, (g - (1 - a) * 255) / a));
    let cb = Math.max(0, Math.min(255, (b - (1 - a) * 255) / a));
    const isGreen = cg > cr + 40 && cg > cb + 20;
    if (dark && !isGreen) [cr, cg, cb] = DARK_TEXT;
    outBuf[i] = Math.round(cr);
    outBuf[i + 1] = Math.round(cg);
    outBuf[i + 2] = Math.round(cb);
    outBuf[i + 3] = Math.round(a * 255);
  }
  return sharp(outBuf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ height, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const files = [];
async function write(name, buf) {
  writeFileSync(out(name), buf);
  const m = await sharp(buf).metadata();
  files.push(`${name.padEnd(24)} ${m.width}x${m.height}  ${(buf.length / 1024).toFixed(1)} KB`);
}

await write("logo.png", await mark(512, { pad: 0.02 }));
await write("apple-touch-icon.png", await mark(180, { onWhite: true, pad: 0.1 }));
await write("favicon-32.png", await mark(32, { pad: 0.03 }));
await write("favicon-logo.png", await mark(64, { pad: 0.03 }));
writeFileSync(
  out("favicon.ico"),
  ico([
    { size: 16, buf: await mark(16) },
    { size: 32, buf: await mark(32, { pad: 0.03 }) },
    { size: 48, buf: await mark(48, { pad: 0.03 }) },
  ])
);
files.push("favicon.ico              16+32+48");
await write("logo-wordmark.png", await wordmark());
await write("logo-wordmark-dark.png", await wordmark({ dark: true }));

console.log(files.join("\n"));
