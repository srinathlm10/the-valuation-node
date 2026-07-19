import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RESEARCH_ARTICLES } from "@/data/research.generated";
import { useHiddenSlugs } from "@/lib/articleVisibility";
import { Reveal } from "@/components/content/Reveal";

export default function Index() {
  const { data: hidden } = useHiddenSlugs();
  // Articles come from Git (newest first); hidden ones never appear here.
  const researchArticles = useMemo(
    () => RESEARCH_ARTICLES.filter((a) => !(hidden?.has(a.slug) ?? false)).slice(0, 4),
    [hidden]
  );
  const featured = researchArticles[0];
  const recent = researchArticles.slice(1, 4);

  const latestResearchHref = featured ? `/research/${featured.slug}` : "/research";

  return (
    <Layout>
      <Helmet>
        <title>The Valuation Node: Indian Market Research & Learning</title>
        <meta
          name="description"
          content="Research and learning on Indian markets, by Gajji Srinath. Original valuations, credit analysis, and a public learning library."
        />
        <link rel="canonical" href="https://valuationnode.com/" />
        <meta property="og:title" content="The Valuation Node: Indian Market Research & Learning" />
        <meta property="og:description" content="Original valuation and credit analysis of Indian companies, plus a free learning library covering accounting, valuation, ESG, and fintech." />
        <meta property="og:url" content="https://valuationnode.com/" />
        <meta name="twitter:title" content="The Valuation Node: Indian Market Research & Learning" />
        <meta name="twitter:description" content="Original valuations, credit analysis, and a free learning library on Indian markets. By Gajji Srinath." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Valuation Node",
          url: "https://valuationnode.com",
          description: "Indian markets research and learning by Gajji Srinath.",
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_65%)] pointer-events-none" />
        {/* Node-graph motif: the brand mark, kept faint and decorative */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 lg:block text-primary"
          width="420"
          height="360"
          viewBox="0 0 420 360"
          fill="none"
        >
          <g opacity="0.13">
            <line x1="70" y1="290" x2="180" y2="180" stroke="currentColor" strokeWidth="1.5" />
            <line x1="180" y1="180" x2="310" y2="230" stroke="currentColor" strokeWidth="1.5" />
            <line x1="180" y1="180" x2="250" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <line x1="250" y1="70" x2="360" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="70" y1="290" x2="250" y2="70" stroke="currentColor" strokeWidth="1" />
            <circle cx="70" cy="290" r="10" fill="currentColor" />
            <circle cx="180" cy="180" r="14" fill="currentColor" />
            <circle cx="310" cy="230" r="8" fill="currentColor" />
            <circle cx="250" cy="70" r="11" fill="currentColor" />
            <circle cx="360" cy="120" r="7" fill="currentColor" />
          </g>
        </svg>
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
            Original valuation and credit analysis, plus a public learning library, by Gajji Srinath.
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
            <Reveal>
            <article className="rounded-2xl border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
              {/* Show a cover only when the article has its own image (not the site-wide default). */}
              {featured.ogImage && featured.ogImage !== "/og-image.png" && (
                <div className="aspect-[21/9] overflow-hidden bg-muted">
                  <img
                    src={featured.ogImage}
                    alt={featured.title}
                    loading="lazy"
                    decoding="async"
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
                    {featured.publishedAt && (
                      <time dateTime={featured.publishedAt}>
                        {new Date(featured.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    {featured.readingTime && (
                      <>
                        <span className="text-border">·</span>
                        <span>{featured.readingTime} min read</span>
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
            </Reveal>
          ) : (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">Coming soon, first research piece</p>
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
            <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {recent.map((article) => (
                <Link
                  key={article.slug}
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
                  {article.publishedAt && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            </Reveal>
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
                mistakes, with real Indian company numbers.
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
              <h2 className="text-xl font-bold">Gajji Srinath</h2>
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
