import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { useState, useMemo } from "react";
import { Copy, Check, ArrowLeft, Download, Github, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESEARCH_ARTICLES } from "@/data/research.generated";
import type { ResearchArticleData } from "@/data/researchTypes";
import { useHiddenSlugs, useToggleHidden } from "@/lib/articleVisibility";
import { useIsAdmin } from "@/contexts/AuthContext";
import { ContinueReading } from "@/components/research/ContinueReading";
import { Prose } from "@/components/content/Prose";
import { Callout } from "@/components/content/Callout";
import { CollapsibleSection } from "@/components/content/CollapsibleSection";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { TableOfContents, tocFromMarkdown } from "@/components/content/TableOfContents";
import { slugify } from "@/components/content/Prose";
import { breadcrumbLd, PUBLISHER } from "@/lib/seo";

function fmtDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function CitationBlock({ article }: { article: ResearchArticleData }) {
  const [copied, setCopied] = useState(false);
  const citation =
    article.citationFormat ||
    `Gajji, S. (${article.publishedAt ? new Date(article.publishedAt).getFullYear() : new Date().getFullYear()}). "${article.title}." The Valuation Node. https://valuationnode.com/research/${article.slug}`;

  const copy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground font-mono leading-relaxed">{citation}</p>
        <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy citation">
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function AdminBar({ article, isHidden }: { article: ResearchArticleData; isHidden: boolean }) {
  const toggle = useToggleHidden();
  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-dashed p-3 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {isHidden ? (
          <><EyeOff className="h-4 w-4 text-amber-500" /> This article is <strong className="text-foreground">hidden</strong> from the public.</>
        ) : (
          <><Eye className="h-4 w-4 text-emerald-500" /> This article is <strong className="text-foreground">live</strong>.</>
        )}
      </span>
      <Button
        size="sm"
        variant={isHidden ? "default" : "outline"}
        disabled={toggle.isPending}
        onClick={() => toggle.mutate({ slug: article.slug, hide: !isHidden })}
      >
        {toggle.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isHidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
        {isHidden ? "Unhide" : "Hide"}
      </Button>
    </div>
  );
}

export default function ResearchArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = useMemo(() => RESEARCH_ARTICLES.find((a) => a.slug === slug), [slug]);
  const isAdmin = useIsAdmin();
  const { data: hidden } = useHiddenSlugs();
  const isHidden = hidden?.has(slug ?? "") ?? false;

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

  // Hidden + not admin → "temporarily unavailable" state.
  if (isHidden && !isAdmin) {
    return (
      <Layout>
        <Helmet>
          <title>Temporarily unavailable - The Valuation Node</title>
          <meta name="robots" content="noindex" />
          <link rel="canonical" href={`https://valuationnode.com/research/${article.slug}`} />
        </Helmet>
        <div className="container max-w-2xl py-24 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <EyeOff className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">This article is temporarily unavailable</h1>
          <p className="mt-3 text-muted-foreground">
            It may be under revision. Please check back shortly, or browse other research in the meantime.
          </p>
          <Link to="/research" className="mt-6 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Research
          </Link>
          <div className="mt-10">
            <NewsletterSignup />
          </div>
        </div>
      </Layout>
    );
  }

  const toc = tocFromMarkdown(article.content, slugify);
  const publishedDate = fmtDate(article.publishedAt);
  // Social scrapers need an absolute og:image URL.
  const ogImageAbs = article.ogImage
    ? article.ogImage.startsWith("http")
      ? article.ogImage
      : `https://valuationnode.com${article.ogImage.startsWith("/") ? "" : "/"}${article.ogImage}`
    : undefined;

  return (
    <Layout>
      <Helmet>
        <title>{article.metaTitle || `${article.title} - The Valuation Node`}</title>
        <meta name="description" content={article.metaDescription || article.excerpt} />
        <meta property="og:title" content={article.metaTitle || `${article.title} - The Valuation Node`} />
        <meta property="og:description" content={article.metaDescription || article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={article.canonical || `https://valuationnode.com/research/${article.slug}`} />
        {ogImageAbs && <meta property="og:image" content={ogImageAbs} />}
        <meta name="twitter:card" content="summary_large_image" />
        {article.publishedAt && <meta property="article:published_time" content={article.publishedAt} />}
        {article.updatedAt && <meta property="article:modified_time" content={article.updatedAt} />}
        <link rel="canonical" href={article.canonical || `https://valuationnode.com/research/${article.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          articleSection: article.category,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt || article.publishedAt,
          image: ogImageAbs,
          author: { "@type": "Person", name: article.author || "Gajji Srinath", url: "https://valuationnode.com/about/author" },
          publisher: PUBLISHER,
          mainEntityOfPage: article.canonical || `https://valuationnode.com/research/${article.slug}`,
        })}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd([
          { name: "Research", path: "/research" },
          { name: article.title, path: `/research/${article.slug}` },
        ]))}</script>
      </Helmet>

      <ReadingProgress />

      <div className="container py-14 max-w-3xl xl:max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_230px] xl:gap-12">
      <article className="min-w-0 w-full max-w-3xl mx-auto xl:mx-0">
        {/* Back link: block-level (flex, not inline-flex) so the category
            badge below never shares its line. */}
        <Link to="/research" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Research
        </Link>

        {isAdmin && <AdminBar article={article} isHidden={isHidden} />}

        {/* Category */}
        {article.category && (
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary">
              {article.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="mt-2 text-3xl font-bold tracking-tight leading-tight">{article.title}</h1>

        {/* Dek */}
        {article.excerpt && (
          <p className="mt-3 text-lg text-muted-foreground italic leading-relaxed font-serif">{article.excerpt}</p>
        )}

        {/* Byline */}
        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
            <span className="text-xs text-muted-foreground">SG</span>
          </div>
          <div>
            <p className="text-sm font-medium">{article.author || "Gajji Srinath"}, Founder, The Valuation Node</p>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
              {publishedDate && <time dateTime={article.publishedAt}>{publishedDate}</time>}
              {article.readingTime && <span>{article.readingTime} min read</span>}
            </div>
          </div>
        </div>

        {/* Methodology callout */}
        {article.methodologySummary && (
          <Callout variant="methodology" title="Methodology" titleAs="h2" className="mt-8">
            <p>{article.methodologySummary}</p>
          </Callout>
        )}

        {/* Key takeaways */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mt-8 rounded-xl border bg-muted/20 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key takeaways</h2>
            <ul className="mt-3 space-y-2">
              {article.keyTakeaways.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Body */}
        <Prose className="mt-10">{article.content}</Prose>

        {/* Downloads */}
        {(article.modelDownloadUrl || article.githubUrl) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {article.modelDownloadUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={article.modelDownloadUrl} download>
                  <Download className="mr-2 h-4 w-4" /> Download Excel model
                </a>
              </Button>
            )}
            {article.githubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={article.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Where I might be wrong */}
        {article.whereIMightBeWrong && (
          <Callout variant="warning" title="Where I might be wrong" titleAs="h2" className="mt-10">
            <Prose size="sm" serif={false}>{article.whereIMightBeWrong}</Prose>
          </Callout>
        )}

        {/* Citation */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-3">Cite this article</h2>
          <CitationBlock article={article} />
        </div>

        {/* Update log */}
        {Array.isArray(article.updateLog) && article.updateLog.length > 0 && (
          <div className="mt-8">
            <CollapsibleSection title="Update log">
              <ul className="text-sm text-muted-foreground space-y-2">
                {article.updateLog.map((entry, i) => (
                  <li key={i}>
                    <span className="font-medium">{entry.date}</span>: {entry.note}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-14">
          <NewsletterSignup />
        </div>

        {/* Author card */}
        <div className="mt-10 rounded-xl border p-6 flex gap-4 items-start">
          <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
            <span className="text-xs text-muted-foreground">SG</span>
          </div>
          <div>
            <p className="font-semibold">Gajji Srinath</p>
            <p className="text-sm text-muted-foreground mt-1">
              Founder of The Valuation Node. MBA candidate at NIT Rourkela.
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

        {/* Continue reading */}
        <ContinueReading
          className="mt-14"
          currentSlug={article.slug}
          category={article.category}
          tags={article.tags}
        />
      </article>

      {toc.length >= 3 && (
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>
      )}
      </div>
    </Layout>
  );
}
