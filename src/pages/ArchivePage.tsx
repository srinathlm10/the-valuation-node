import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { Prose } from "@/components/content/Prose";
import { Callout } from "@/components/content/Callout";
import { ContentList } from "@/components/content/ContentList";
import { EmptyState } from "@/components/content/EmptyState";
import { Quiz } from "@/components/quiz/Quiz";
import { articles as LEGACY_ARTICLES, categories as LEGACY_CATEGORIES, type Article } from "@/data/articles";
import { contentService } from "@/services/contentService";
import { archiveMeta, staticMeta } from "@/lib/contentModel";
import { CONTENT_INDEX } from "@/lib/contentIndex";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import { Archive as ArchiveIcon, Loader2 } from "lucide-react";

/** The archive index: every legacy personal-finance article, grouped by its old category. */
export function ArchiveIndex() {
  const items = CONTENT_INDEX.filter((i) => i.kind === "archive");
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Archive",
          slug: "archive",
          section: "archive",
          summary: "Earlier personal-finance articles from the site's first year, kept for the record: investing basics, budgeting, credit, retirement, and tax.",
        })}
        path={paths.archive()}
        noindex
        jsonLd={[breadcrumbLd([{ name: "Archive", path: paths.archive() }])]}
      />
      <Breadcrumbs items={[{ name: "Archive", path: paths.archive() }]} />
      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Earlier personal-finance articles from the site's first year. They predate the Indian-markets
          focus and are kept unchanged for the record.
        </p>
        {LEGACY_CATEGORIES.map((c) => {
          const group = items.filter((i) => i.meta.subsection === c.id);
          if (group.length === 0) return null;
          return (
            <section key={c.id} className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <ContentList items={group} showTags={false} className="mt-5" />
            </section>
          );
        })}
        {(() => {
          const known = new Set(LEGACY_CATEGORIES.map((c) => c.id));
          const rest = items.filter((i) => !known.has(i.meta.subsection as never));
          return rest.length ? (
            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">Other</h2>
              <ContentList items={rest} showTags={false} className="mt-5" />
            </section>
          ) : null;
        })()}
      </div>
    </Layout>
  );
}

/** Strip a leading markdown H1 so the page keeps exactly one h1 (the body text itself is unchanged). */
function withoutLeadingH1(md: string): string {
  return md.replace(/^\s*#\s+[^\n]+\n/, "");
}

function fmtDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** One legacy article. Local data first; Supabase fallback for rows that exist only in the database. */
export function ArchiveArticle() {
  const { slug = "" } = useParams<{ slug: string }>();
  const local = LEGACY_ARTICLES.find((a) => a.id === slug);
  const { data: remote, isLoading } = useQuery({
    queryKey: ["archive-article", slug],
    queryFn: () => contentService.getArticleById(slug),
    enabled: !local && typeof window !== "undefined",
  });
  const article: Article | null | undefined = local ?? (remote as Article | null | undefined);

  if (!article) {
    return (
      <Layout>
        <Seo meta={staticMeta({ title: "Article not found", slug, section: "archive", summary: "" })} path={paths.archiveArticle(slug)} noindex />
        <div className="container max-w-3xl py-20">
          {isLoading ? (
            <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <EmptyState
              icon={ArchiveIcon}
              title="Article not found"
              description="This archived article does not exist, or its link has changed."
              action={<Link to={paths.archive()} className="text-sm font-medium hover:underline">Browse the archive</Link>}
            />
          )}
        </div>
      </Layout>
    );
  }

  const meta = archiveMeta(article);
  const path = paths.archiveArticle(article.id);
  const category = LEGACY_CATEGORIES.find((c) => c.id === article.category);
  const crumbs = [{ name: "Archive", path: paths.archive() }, { name: article.title, path }];

  return (
    <Layout>
      <Seo
        meta={meta}
        path={path}
        type="article"
        noindex
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <article className="container max-w-3xl py-12">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Archive{category ? ` · ${category.name}` : ""} · {article.difficulty}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{article.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{article.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>By {article.author}</span>
          {article.publishedAt && <time dateTime={article.publishedAt}>{fmtDate(article.publishedAt)}</time>}
          <span>{article.readingTime} min read</span>
        </div>

        <Callout variant="note" className="mt-8">
          <p className="text-sm">
            This article is from the site's first year and predates its Indian-markets focus. It is
            kept unchanged. For current material, start in{" "}
            <Link to={paths.vault()} className="underline">The Vault</Link>.
          </p>
        </Callout>

        {article.keyTakeaways?.length > 0 && (
          <Callout variant="info" title="Key takeaways" titleAs="h2" className="mt-8">
            <ul className="list-disc space-y-1.5 pl-5">
              {article.keyTakeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Callout>
        )}

        <Prose className="mt-10">{withoutLeadingH1(article.content)}</Prose>

        <div className="mt-12">
          <Quiz articleId={article.id} />
        </div>
      </article>
    </Layout>
  );
}

export default ArchiveIndex;
