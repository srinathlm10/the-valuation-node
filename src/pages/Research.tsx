import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { ArrowRight, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RESEARCH_ARTICLES } from "@/data/research.generated";
import { useHiddenSlugs } from "@/lib/articleVisibility";
import { useIsAdmin } from "@/contexts/AuthContext";

const CATEGORIES = ["All", "Valuation", "Credit", "Sector", "ESG", "Fintech", "Methodology"] as const;
const PAGE_SIZE = 10;

function fmtDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function Research() {
  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(0);
  const isAdmin = useIsAdmin();
  const { data: hidden } = useHiddenSlugs();

  const visible = useMemo(() => {
    return RESEARCH_ARTICLES.filter((a) => {
      const isHidden = hidden?.has(a.slug) ?? false;
      // Admins see everything (hidden ones get a badge); everyone else sees only visible.
      if (isHidden && !isAdmin) return false;
      if (category !== "All" && a.category !== category) return false;
      return true;
    });
  }, [category, hidden, isAdmin]);

  const total = visible.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageArticles = visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Layout>
      <Helmet>
        <title>Research - The Valuation Node</title>
        <meta
          name="description"
          content="Original analysis of Indian companies, sectors, and credit. All work is authored, dated, and shows its sources."
        />
        <meta property="og:title" content="Research - The Valuation Node" />
        <link rel="canonical" href="https://valuationnode.com/research" />
      </Helmet>

      <div className="container max-w-4xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Research</h1>
        <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
          Original analysis of Indian companies, sectors, and credit. All work is authored, dated,
          and shows its sources.
        </p>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(0); }}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                category === c
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="mt-10 divide-y">
          {pageArticles.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="text-muted-foreground">No articles yet in this category.</p>
              <NewsletterSignup />
            </div>
          ) : (
            pageArticles.map((article) => {
              const isHidden = hidden?.has(article.slug) ?? false;
              return (
                <article key={article.slug} className="group py-7">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {article.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary">
                            {article.category}
                          </span>
                        )}
                        {isAdmin && isHidden && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                            <EyeOff className="h-3 w-3" /> Hidden
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold leading-snug">
                        <Link to={`/research/${article.slug}`} className="group-hover:underline">
                          {article.title}
                        </Link>
                      </h2>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        {article.publishedAt && (
                          <time dateTime={article.publishedAt}>{fmtDate(article.publishedAt)}</time>
                        )}
                        {article.readingTime && (
                          <>
                            <span className="text-border">·</span>
                            <span>{article.readingTime} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/research/${article.slug}`}
                      className="shrink-0 mt-1 text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
                    >
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full px-5"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full px-5"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
