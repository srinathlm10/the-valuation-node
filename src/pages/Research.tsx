import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArrowRight, EyeOff, FileSearch } from "lucide-react";
import { EmptyState } from "@/components/content/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RESEARCH_ARTICLES } from "@/data/research.generated";
import { useHiddenSlugs } from "@/lib/articleVisibility";
import { useIsAdmin } from "@/contexts/AuthContext";
import { getSection, getSubsection } from "@/lib/taxonomy";
import { paths, researchPath } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";

const PAGE_SIZE = 10;

function fmtDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function Research() {
  const { sub } = useParams<{ sub?: string }>();
  const section = getSection("analysis");
  const subsection = sub ? getSubsection("analysis", sub) : undefined;
  const [page, setPage] = useState(0);
  const isAdmin = useIsAdmin();
  const { data: hidden } = useHiddenSlugs();

  const visible = useMemo(() => {
    return RESEARCH_ARTICLES.filter((a) => {
      const isHidden = hidden?.has(a.slug) ?? false;
      // Admins see everything (hidden ones get a badge); everyone else sees only
      // published, visible articles. Drafts (no honest date) never list publicly.
      if ((isHidden || a.status === "draft") && !isAdmin) return false;
      if (sub && a.subsection !== sub) return false;
      return true;
    });
  }, [sub, hidden, isAdmin]);

  // Sub-sections that have at least one visible article (hidden entries hide their pill too).
  const liveSubs = useMemo(
    () => section.subsections.filter((s) => RESEARCH_ARTICLES.some((a) => a.subsection === s.id && a.status !== "draft" && !(hidden?.has(a.slug) ?? false))),
    [section, hidden]
  );
  const path = sub ? paths.analysisSub(sub) : paths.analysis();

  const total = visible.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageArticles = visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: subsection ? subsection.label : section.label,
          slug: sub ?? "analysis",
          section: "analysis",
          subsection: sub,
          summary: subsection
            ? subsection.description
            : "Original analysis of Indian companies, sectors, and valuation questions. All work is authored, dated, and shows its sources.",
        })}
        path={path}
        titleTag={subsection ? `${subsection.label} - Insights & Analysis - The Valuation Node` : "Insights & Analysis - The Valuation Node"}
        noindex={!!sub && !liveSubs.some((s) => s.id === sub)}
        jsonLd={[
          breadcrumbLd(
            subsection
              ? [{ name: section.label, path: section.path }, { name: subsection.label, path }]
              : [{ name: section.label, path: section.path }]
          ),
        ]}
      />

      <Breadcrumbs
        items={
          subsection
            ? [{ name: section.label, path: section.path }, { name: subsection.label, path }]
            : [{ name: section.label, path: section.path }]
        }
      />
      <div className="container my-8 grid gap-10 lg:grid-cols-[2.3fr_1fr]">
      <div className="min-w-0 py-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">{subsection ? subsection.label : "Insights & Analysis"}</h1>
        <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
          {subsection
            ? subsection.description
            : "Original analysis of Indian companies, sectors, and valuation questions. All work is authored, dated, and shows its sources."}
        </p>

        {/* Sub-section filter (only sub-sections with published work) */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to={paths.analysis()}
            onClick={() => setPage(0)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              !sub
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/50"
            )}
          >
            All
          </Link>
          {liveSubs.map((s) => (
            <Link
              key={s.id}
              to={paths.analysisSub(s.id)}
              onClick={() => setPage(0)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                sub === s.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/50"
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Articles */}
        <div className="mt-10 divide-y">
          {pageArticles.length === 0 ? (
            <div className="py-10 space-y-8">
              <EmptyState
                icon={FileSearch}
                title="No articles in this sub-section yet"
                description="New research is added steadily. Subscribe below to hear when the next piece lands."
              />
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary">
                          {getSubsection("analysis", article.subsection ?? "")?.label ?? article.category}
                        </span>
                        {isAdmin && isHidden && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                            <EyeOff className="h-3 w-3" /> Hidden
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold leading-snug">
                        <Link to={researchPath(article.slug, article.subsection)} className="group-hover:underline">
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
                      to={researchPath(article.slug, article.subsection)}
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
      <Sidebar />
      </div>
    </Layout>
  );
}
