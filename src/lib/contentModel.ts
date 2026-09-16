// The one page-metadata shape every content page resolves to, plus resolvers
// for each content source. Pages call the resolver for their type and hand the
// result to <Seo> (src/components/seo/Seo.tsx), so title, description, canonical,
// Open Graph, Twitter, and dates are computed in one place with fallbacks
// instead of per page.
//
// Schema (RESTRUCTURE-PLAN.md section 11):
//   title, slug, section, subsection, tags, summary, publishDate, updatedDate,
//   featuredImage, imageAlt, readingTime, author, status.
//
// Nothing here rewrites body text; summaries either come from an existing
// field (excerpt, definition, description) or from the reviewed drafts in
// foundationsMeta.ts.

import type { SectionId } from "@/lib/taxonomy";
import type { ResearchArticleData } from "@/data/researchTypes";
import type { RatioEntry } from "@/data/ratioAnalysis";
import type { GlossaryDef } from "@/lib/glossary";
import type { Article as LegacyArticle } from "@/data/articles";
import { GUIDE_META } from "@/data/foundationsMeta";
import { getTrack } from "@/lib/taxonomy";

export type ContentStatus = "published" | "draft" | "archived";

export interface PageMeta {
  title: string;
  slug: string;
  section: SectionId;
  subsection: string;
  tags: string[];
  /** 15 to 25 words. Used on cards and as the meta description. */
  summary: string;
  publishDate?: string; // YYYY-MM-DD
  updatedDate?: string; // YYYY-MM-DD
  featuredImage?: string; // absolute or site-relative
  imageAlt?: string;
  readingTime?: number; // minutes
  author: string;
  status: ContentStatus;
}

export const SITE_NAME = "The Valuation Node";
export const SITE_URL = "https://valuationnode.com";
export const DEFAULT_AUTHOR = "Gajji Srinath";
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_IMAGE_ALT = "The Valuation Node: Indian Market Research and Learning";

/**
 * Turn any prose into a description-length string: markdown stripped, cut at a
 * word boundary near `max` characters. Used only as a fallback when a page has
 * no hand-written summary; never as a substitute for one.
 */
export function summarise(text: string | undefined, max = 155): string {
  if (!text) return "";
  const clean = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 3).replace(/\s+\S*$/, "") + "...";
}

function minutes(v: string | number | undefined): number | undefined {
  if (typeof v === "number") return v;
  if (!v) return undefined;
  const m = String(v).match(/\d+/);
  return m ? Number(m[0]) : undefined;
}

// ── Research (Insights & Analysis) ───────────────────────────────────────────
export function researchMeta(a: ResearchArticleData): PageMeta {
  return {
    title: a.title,
    slug: a.slug,
    section: "analysis",
    subsection: a.subsection ?? "valuation-modeling",
    tags: a.tags ?? [],
    summary: a.excerpt || summarise(a.content),
    publishDate: a.publishedAt,
    updatedDate: a.updatedAt ?? a.publishedAt,
    featuredImage: a.ogImage,
    imageAlt: a.ogImage && a.ogImage !== "/og-image.png" ? a.title : undefined,
    readingTime: a.readingTime,
    author: a.author ?? DEFAULT_AUTHOR,
    status: a.status ?? (a.publishedAt ? "published" : "draft"),
  };
}

// ── Concept Guides (former Foundations topics) ───────────────────────────────
export function guideMetaFor(slug: string, readingTime?: string): PageMeta | undefined {
  const g = GUIDE_META[slug];
  if (!g) return undefined;
  return {
    title: g.label,
    slug: g.slug,
    section: "vault",
    subsection: "guides",
    tags: g.tags,
    summary: g.summary,
    updatedDate: g.updatedDate,
    readingTime: minutes(readingTime),
    author: DEFAULT_AUTHOR,
    status: "published",
  };
}

export function trackLabel(track: string): string {
  return getTrack(track)?.label ?? track;
}

// ── Key Formulas & Ratios ────────────────────────────────────────────────────
const RATIO_GROUP_TAGS: Record<string, string[]> = {
  "size-and-price": ["ratios", "valuation", "relative-valuation"],
  "profitability-and-returns": ["ratios", "profitability"],
  "leverage-and-liquidity": ["ratios", "leverage", "liquidity"],
  "efficiency": ["ratios", "efficiency"],
  "cash-flow": ["ratios", "cash-flow", "earnings-quality"],
  "banking": ["ratios", "banking"],
  "growth-and-shareholding": ["ratios", "growth", "equities"],
};

export function ratioMeta(r: RatioEntry): PageMeta {
  return {
    title: r.name,
    slug: r.slug,
    section: "vault",
    subsection: "formulas",
    tags: RATIO_GROUP_TAGS[r.group] ?? ["ratios"],
    summary: r.definition,
    author: DEFAULT_AUTHOR,
    status: "published",
  };
}

