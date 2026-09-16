import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { ContentList } from "@/components/content/ContentList";
import { staticMeta } from "@/lib/contentModel";
import { publishedItems, type ContentItem, type ContentKind } from "@/lib/contentIndex";
import { tagLabel } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";

/**
 * /search?q=... : a full-page, linkable version of the search overlay. Same
 * index and ranking; results grouped with Vault entries first. The page is
 * noindex (query pages should not be crawled) but works without JavaScript
 * for the query it was prerendered with (none) and hydrates for live queries.
 */

const ORDER: { kinds: ContentKind[]; heading: string }[] = [
  { kinds: ["term"], heading: "Glossary" },
  { kinds: ["formula"], heading: "Formulas & Ratios" },
  { kinds: ["guide", "course", "track"], heading: "Concept Guides" },
  { kinds: ["calculator", "lesson"], heading: "Interactive" },
  { kinds: ["article"], heading: "Insights & Analysis" },
  { kinds: ["news"], heading: "News & Trends" },
];

function score(item: ContentItem, q: string): number {
  const title = item.meta.title.toLowerCase();
  const summary = item.meta.summary.toLowerCase();
  const tags = item.meta.tags.map(tagLabel).join(" ").toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (tags.includes(q)) return 30;
  if (summary.includes(q)) return 20;
  return 0;
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const ql = q.toLowerCase();

  const groups = useMemo(() => {
    if (!ql) return [];
    const items = publishedItems();
    return ORDER.map((g) => ({
      heading: g.heading,
      items: items
        .filter((i) => g.kinds.includes(i.kind))
        .map((i) => ({ i, s: score(i, ql) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 12)
        .map((x) => x.i),
    })).filter((g) => g.items.length > 0);
  }, [ql]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <Layout>
      <Seo
        meta={staticMeta({ title: q ? `Search: ${q}` : "Search", slug: "search", section: "vault", summary: "Search every glossary term, formula, guide, tool, and analysis on The Valuation Node." })}
        path="/search"
        titleTag={q ? `Search results for "${q}" - The Valuation Node` : "Search - The Valuation Node"}
        noindex
        jsonLd={[breadcrumbLd([{ name: "Search", path: "/search" }])]}
      />
      <Breadcrumbs items={[{ name: "Search", path: "/search" }]} />
      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">{q ? `Results for "${q}"` : "Search"}</h1>
        <form action="/search" method="get" role="search" className="mt-6 flex max-w-xl">
          <label htmlFor="search-q" className="sr-only">Search the site</label>
          <input
            id="search-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search terms, formulas, guides, analysis..."
            className="w-full border border-border bg-background px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button type="submit" className="bg-brand-navy px-4 text-white hover:bg-brand-navy-hover" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </form>

        {q && total === 0 && (
          <p className="mt-10 text-muted-foreground">
            Nothing matched. Try a shorter word, or browse{" "}
            <Link to={paths.glossary()} className="underline">the glossary</Link> or{" "}
            <Link to={paths.tags()} className="underline">topics</Link>.
          </p>
        )}
        {q && total > 0 && <p className="mt-4 text-sm text-muted-foreground">{total} results, Vault entries first.</p>}

        {groups.map((g) => (
          <section key={g.heading} className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">{g.heading}</h2>
            <ContentList items={g.items} className="mt-5" />
          </section>
        ))}

        {!q && (
          <p className="mt-10 text-sm text-muted-foreground">
            Tip: press <kbd className="rounded border bg-muted px-1.5 font-mono text-xs">Ctrl</kbd> + <kbd className="rounded border bg-muted px-1.5 font-mono text-xs">K</kbd> anywhere on the site to search instantly.
          </p>
        )}
      </div>
    </Layout>
  );
}
