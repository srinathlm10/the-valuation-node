import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, ArrowLeft, Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      return data;
    },
  });
}

function useRelatedArticles(articleId: string, category: string) {
  return useQuery({
    queryKey: ["related", articleId, category],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, slug, category, published_at, reading_time")
        .eq("status", "published")
        .eq("is_research", true)
        .eq("category", category)
        .neq("id", articleId)
        .limit(3);
      return data ?? [];
    },
    enabled: !!articleId && !!category,
  });
}

function CitationBlock({ article }: { article: any }) {
  const [copied, setCopied] = useState(false);
  const citation =
    article.citation_format ||
    `Gajji, S. (${new Date(article.published_at).getFullYear()}). "${article.title}." The Valuation Node. https://thevaluationnode.com/research/${article.slug}`;

  const copy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground font-mono leading-relaxed">{citation}</p>
        <button
          onClick={copy}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy citation"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

export default function ResearchArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug!);
  const { data: related = [] } = useRelatedArticles(
    article?.id ?? "",
    article?.category ?? ""
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center text-muted-foreground text-sm">
          Loading…
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center">
          <p className="text-muted-foreground">Article not found.</p>
          <Link to="/research" className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Research
          </Link>
        </div>
      </Layout>
    );
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Layout>
      <Helmet>
        <title>{article.title} - The Valuation Node</title>
        <meta name="description" content={article.excerpt || `Research article: ${article.title}`} />
        <meta property="og:title" content={`${article.title} - The Valuation Node`} />
        <meta property="og:description" content={article.excerpt || ""} />
        <meta property="og:type" content="article" />
        {article.cover_image_url && <meta property="og:image" content={article.cover_image_url} />}
        <meta property="article:published_time" content={article.published_at || ""} />
        <link rel="canonical" href={`https://thevaluationnode.com/research/${slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          datePublished: article.published_at,
          dateModified: article.updated_at || article.published_at,
          author: { "@type": "Person", name: "Srinath Gajji" },
          publisher: { "@type": "Organization", name: "The Valuation Node" },
        })}</script>
      </Helmet>

      <article className="container max-w-3xl py-14">
        {/* Back */}
        <Link
          to="/research"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Research
        </Link>

        {/* Cover */}
        {article.cover_image_url && (
          <div className="mb-8 aspect-[2/1] overflow-hidden rounded-xl bg-muted">
            <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Category + tags */}
        {article.category && (
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {article.category}
          </span>
        )}

        {/* Title */}
        <h1 className="mt-2 text-3xl font-bold tracking-tight leading-tight">{article.title}</h1>

        {/* Dek */}
        {article.excerpt && (
          <p className="mt-3 text-lg text-muted-foreground italic leading-relaxed">{article.excerpt}</p>
        )}

        {/* Byline */}
        <div className="mt-6 flex items-center gap-3">
          {/* TODO: Replace with actual author photo */}
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
            <span className="text-xs text-muted-foreground">SG</span>
          </div>
          <div>
            <p className="text-sm font-medium">Srinath Gajji, Founder, The Valuation Node</p>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
              {publishedDate && <time dateTime={article.published_at}>{publishedDate}</time>}
              {article.reading_time && <span>{article.reading_time} min read</span>}
            </div>
          </div>
        </div>

        {/* Methodology box */}
        {(article as any).methodology_summary && (
          <div className="mt-8">
            <Collapsible title="Methodology" defaultOpen>
              <p className="text-sm text-muted-foreground">{(article as any).methodology_summary}</p>
            </Collapsible>
          </div>
        )}

        {/* Body */}
        <div className="mt-10 prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown>{article.content || ""}</ReactMarkdown>
        </div>

        {/* Downloads */}
        <div className="mt-10 flex flex-wrap gap-3">
          {(article as any).model_download_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={(article as any).model_download_url} download>
                <Download className="mr-2 h-4 w-4" />
                Download Excel model
              </a>
            </Button>
          )}
          {(article as any).github_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={(article as any).github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          )}
        </div>

        {/* Where I might be wrong */}
        {(article as any).where_i_might_be_wrong && (
          <div className="mt-10 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-6">
            <h2 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">
              Where I might be wrong
            </h2>
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown>{(article as any).where_i_might_be_wrong}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Citation */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-3">Cite this article</h2>
          <CitationBlock article={article} />
        </div>

        {/* Update log */}
        {Array.isArray((article as any).update_log) && (article as any).update_log.length > 0 && (
          <div className="mt-8">
            <Collapsible title="Update log">
              <ul className="text-sm text-muted-foreground space-y-2">
                {(article as any).update_log.map((entry: any, i: number) => (
                  <li key={i}>
                    <span className="font-medium">{entry.date}</span>: {entry.note}
                  </li>
                ))}
              </ul>
            </Collapsible>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-14">
          <NewsletterSignup />
        </div>

        {/* Author card */}
        <div className="mt-10 rounded-xl border p-6 flex gap-4 items-start">
          {/* TODO: Replace with actual author photo */}
          <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
            <span className="text-xs text-muted-foreground">SG</span>
          </div>
          <div>
            <p className="font-semibold">Srinath Gajji</p>
            <p className="text-sm text-muted-foreground mt-1">
              Founder of The Valuation Node. MBA candidate at NIT Rourkela.
              {/* TODO: Full author bio. Srinath to fill. */}
            </p>
            <a
              href="https://www.linkedin.com/in/gajji-srinath/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-muted-foreground hover:text-foreground underline"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
              Related research
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r: any) => (
                <article key={r.id}>
                  {r.category && (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {r.category}
                    </span>
                  )}
                  <h3 className="mt-1 text-sm font-medium leading-snug">
                    <Link to={`/research/${r.slug}`} className="hover:underline">{r.title}</Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}
