// Shared SEO helpers: breadcrumb structured data and meta-description
// generation from content text. Keep all schema shapes here so pages stay thin.

const BASE = "https://valuationnode.com";

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList JSON-LD from an ordered list of crumbs (paths start with /). */
export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: BASE + it.path,
    })),
  };
}

/** Publisher object with logo, required for Article rich results. */
export const PUBLISHER = {
  "@type": "Organization",
  name: "The Valuation Node",
  logo: {
    "@type": "ImageObject",
    url: BASE + "/logo.png",
  },
};

/**
 * Turn the opening of a markdown string into a clean meta description:
 * links flattened, formatting stripped, cut at a word boundary near 155 chars.
 */
export function metaFromMarkdown(md: string | undefined, fallback: string): string {
  if (!md) return fallback;
  const text = md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 158) return text;
  return text.slice(0, 152).replace(/\s+\S*$/, "") + "...";
}
