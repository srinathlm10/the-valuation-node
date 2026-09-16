// Local glossary data access. The glossary lives in src/data/definitions.json
// (version-controlled, prerendered); reading it directly keeps entry pages
// synchronous and lets the build emit static HTML for every term.
//
// Every entry carries an explicit `slug` (added in the restructure so that two
// entries with the same term, e.g. "Market Cap" in Fundamentals and in Basics
// of Stock Market, get distinct URLs instead of shadowing each other).

import definitions from "@/data/definitions.json";
import { termSlug } from "@/lib/relatedContent";

export interface GlossaryDef {
  id: string;
  /** URL slug, unique across the glossary. */
  slug: string;
  term: string;
  fullName?: string;
  category?: string;
  definition?: string;
  formula?: string;
  whyItMatters?: string;
  example?: string;
  relatedTerms?: string[];
}

export const GLOSSARY: GlossaryDef[] = definitions as GlossaryDef[];

const BY_SLUG = new Map<string, GlossaryDef>(GLOSSARY.map((d) => [d.slug, d]));
const BY_TERM = new Map<string, GlossaryDef>();
for (const d of GLOSSARY) {
  const key = termSlug(d.term);
  if (!BY_TERM.has(key)) BY_TERM.set(key, d); // first entry wins for name lookups
}

export function findTerm(slug: string): GlossaryDef | undefined {
  return BY_SLUG.get(slug);
}

/**
 * Resolve a related-term name (free text in `relatedTerms`) to an entry, or
 * undefined when no such term exists. Callers render unresolved names as plain
 * text so the glossary never links to a missing page.
 */
export function findByName(name: string): GlossaryDef | undefined {
  return BY_TERM.get(termSlug(name));
}

/** Entries that share a term name with `d` (the duplicated Basics entries). */
export function siblingsOf(d: GlossaryDef): GlossaryDef[] {
  const key = termSlug(d.term);
  return GLOSSARY.filter((x) => x.slug !== d.slug && termSlug(x.term) === key);
}

export { termSlug };
