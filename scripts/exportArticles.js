// One-time export: pull existing Research articles out of Supabase and write them
// as Markdown files with SEO front-matter into src/content/research/.
//
// This is the migration bridge from the old "content lives in the database" model
// to the new "content lives in Git as Markdown" model. It is READ-ONLY against
// Supabase (a plain SELECT). Run it locally where .env is present:
//
//   node scripts/exportArticles.js
//
// It does NOT modify or drop the `articles` table — that stays as-is.

import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "src", "content", "research");

// ── Load .env (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) ─────────────
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  const env = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const URL = env.VITE_SUPABASE_URL;
// Prefer the service-role key so the export bypasses RLS and can read every
// article regardless of publish status. This runs LOCALLY only; the key is
// read from .env (never committed) and is never printed.
const KEY =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  console.error("Missing VITE_SUPABASE_URL / Supabase key in .env");
  process.exit(1);
}

const usingServiceRole = KEY === env.SUPABASE_SERVICE_ROLE_KEY;
console.log(`Connecting with ${usingServiceRole ? "service-role" : "anon"} key…`);

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build the front-matter object, omitting empty values.
function toFrontmatter(a) {
  const slug = a.slug || a.id;
  const fm = {
    title: a.title,
    slug,
    excerpt: a.excerpt || "",
    category: a.category || a.category_id || "Uncategorised",
    metaTitle: a.meta_title || `${a.title} - The Valuation Node`,
    metaDescription: a.meta_description || a.excerpt || "",
    canonical: `https://valuationnode.com/research/${slug}`,
    ogImage: a.cover_image_url || a.image_url || "/og-image.png",
    publishedAt: a.published_at || a.created_at || null,
    updatedAt: a.updated_at || a.published_at || a.created_at || null,
    readingTime: a.reading_time ?? null,
    author: a.author || "Srinath Gajji",
    isResearch: a.is_research ?? true,
  };
  // Optional rich fields — only include when present.
  if (a.methodology_summary) fm.methodologySummary = a.methodology_summary;
  if (a.where_i_might_be_wrong) fm.whereIMightBeWrong = a.where_i_might_be_wrong;
  if (a.citation_format) fm.citationFormat = a.citation_format;
  if (a.model_download_url) fm.modelDownloadUrl = a.model_download_url;
  if (a.github_url) fm.githubUrl = a.github_url;
  if (Array.isArray(a.update_log) && a.update_log.length) fm.updateLog = a.update_log;
  if (Array.isArray(a.key_takeaways) && a.key_takeaways.length) fm.keyTakeaways = a.key_takeaways;

  // Drop null/undefined keys so the YAML stays clean.
  return Object.fromEntries(Object.entries(fm).filter(([, v]) => v !== null && v !== undefined));
}

async function main() {
  // Prefer research articles; fall back to all published if the flag isn't set.
  let { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_research", true);

  if (error) {
    console.warn("is_research query failed (", error.message, ") — fetching all articles.");
    ({ data, error } = await supabase.from("articles").select("*"));
  }
  if (error) {
    console.error("Failed to read articles:", error.message);
    process.exit(1);
  }

  const articles = data ?? [];
  if (!articles.length) {
    console.log("No articles found to export.");
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let written = 0;
  for (const a of articles) {
    const slug = a.slug || a.id;
    if (!slug) {
      console.warn("Skipping article with no slug/id:", a.title);
      continue;
    }
    const fm = toFrontmatter(a);
    const body = (a.content || "").trim() + "\n";
    const file = matter.stringify(body, fm);
    const outPath = path.join(OUT_DIR, `${slugify(slug)}.md`);
    fs.writeFileSync(outPath, file, "utf8");
    written++;
    console.log("  wrote", path.relative(ROOT, outPath));
  }

  console.log(`\nExported ${written} article(s) to src/content/research/.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
