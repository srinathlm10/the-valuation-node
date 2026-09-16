// Shape of a Research article sourced from a Markdown file in src/content/research/.
// The build step (scripts/generateArticles.js) parses each .md file's front-matter
// into this shape and emits src/data/research.generated.ts.

export interface UpdateLogEntry {
  date: string;
  note: string;
}

export interface ResearchArticleData {
  slug: string;
  title: string;
  excerpt: string;
  /** Legacy editorial category (Valuation, Credit, Sector, Methodology). Kept as data. */
  category: string;
  /** Structural placement (see src/lib/taxonomy.ts). Always "analysis" for research. */
  section?: "analysis";
  subsection?: string;
  /** Cross-cutting tags from the 40-tag list. */
  tags?: string[];
  /** Original free-form tags, kept for search and related-article matching. */
  keywords?: string[];
  /** Drafts are never prerendered, listed, or indexed. */
  status?: "published" | "draft";

  // SEO / social
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  ogImage?: string;

  // Dates & meta
  publishedAt?: string; // ISO date
  updatedAt?: string; // ISO date
  readingTime?: number;
  author?: string;

  // Optional rich fields (preserved from the old DB model)
  methodologySummary?: string;
  whereIMightBeWrong?: string;
  citationFormat?: string;
  modelDownloadUrl?: string;
  githubUrl?: string;
  updateLog?: UpdateLogEntry[];
  keyTakeaways?: string[];

  // Markdown body
  content: string;
}
