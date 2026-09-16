// Build-time sitemap generator. Run via: node scripts/generateSitemap.js
// (hooked into npm build, runs before vite-react-ssg build).
//
// The route list comes from src/lib/siteRoutes.ts, the same module App.tsx
// uses for getStaticPaths, bundled here with esbuild so the sitemap and the
// prerender can never disagree. Routes flagged index:false (empty landings,
// the Archive) are prerendered with noindex and left out of the sitemap.
// Research articles in the Supabase hidden_articles table are removed at
// build time; the lookup fails open if the database is unreachable.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { buildSync } from "esbuild";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE_URL = "https://valuationnode.com";
const today = new Date().toISOString().split("T")[0];
const require = createRequire(import.meta.url);

// ── Env (Netlify provides process.env; locally fall back to .env) ────────────
function loadEnv() {
  const envPath = join(ROOT, ".env");
  const env = {};
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return { ...env, ...process.env };
}

async function fetchHiddenSlugs() {
  try {
    const env = loadEnv();
    if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_PUBLISHABLE_KEY) return new Set();
    const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false },
    });
    const { data, error } = await sb.from("hidden_articles").select("slug");
    if (error) return new Set();
    return new Set((data ?? []).map((r) => r.slug));
  } catch {
    return new Set();
  }
}

// Bundle src/lib/siteRoutes.ts (TypeScript, path aliases, JSON imports) into a
// CommonJS string and evaluate it. import.meta.env is shimmed because the
// Supabase client module reads it at import time.
function loadSiteRoutes() {
  const out = buildSync({
    entryPoints: [join(ROOT, "src", "lib", "siteRoutes.ts")],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    logLevel: "silent",
    loader: { ".json": "json" },
    alias: { "@": join(ROOT, "src") },
    define: { "import.meta.env.VITE_SUPABASE_URL": "\"\"", "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": "\"\"" },
  });
  const mod = { exports: {} };
  new Function("module", "exports", "require", out.outputFiles[0].text)(mod, mod.exports, require);
  return mod.exports.siteRoutes();
}

async function main() {
  const hiddenSlugs = await fetchHiddenSlugs();
  const all = loadSiteRoutes();
  const indexable = all.filter((r) => r.index && !hiddenSlugs.has(r.path.split("/").pop()));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    ({ path, priority, changefreq, lastmod }) =>
      `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${lastmod || today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outPath = resolve(__dirname, "../public/sitemap.xml");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, sitemap, "utf-8");
  const byKind = (prefix) => indexable.filter((r) => r.path.startsWith(prefix)).length;
  console.log(
    `sitemap.xml written, ${indexable.length} URLs of ${all.length} routes ` +
      `(analysis ${byKind("/analysis")}, vault ${byKind("/vault")}, news ${byKind("/news")}, esg ${byKind("/esg")}, tags ${byKind("/tags")}, about ${byKind("/about")}; ${hiddenSlugs.size} hidden)`
  );
}

main();
