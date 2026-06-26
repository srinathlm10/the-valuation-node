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
          url: "https://thevaluationnode.com",
          description: "Indian markets research and learning by Srinath Gajji.",
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="border-b bg-background">
        <div className="container py-20 md:py-28 max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wide uppercase">
            The Valuation Node
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Research and learning on Indian markets.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            Original valuation and credit analysis, plus a public learning library, by Srinath Gajji.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={latestResearchHref}>
                Read the latest research <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/learn">Explore the learning library</Link>
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
            <article>
              {featured.cover_image_url && (
                <div className="mb-6 aspect-[2/1] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {featured.category && (
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {featured.category}
                </span>
              )}
              <h2 className="mt-2 text-2xl font-bold leading-snug">
                <Link to={`/research/${featured.slug}`} className="hover:underline">
                  {featured.title}
                </Link>
              </h2>
              {featured.excerpt && (
                <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                {featured.published_at && (
                  <time dateTime={featured.published_at}>
                    {new Date(featured.published_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                {featured.reading_time && <span>{featured.reading_time} min read</span>}
              </div>
              <div className="mt-5">
                <Link
                  to={`/research/${featured.slug}`}
                  className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1"
                >
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ) : (
            <p className="text-muted-foreground">Coming soon: first research piece</p>
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
            <div className="grid gap-8 md:grid-cols-3">
              {recent.map((article: any) => (
                <article key={article.id}>
                  {article.category && (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-1 font-semibold leading-snug">
                    <Link to={`/research/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>
                  {article.published_at && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(article.published_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </article>
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
            <div className="md:col-span-2 rounded-xl border bg-muted/20 p-6">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Foundations · Valuation
              </span>
              <h3 className="mt-2 text-xl font-bold leading-snug">
                <Link
                  to="/learn/foundations/valuation/dcf-theory-and-mechanics"
                  className="hover:underline"
                >
                  DCF: Theory and Mechanics
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                From first principles to a working DCF model. Intuition, mechanics, and common
                mistakes - with real Indian company numbers.
              </p>
            </div>
            {/* Small cards */}
            <div className="flex flex-col gap-4">
              {[
                { label: "Accounting", title: "Reading an Income Statement", href: "/learn/foundations/accounting/reading-an-income-statement" },
                { label: "Credit Analysis", title: "Credit Risk Fundamentals", href: "/learn/foundations/credit-analysis/credit-risk-fundamentals" },
                { label: "Learn-by-Doing", title: "Build a DCF, Step by Step", href: "/learn/by-doing/build-a-dcf" },
              ].map((item) => (
                <div key={item.href} className="rounded-lg border bg-muted/10 p-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <p className="mt-1 text-sm font-medium leading-snug">
                    <Link to={item.href} className="hover:underline">{item.title}</Link>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About + Newsletter */}
      <section className="border-b" id="newsletter">
        <div className="container py-16 max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Author */}
            <div>
              {/* TODO: Replace with actual author photo */}
              <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center mb-4">
                <span className="text-xs text-muted-foreground text-center px-2">
                  [Photo placeholder]
                </span>
              </div>
              <h2 className="text-xl font-bold">Srinath Gajji</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {/* TODO: Author bio, 2-3 sentences. Srinath to fill. */}
                Founder of The Valuation Node. MBA candidate at NIT Rourkela, writing about
                Indian markets from first principles.
              </p>
              <Link
                to="/about"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
              >
                Read more about the site <ArrowRight className="h-3.5 w-3.5" />
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
