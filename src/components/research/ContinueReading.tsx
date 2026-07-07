import { useMemo } from "react";
import { Link } from "react-router-dom";
import { RESEARCH_ARTICLES } from "@/data/research.generated";
import type { ResearchArticleData } from "@/data/researchTypes";
import { useHiddenSlugs } from "@/lib/articleVisibility";

function track(event: string, props?: Record<string, unknown>) {
  if (typeof (window as any).umami !== "undefined") {
    (window as any).umami.track(event, props);
  }
}

interface ContinueReadingProps {
  /** Slug of the page the reader is on, excluded from suggestions and sent as from_slug. */
  currentSlug?: string;
  /** Category to prioritise (same-category articles rank first). */
  category?: string;
  /** Tags to match against candidate articles' tags. */
  tags?: string[];
  /** Section heading. */
  heading?: string;
  /** Max number of cards. */
  limit?: number;
  className?: string;
}

/**
 * "Continue reading" cards. Reusable outside Research (e.g. on Foundations
 * pages), pass the page's category/tags and it suggests related research.
 *
 * Selection: articles sharing the category or overlapping tags rank first
 * (category match weighs more, then tag-overlap count); any remaining slots
 * fill with the most recent other published articles. The current article and
 * anything in the hidden_articles table are never shown.
 */
export function ContinueReading({
  currentSlug,
  category,
  tags = [],
  heading = "Continue reading",
  limit = 3,
  className,
}: ContinueReadingProps) {
  const { data: hidden } = useHiddenSlugs();

  const picks = useMemo(() => {
    const tagSet = new Set(tags.map((t) => t.toLowerCase()));
    const score = (a: ResearchArticleData) => {
      const catScore = category && a.category === category ? 10 : 0;
      const overlap = (a.tags ?? []).filter((t) => tagSet.has(t.toLowerCase())).length;
      return catScore + overlap;
    };
    return RESEARCH_ARTICLES.filter(
      (a) =>
        a.slug !== currentSlug &&
        !!a.publishedAt && // only ever suggest genuinely-published articles, never drafts
        !(hidden?.has(a.slug) ?? false)
    )
      .map((a) => ({ a, s: score(a) }))
      .sort((x, y) => {
        if (y.s !== x.s) return y.s - x.s;
        // RESEARCH_ARTICLES is already newest-first; fall back to date compare
        // for safety when scores tie.
        const dx = x.a.publishedAt ? Date.parse(x.a.publishedAt) : 0;
        const dy = y.a.publishedAt ? Date.parse(y.a.publishedAt) : 0;
        return dy - dx;
      })
      .slice(0, limit)
      .map((x) => x.a);
  }, [currentSlug, category, tags, hidden, limit]);

  if (picks.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
        {heading}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {picks.map((a) => (
          <Link
            key={a.slug}
            to={`/research/${a.slug}`}
            onClick={() =>
              track("Related Article Clicked", { from_slug: currentSlug ?? "", to_slug: a.slug })
            }
            className="group block rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all"
          >
            {a.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary">
                {a.category}
              </span>
            )}
            <h3 className="mt-2.5 font-semibold leading-snug group-hover:underline">{a.title}</h3>
            {(a.metaDescription || a.excerpt) && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {a.metaDescription || a.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