// ── Financial Glossary ───────────────────────────────────────────────────────
export const GLOSSARY_CATEGORY_TAGS: Record<string, string[]> = {
  "Basics of Stock Market": ["equities", "indian-markets"],
  "Credit & Debt": ["credit-risk", "bonds"],
  "Investment Planning": ["personal-finance"],
  "Valuation Ratios": ["ratios", "valuation"],
  "Profitability Ratios": ["ratios", "profitability"],
  "Regulatory Compliance": ["regulation"],
  "Macroeconomics": ["macroeconomics"],
  "Technical Analysis": ["technical-analysis"],
  "Risk & Portfolio": ["personal-finance", "equities"],
  "ESG & Governance": ["esg", "corporate-governance"],
  "Taxation": ["taxation"],
  "Fundamentals": ["financial-statements"],
  "Fintech": ["fintech"],
  "Liquidity Ratios": ["ratios", "liquidity"],
  "Solvency Ratios": ["ratios", "leverage"],
  "Mutual Funds": ["funds-and-etfs"],
  "Efficiency Ratios": ["ratios", "efficiency"],
  "Indices": ["indian-markets"],
};

export function glossaryMeta(d: GlossaryDef): PageMeta {
  const base = d.definition || `Definition of ${d.term}`;
  return {
    title: d.term,
    slug: d.slug,
    section: "vault",
    subsection: "glossary",
    tags: (d.category && GLOSSARY_CATEGORY_TAGS[d.category]) || [],
    summary: base.length < 90 && d.whyItMatters ? `${base} ${d.whyItMatters}` : base,
    author: DEFAULT_AUTHOR,
    status: "published",
  };
}

// ── Model Templates & Interactive (calculators + lessons) ────────────────────
export const INTERACTIVE_TAGS: Record<string, string[]> = {
  "dcf-sensitivity": ["dcf", "valuation"],
  "cagr": ["growth", "personal-finance"],
  "wacc": ["cost-of-capital", "dcf"],
  "sip": ["personal-finance", "funds-and-etfs"],
  "future-value": ["personal-finance"],
  "present-value": ["dcf", "personal-finance"],
  "compound-interest": ["personal-finance"],
  "rule-of-72": ["personal-finance"],
  "step-up-sip": ["personal-finance", "funds-and-etfs"],
  "goal-sip": ["personal-finance", "funds-and-etfs"],
  "emi": ["personal-finance"],
  "loan-prepayment": ["personal-finance"],
  "inflation-adjusted-returns": ["personal-finance", "macroeconomics"],
  "build-a-dcf": ["dcf", "valuation"],
  "read-an-income-statement": ["financial-statements"],
  "compute-ratios": ["ratios", "financial-statements"],
  "compare-two-companies": ["ratios", "equities"],
  "spot-the-red-flags": ["red-flags", "earnings-quality"],
};

export function interactiveMeta(input: {
  slug: string;
  title: string;
  description: string;
  kind: "calculator" | "lesson";
  readingTime?: number;
}): PageMeta {
  return {
    title: input.title,
    slug: input.slug,
    section: "vault",
    subsection: "interactive",
    tags: INTERACTIVE_TAGS[input.slug] ?? [],
    summary: input.description,
    readingTime: input.readingTime,
    author: DEFAULT_AUTHOR,
    status: "published",
  };
}

// ── Archive (legacy personal-finance articles) ───────────────────────────────
export const ARCHIVE_TAGS: Record<string, string[]> = {
  "compound-interest-basics": ["personal-finance"],
  "index-funds-101": ["personal-finance", "funds-and-etfs"],
  "building-emergency-fund": ["personal-finance"],
  "50-30-20-budgeting": ["personal-finance"],
  "credit-score-explained": ["personal-finance", "credit-risk"],
  "retirement-planning-basics": ["personal-finance"],
  "tax-deductions-guide": ["personal-finance", "taxation"],
  "debt-payoff-strategies": ["personal-finance"],
  "stock-market-myths": ["equities", "personal-finance"],
  "pe-ratio-explained": ["ratios", "valuation"],
  "technical-analysis-basics": ["technical-analysis"],
};

export function archiveMeta(a: LegacyArticle): PageMeta {
  return {
    title: a.title,
    slug: a.id,
    section: "archive",
    subsection: a.category,
    tags: ARCHIVE_TAGS[a.id] ?? ["personal-finance"],
    summary: a.excerpt,
    publishDate: a.publishedAt,
    featuredImage: a.imageUrl || undefined,
    imageAlt: a.imageUrl ? a.title : undefined,
    readingTime: a.readingTime,
    author: a.author || DEFAULT_AUTHOR,
    status: "archived",
  };
}

// ── Static pages (hubs, about, tools index, etc.) ────────────────────────────
export function staticMeta(input: {
  title: string;
  slug: string;
  section: SectionId;
  subsection?: string;
  summary: string;
  tags?: string[];
  updatedDate?: string;
}): PageMeta {
  return {
    title: input.title,
    slug: input.slug,
    section: input.section,
    subsection: input.subsection ?? "",
    tags: input.tags ?? [],
    summary: input.summary,
    updatedDate: input.updatedDate,
    author: DEFAULT_AUTHOR,
    status: "published",
  };
}
