// Every public route with its sitemap metadata. The single source of truth for
// vite-react-ssg's getStaticPaths (App.tsx) and for scripts/generateSitemap.js
// (which bundles this module with esbuild at build time).
//
// `index: false` routes are still prerendered (so the page exists as static
// HTML) but carry noindex and are left out of the sitemap: empty sub-section
// landings and the Archive (owner decision AR1).

import { CONTENT_INDEX, landingHasContent, tagCounts } from "@/lib/contentIndex";
import { paths } from "@/lib/routes";
import { SECTIONS } from "@/lib/taxonomy";

export interface SiteRoute {
  path: string;
  priority: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  lastmod?: string;
  index: boolean;
}

const ABOUT_PAGES = ["site", "author", "philosophy", "contact", "privacy", "disclaimer", "terms"];

export function siteRoutes(): SiteRoute[] {
  const out: SiteRoute[] = [];
  const add = (r: SiteRoute) => out.push(r);

  add({ path: "/", priority: "1.0", changefreq: "weekly", index: true });

  // Section and sub-section landings
  for (const s of SECTIONS) {
    if (s.id === "about") continue;
    add({ path: s.path, priority: s.id === "archive" ? "0.3" : "0.9", changefreq: "weekly", index: s.id !== "archive" });
    for (const sub of s.subsections) {
      const p = `${s.path}/${sub.id}`;
      const has = landingHasContent(s.id, sub.id);
      add({ path: p, priority: "0.7", changefreq: "weekly", index: has });
    }
  }

  // About
  add({ path: paths.about(), priority: "0.6", changefreq: "monthly", index: true });
  for (const a of ABOUT_PAGES) add({ path: paths.aboutPage(a), priority: "0.5", changefreq: "yearly", index: true });

  // Content items
  for (const item of CONTENT_INDEX) {
    if (item.meta.status === "draft") continue;
    const archived = item.meta.status === "archived";
    const priority =
      item.kind === "article" ? "0.8" :
      item.kind === "guide" || item.kind === "course" ? "0.7" :
      item.kind === "track" ? "0.7" :
      item.kind === "formula" ? "0.7" :
      item.kind === "calculator" || item.kind === "lesson" ? "0.7" :
      item.kind === "news" ? "0.7" :
      item.kind === "term" ? "0.5" : "0.3";
    add({
      path: item.path,
      priority: archived ? "0.3" : priority,
      changefreq: item.kind === "news" ? "weekly" : "monthly",
      lastmod: item.meta.updatedDate ?? item.meta.publishDate,
      index: !archived,
    });
  }

  // Tag archives (only tags with content)
  add({ path: paths.tags(), priority: "0.4", changefreq: "weekly", index: true });
  for (const { tag } of tagCounts()) add({ path: paths.tag(tag), priority: "0.4", changefreq: "weekly", index: true });

  // De-duplicate defensively
  const seen = new Set<string>();
  return out.filter((r) => (seen.has(r.path) ? false : (seen.add(r.path), true)));
}
