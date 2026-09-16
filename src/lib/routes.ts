// Path builders for the restructured site, plus the legacy-path rewrite used
// by client-side redirects, by Prose (so links inside article bodies land on
// the new URLs without the body text being edited), and by the sitemap.
//
// URL scheme (RESTRUCTURE-PLAN.md section 1):
//   /news/[sub]/[slug]  /analysis/[sub]/[slug]  /esg/[sub]/[slug]
//   /vault/glossary/[term]  /vault/formulas/[name]  /vault/guides/[slug]
//   /vault/interactive/[slug]  /tags/[tag]  /about/[slug]  /archive/[slug]
//
// public/_redirects carries the same rules as HTTP 301s for crawlers; keep
// the two in step (Step 2 of the restructure added both together).

import { TRACKS } from "@/lib/taxonomy";
import { RESEARCH_ARTICLES } from "@/data/research.generated";

export const paths = {
  home: () => "/",

  news: () => "/news",
  newsSub: (sub: string) => `/news/${sub}`,
  nifty50: () => "/news/markets-news/nifty-50",
  compliance: () => "/news/economy-policy/compliance-calendar",

  analysis: () => "/analysis",
  analysisSub: (sub: string) => `/analysis/${sub}`,
  article: (sub: string, slug: string) => `/analysis/${sub}/${slug}`,

  esg: () => "/esg",
  esgSub: (sub: string) => `/esg/${sub}`,

  vault: () => "/vault",
  glossary: () => "/vault/glossary",
  glossaryTerm: (slug: string) => `/vault/glossary/${slug}`,
  formulas: () => "/vault/formulas",
  formula: (slug: string) => `/vault/formulas/${slug}`,
  guides: () => "/vault/guides",
  guide: (slug: string) => `/vault/guides/${slug}`,
  track: (id: string) => `/vault/guides/${id}`,
  interactive: () => "/vault/interactive",
  interactiveItem: (slug: string) => `/vault/interactive/${slug}`,

  about: () => "/about",
  aboutPage: (sub: string) => `/about/${sub}`,

  archive: () => "/archive",
  archiveArticle: (slug: string) => `/archive/${slug}`,

  tags: () => "/tags",
  tag: (id: string) => `/tags/${id}`,
} as const;

/** Research articles keyed by slug to their sub-section, from the generated front-matter. */
const RESEARCH_SUBSECTION: Record<string, string> = Object.fromEntries(
  RESEARCH_ARTICLES.map((a) => [a.slug, a.subsection ?? "valuation-modeling"])
);

export function researchPath(slug: string, subsection?: string): string {
  return paths.article(subsection ?? RESEARCH_SUBSECTION[slug] ?? "valuation-modeling", slug);
}

const TRACK_IDS = new Set(TRACKS.map((t) => t.id));

/** Exact legacy paths and their new homes. Parametrised paths are handled in rewriteLegacyPath. */
export const LEGACY_EXACT: Record<string, string> = {
  "/research": "/analysis",
  "/markets": "/news",
  "/markets/nifty50": paths.nifty50(),
  "/markets/compliance": paths.compliance(),
  "/stocks": paths.nifty50(),
  "/compliance": paths.compliance(),
  "/learn": "/vault",
  "/learn/glossary": "/vault/glossary",
  "/learn/wiki": "/vault/glossary",
  "/learn/ratio-analysis": "/vault/formulas",
  "/learn/foundations": "/vault/guides",
  "/learn/basics": "/vault/guides",
  "/learn/fundamental-analysis": "/vault/guides/fundamental-analysis-course",
  "/learn/technical-analysis": "/vault/guides/technical-analysis-course",
  "/tools": "/vault/interactive",
  "/learn/by-doing": "/vault/interactive",
  "/calculators": "/vault/interactive",
  // First News taxonomy (live briefly on 2026-09-16) to the current one
  "/news/global-markets": "/news/markets-news",
  "/news/indian-economy": "/news/markets-news",
  "/news/indian-economy/nifty-50": "/news/markets-news/nifty-50",
  "/news/corporate-updates": "/news/corporate-news",
  "/news/policy-regulation": "/news/economy-policy",
  "/news/policy-regulation/compliance-calendar": "/news/economy-policy/compliance-calendar",
  "/about/methodology": "/about/philosophy",
  "/privacy": "/about/privacy",
  "/disclaimer": "/about/disclaimer",
  "/terms": "/about/terms",
};

/**
 * Map a legacy site path to its new path, or return the input unchanged when
 * it is not legacy. Handles the exact map above and the parametrised families
 * (/research/:slug, /learn/glossary/:t, /learn/ratio-analysis/:r,
 * /learn/foundations/:section[/:topic], /tools/:t, /learn/by-doing/:l, /learn/:slug).
 */
export function rewriteLegacyPath(input: string): string {
  if (!input.startsWith("/")) return input;
  const [pathname, hash] = splitHash(input);
  const [path, query] = splitQuery(pathname);
  const target = rewrite(path);
  return target === path ? input : `${target}${query}${hash}`;
}

function rewrite(path: string): string {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  if (LEGACY_EXACT[p]) return LEGACY_EXACT[p];

  let m: RegExpMatchArray | null;
  if ((m = p.match(/^\/research\/([^/]+)$/))) return researchPath(m[1]);
  if ((m = p.match(/^\/learn\/glossary\/([^/]+)$/))) return paths.glossaryTerm(m[1]);
  if ((m = p.match(/^\/learn\/ratio-analysis\/([^/]+)$/))) return paths.formula(m[1]);
  if ((m = p.match(/^\/learn\/foundations\/([^/]+)\/([^/]+)$/))) return paths.guide(m[2]);
  if ((m = p.match(/^\/learn\/foundations\/([^/]+)$/))) return TRACK_IDS.has(m[1]) ? paths.track(m[1]) : paths.guides();
  if ((m = p.match(/^\/tools\/([^/]+)$/))) return paths.interactiveItem(m[1]);
  if ((m = p.match(/^\/learn\/by-doing\/([^/]+)$/))) return paths.interactiveItem(m[1]);
  if ((m = p.match(/^\/learn\/([^/]+)$/))) return paths.archiveArticle(m[1]);
  return path;
}

function splitHash(s: string): [string, string] {
  const i = s.indexOf("#");
  return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i)];
}

function splitQuery(s: string): [string, string] {
  const i = s.indexOf("?");
  return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i)];
}

/** True when a path is one of the legacy families above (used to exclude them from prerender). */
export function isLegacyPath(path: string): boolean {
  return rewrite(path) !== path;
}
