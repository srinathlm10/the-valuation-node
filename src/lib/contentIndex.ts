// A single flat index of every content page on the site, each with its
// PageMeta and canonical path. Built once at module load from the data files,
// so it works identically during prerender and in the browser.
//
// Used by: section and sub-section landings (filter by section/subsection),
// tag archives (filter by tag), the ESG landing and Technology & AI landing
// (tag aggregation), the home page and sidebars (latest), search, and the
// sitemap / getStaticPaths (via siteRoutes.ts).

import { RESEARCH_ARTICLES } from "@/data/research.generated";
import { FOUNDATIONS_TREE } from "@/data/foundationsTree";
import { FOUNDATIONS_CONTENT } from "@/data/foundationsContent";
import { GUIDE_META } from "@/data/foundationsMeta";
import { RATIOS } from "@/data/ratioAnalysis";
import { GLOSSARY } from "@/lib/glossary";
import { TOOL_META } from "@/data/tools";
import { LESSONS } from "@/data/lessons";
import { articles as LEGACY_ARTICLES } from "@/data/articles";
import {
  archiveMeta,
  glossaryMeta,
  guideMetaFor,
  interactiveMeta,
  ratioMeta,
  researchMeta,
  staticMeta,
  type PageMeta,
} from "@/lib/contentModel";
import { paths, researchPath } from "@/lib/routes";
import { TRACKS, type SectionId } from "@/lib/taxonomy";

export type ContentKind =
  | "article"
  | "guide"
  | "course"
  | "track"
  | "formula"
  | "term"
  | "calculator"
  | "lesson"
  | "news"
  | "archive";

export interface ContentItem {
  kind: ContentKind;
  path: string;
  meta: PageMeta;
  /** Guide track id, for guides and courses. */
  track?: string;
  /** Legacy path this item used to live at (for reference only). */
  legacyPath?: string;
}

// ── Legacy course pages (orphaned FA/TA course text, restored as guides) ────
export const COURSES = [
  {
    slug: "fundamental-analysis-course",
    title: "Fundamental Analysis: The Complete Course",
    track: "financial-statement-analysis",
    tags: ["financial-statements", "ratios", "valuation", "red-flags"],
    summary:
      "The original fundamental analysis course: approaches, qualitative factors, the three statements, ratio categories, sector checks, red flags, and valuation models.",
    legacyPath: "/learn/fundamental-analysis",
  },
  {
    slug: "technical-analysis-course",
    title: "Technical Analysis: The Complete Course",
    track: "markets-and-instruments",
    tags: ["technical-analysis", "equities"],
    summary:
      "The original technical analysis course: charts, trends, support and resistance, indicators, patterns, and how to use them alongside fundamentals.",
    legacyPath: "/learn/technical-analysis",
  },
] as const;

function build(): ContentItem[] {
  const items: ContentItem[] = [];

  // Research (Insights & Analysis). Drafts are indexed so admins can find
  // them, but every consumer filters on meta.status.
  for (const a of RESEARCH_ARTICLES) {
    items.push({
      kind: "article",
      path: researchPath(a.slug, a.subsection),
      meta: researchMeta(a),
      legacyPath: `/research/${a.slug}`,
    });
  }

  // Concept Guides: 51 topics
  for (const section of FOUNDATIONS_TREE) {
    for (const t of section.topics) {
      if (!t.published) continue;
      const content = FOUNDATIONS_CONTENT[t.slug];
      const meta =
        guideMetaFor(t.slug, content?.readingTime) ??
        staticMeta({ title: t.label, slug: t.slug, section: "vault", subsection: "guides", summary: t.label });
      items.push({
        kind: "guide",
        path: paths.guide(t.slug),
        meta,
        track: GUIDE_META[t.slug]?.track ?? section.section,
        legacyPath: `/learn/foundations/${section.section}/${t.slug}`,
      });
    }
  }

  // Legacy courses
  for (const c of COURSES) {
    items.push({
      kind: "course",
      path: paths.guide(c.slug),
      meta: staticMeta({
        title: c.title,
        slug: c.slug,
        section: "vault",
        subsection: "guides",
        tags: [...c.tags],
        summary: c.summary,
      }),
      track: c.track,
      legacyPath: c.legacyPath,
    });
  }

  // Track landings
  for (const tr of TRACKS) {
    items.push({
      kind: "track",
      path: paths.track(tr.id),
      meta: staticMeta({
        title: `${tr.label} Guides`,
        slug: tr.id,
        section: "vault",
        subsection: "guides",
        summary: tr.description,
      }),
      track: tr.id,
      legacyPath: `/learn/foundations/${tr.id}`,
    });
  }

  // Formulas & Ratios
  for (const r of RATIOS) {
    items.push({ kind: "formula", path: paths.formula(r.slug), meta: ratioMeta(r), legacyPath: `/learn/ratio-analysis/${r.slug}` });
  }

  // Glossary
  for (const d of GLOSSARY) {
    items.push({ kind: "term", path: paths.glossaryTerm(d.slug), meta: glossaryMeta(d), legacyPath: `/learn/glossary/${d.slug}` });
  }

  // Interactive: calculators (12 in TOOL_META + the DCF sensitivity page) and lessons
  for (const [slug, t] of Object.entries(TOOL_META)) {
    items.push({
      kind: "calculator",
      path: paths.interactiveItem(slug),
      meta: interactiveMeta({ slug, title: t.label, description: t.description, kind: "calculator" }),
      legacyPath: `/tools/${slug}`,
    });
  }
  items.push({
    kind: "calculator",
    path: paths.interactiveItem("dcf-sensitivity"),
    meta: interactiveMeta({
      slug: "dcf-sensitivity",
      title: "DCF Sensitivity Calculator",
      description: "Two-stage DCF model with live sliders, a 5x5 sensitivity grid across WACC and terminal growth, and Excel export.",
      kind: "calculator",
    }),
    legacyPath: "/tools/dcf-sensitivity",
  });
  for (const l of LESSONS) {
    items.push({
      kind: "lesson",
      path: paths.interactiveItem(l.slug),
      meta: interactiveMeta({ slug: l.slug, title: l.title, description: l.description, kind: "lesson" }),
      legacyPath: `/learn/by-doing/${l.slug}`,
    });
  }

  // News & Trends data pages
  items.push({
    kind: "news",
    path: paths.nifty50(),
    meta: staticMeta({
      title: "Nifty 50 Fundamentals",
      slug: "nifty-50",
      section: "news",
      subsection: "markets-news",
      tags: ["indian-markets", "equities", "macroeconomics"],
      summary: "Fundamental snapshot of Nifty 50 constituents: market cap, P/E, P/B, ROE, debt to equity, and dividend yield, sortable by sector.",
    }),
    legacyPath: "/markets/nifty50",
  });
  items.push({
    kind: "news",
    path: paths.compliance(),
    meta: staticMeta({
      title: "Compliance Calendar",
      slug: "compliance-calendar",
      section: "news",
      subsection: "economy-policy",
      tags: ["regulation", "indian-markets"],
      summary: "SEBI, NSE, and BSE regulatory circulars summarised in plain language for Indian market participants, with dates and source links.",
    }),
    legacyPath: "/markets/compliance",
  });

  // Archive (legacy personal-finance articles)
  for (const a of LEGACY_ARTICLES) {
    items.push({ kind: "archive", path: paths.archiveArticle(a.id), meta: archiveMeta(a), legacyPath: `/learn/${a.id}` });
  }

  return items;
}

