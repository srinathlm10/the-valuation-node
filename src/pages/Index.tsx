import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useLatestResearch() {
  return useQuery({
    queryKey: ["research-articles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, cover_image_url, published_at, category, reading_time")
        .eq("status", "published")
        .eq("is_research", true)
        .order("published_at", { ascending: false })
        .limit(4);
      return data ?? [];
    },
  });
}

export default function Index() {
  const { data: researchArticles = [] } = useLatestResearch();
  const featured = researchArticles[0];
  const recent = researchArticles.slice(1, 4);

  const latestResearchHref = featured ? `/research/${featured.slug}` : "/research";

  return (
    <Layout>
      <Helmet>
        <title>The Valuation Node</title>
        <meta
          name="description"
          content="Research and learning on Indian markets, by Srinath Gajji. Original valuations, credit analysis, and a public learning library."
        />
        <meta property="og:title" content="The Valuation Node" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Valuation Node",
          url: "https://valuationnode.com",
          description: "Indian markets research and learning by Srinath Gajji.",
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_65%)] pointer-events-none" />
        <div className="container relative py-24 md:py-32 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary shrink-0" />
            <p className="text-xs font-semibold text-primary tracking-[0.15em] uppercase">
              The Valuation Node
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
            Research and learning<br className="hidden sm:block" /> on Indian markets.
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-lg leading-relaxed">
            Original valuation and credit analysis, plus a public learning library, by Srinath Gajji.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to={latestResearchHref}>
                Latest research <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/learn">Learning library</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured article */}
      <section className="border-b">
        <div className="container py-16 max-w-3xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            Featured research
          </h2>
          {featured ? (
            <article className="rounded-2xl border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
              {featured.cover_image_url && (
                <div className="aspect-[21/9] overflow-hidden bg-muted">
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                {featured.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary">
                    {featured.category}
                  </span>
                )}
                <h2 className="mt-3 text-2xl font-bold leading-snug">
                  <Link to={`/research/${featured.slug}`} className="hover:underline">
                    {featured.title}
                  </Link>
                </h2>
                {featured.excerpt && (
                  <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                )}
                <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {featured.published_at && (
                      <time dateTime={featured.published_at}>
                        {new Date(featured.published_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    {featured.reading_time && (
                      <>
                        <span className="text-border">·</span>
                        <span>{featured.reading_time} min read</span>
                      </>
                    )}
                  </div>
                  <Link
                    to={`/research/${featured.slug}`}
                    className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1.5"
                  >
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">Coming soon — first research piece</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent research */}
      {recent.length > 0 && (
        <section className="border-b">
          <div className="container py-16 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent research
              </h2>
              <Link
                to="/research"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                All research <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recent.map((article: any) => (
                <Link
                  key={article.id}
                  to={`/research/${article.slug}`}
                  className="group block rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  {article.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-semibold leading-snug group-hover:underline">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  {article.published_at && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(article.published_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured learning */}
      <section className="border-b">
        <div className="container py-16 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              From the learning library
            </h2>
            <Link
              to="/learn"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Explore the library <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Flagship card */}
            <div className="md:col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-6 hover:shadow-md transition-shadow">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary">
                Foundations · Valuation
              </span>
              <h3 className="mt-3 text-xl font-bold leading-snug">
                <Link
                  to="/learn/foundations/valuation/dcf-theory-and-mechanics"
                  className="hover:underline"
                >
                  DCF: Theory and Mechanics
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                From first principles to a working DCF model. Intuition, mechanics, and common
                mistakes — with real Indian company numbers.
              </p>
            </div>
            {/* Small cards */}
            <div className="flex flex-col gap-4">
              {[
                { label: "Accounting", title: "Reading an Income Statement", href: "/learn/foundations/accounting/reading-an-income-statement" },
                { label: "Credit Analysis", title: "Credit Risk Fundamentals", href: "/learn/foundations/credit-analysis/credit-risk-fundamentals" },
                { label: "Learn-by-Doing", title: "Build a DCF, Step by Step", href: "/learn/by-doing/build-a-dcf" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group rounded-lg border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <p className="mt-1.5 text-sm font-medium leading-snug group-hover:underline">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About + Newsletter */}
      <section id="newsletter">
        <div className="container py-16 max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Author */}
            <div>
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-5 shadow-md">
                <span className="text-base font-bold text-primary-foreground tracking-tight select-none">SG</span>
              </div>
              <h2 className="text-xl font-bold">Srinath Gajji</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Founder of The Valuation Node. MBA candidate at NIT Rourkela, writing about
                Indian markets from first principles.
              </p>
              <Link
                to="/about"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                More about the site <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Newsletter */}
            <div>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
