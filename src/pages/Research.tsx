import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Valuation", "Credit", "Sector", "ESG", "Fintech", "Methodology"] as const;
const PAGE_SIZE = 10;

function useResearchArticles(category: string, page: number) {
  return useQuery({
    queryKey: ["research", category, page],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("id, title, slug, excerpt, published_at, category, reading_time", { count: "exact" })
        .eq("status", "published")
        .eq("is_research", true)
        .order("published_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (category !== "All") {
        q = q.eq("category", category);
      }

      const { data, count } = await q;
      return { articles: data ?? [], total: count ?? 0 };
    },
  });
}

export default function Research() {
  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(0);
  const { data, isLoading } = useResearchArticles(category, page);
  const articles = data?.articles ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Layout>
      <Helmet>
        <title>Research — The Valuation Node</title>
        <meta
          name="description"
          content="Original analysis of Indian companies, sectors, and credit. All work is authored, dated, and shows its sources."
        />
        <meta property="og:title" content="Research — The Valuation Node" />
        <link rel="canonical" href="https://thevaluationnode.com/research" />
      </Helmet>

      <div className="container max-w-4xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Research</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
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
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="mt-10 divide-y">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">Loading…</div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="text-muted-foreground">No articles yet in this category.</p>
              <NewsletterSignup />
            </div>
          ) : (
            articles.map((article: any) => (
              <article key={article.id} className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {article.category && (
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {article.category}
                      </span>
                    )}
                    <h2 className="mt-1 text-lg font-semibold leading-snug">
                      <Link to={`/research/${article.slug}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      {article.published_at && (
                        <time dateTime={article.published_at}>
                          {new Date(article.published_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      )}
                      {article.reading_time && <span>{article.reading_time} min read</span>}
                    </div>
                  </div>
                  <Link
                    to={`/research/${article.slug}`}
                    className="shrink-0 text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1"
                  >
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))
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
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