export const CONTENT_INDEX: ContentItem[] = build();

const PUBLISHED = CONTENT_INDEX.filter((i) => i.meta.status === "published");

/** Everything publicly listable (drafts and archived items excluded). */
export function publishedItems(): ContentItem[] {
  return PUBLISHED;
}

export function itemsInSection(section: SectionId, subsection?: string): ContentItem[] {
  return PUBLISHED.filter(
    (i) => i.meta.section === section && (subsection ? i.meta.subsection === subsection : true) && i.kind !== "track"
  );
}

export function itemsWithTag(tag: string): ContentItem[] {
  return PUBLISHED.filter((i) => i.meta.tags.includes(tag));
}

export function itemsInTrack(track: string): ContentItem[] {
  return PUBLISHED.filter((i) => i.track === track && (i.kind === "guide" || i.kind === "course"));
}

/** Sub-sections that have at least one item (used to hide empty menu entries). */
export function subsectionHasContent(section: SectionId, subsection: string): boolean {
  return itemsInSection(section, subsection).length > 0;
}

/** Tag ids that have at least one item, with counts. */
export function tagCounts(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const i of PUBLISHED) for (const t of i.meta.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

/** Dated items newest first (articles first, then anything with a date). */
export function latestItems(limit = 5): ContentItem[] {
  return PUBLISHED.filter((i) => i.meta.publishDate)
    .sort((a, b) => (b.meta.publishDate ?? "").localeCompare(a.meta.publishDate ?? ""))
    .slice(0, limit);
}

export function findByPath(path: string): ContentItem | undefined {
  return CONTENT_INDEX.find((i) => i.path === path);
}

// ── Tag aggregation for sections that have no pages of their own ─────────────
// ESG & Sustainability and Technology & AI list Concept Guides that live in the
// Vault (owner decision: teaching content stays in the Vault, sections
// aggregate by tag). RESTRUCTURE-PLAN.md flags V2 and N1.
interface Aggregation {
  tags?: string[];
  slugs?: string[];
}

const AGGREGATIONS: Record<string, Aggregation> = {
  "esg": { tags: ["esg"] },
  "esg/green-finance": { tags: ["green-finance"] },
  "esg/esg-ratings-frameworks": { tags: ["esg-reporting", "climate-risk"], slugs: ["esg-fundamentals"] },
  "esg/impact-investing": { slugs: ["esg-integrated-valuation"] },
  "esg/corporate-governance": { tags: ["corporate-governance"] },
  "news/technology-ai": { tags: ["fintech"] },
};

/**
 * Items shown on a section or sub-section landing: the section's own pages
 * plus anything pulled in by the aggregation rules above. Glossary terms are
 * left out of aggregations so a landing is not 60 definitions long.
 */
export function landingItems(section: SectionId, subsection?: string): ContentItem[] {
  const own = itemsInSection(section, subsection);
  const rule = AGGREGATIONS[subsection ? `${section}/${subsection}` : section];
  if (!rule) return own;
  const seen = new Set(own.map((i) => i.path));
  const extra = PUBLISHED.filter((i) => {
    if (seen.has(i.path) || i.kind === "term" || i.kind === "track") return false;
    if (rule.slugs?.includes(i.meta.slug)) return true;
    return rule.tags?.some((t) => i.meta.tags.includes(t)) ?? false;
  });
  return [...own, ...extra];
}

export function landingHasContent(section: SectionId, subsection?: string): boolean {
  return landingItems(section, subsection).length > 0;
}
