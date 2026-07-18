// Local glossary data access. The glossary lives in src/data/definitions.json
// (version-controlled, prerendered); reading it directly keeps entry pages
// synchronous and lets the build emit static HTML for every term.

import definitions from "@/data/definitions.json";
import { termSlug } from "@/lib/relatedContent";

export interface GlossaryDef {
  id: string;
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

export function findTerm(slug: string): GlossaryDef | undefined {
  return GLOSSARY.find((d) => termSlug(d.term) === slug);
}

export { termSlug };
