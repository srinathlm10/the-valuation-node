import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { ContentList } from "@/components/content/ContentList";
import { EmptyState } from "@/components/content/EmptyState";
import { staticMeta } from "@/lib/contentModel";
import { itemsWithTag, tagCounts } from "@/lib/contentIndex";
import { isTag, tagLabel, TAGS } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import { Tag } from "lucide-react";

/** /tags: every tag that has content, with counts. */
export function TagsIndex() {
  const counts = tagCounts();
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Topics",
          slug: "tags",
          section: "vault",
          summary: "Browse The Valuation Node by topic: every research piece, guide, formula, and tool that carries each tag.",
        })}
        path={paths.tags()}
        titleTag="Topics - The Valuation Node"
        jsonLd={[breadcrumbLd([{ name: "Topics", path: paths.tags() }])]}
      />
      <Breadcrumbs items={[{ name: "Topics", path: paths.tags() }]} />
      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Tags cut across sections. Pick one to see everything on the site that touches it.
        </p>
        <ul className="mt-10 flex flex-wrap gap-2">
          {counts.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                to={paths.tag(tag)}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {tagLabel(tag)}
                <span className="rounded bg-muted px-1.5 text-xs">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

/** /tags/:tag: everything carrying one tag, grouped by kind. */
export function TagPage() {
  const { tag = "" } = useParams<{ tag: string }>();
  const valid = isTag(tag);
  const items = valid ? itemsWithTag(tag) : [];
  const label = tagLabel(tag);
  const path = paths.tag(tag);

  if (!valid || items.length === 0) {
    return (
      <Layout>
        <Seo meta={staticMeta({ title: valid ? label : "Topic not found", slug: tag, section: "vault", summary: "" })} path={path} noindex />
        <div className="container max-w-3xl py-20">
          <EmptyState
            icon={Tag}
            title={valid ? `Nothing tagged ${label} yet` : "Topic not found"}
            description={valid ? "This tag exists but has no pages yet." : "That tag is not one this site uses."}
            action={<Link to={paths.tags()} className="text-sm font-medium hover:underline">All topics</Link>}
          />
        </div>
      </Layout>
    );
  }

  const order = ["article", "guide", "course", "formula", "lesson", "calculator", "news", "term"] as const;
  const groups = order.map((k) => ({ kind: k, items: items.filter((i) => i.kind === k) })).filter((g) => g.items.length > 0);
  const kindLabel: Record<string, string> = {
    article: "Analysis",
    guide: "Concept Guides",
    course: "Courses",
    formula: "Formulas & Ratios",
    lesson: "Interactive Lessons",
    calculator: "Calculators",
    news: "News & Trends",
    term: "Glossary",
  };

  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: `${label}`,
          slug: tag,
          section: "vault",
          summary: `Everything on The Valuation Node tagged ${label}: ${items.length} pages across analysis, guides, formulas, tools, and the glossary.`,
        })}
        path={path}
        titleTag={`${label}: all pages - The Valuation Node`}
        jsonLd={[breadcrumbLd([{ name: "Topics", path: paths.tags() }, { name: label, path }])]}
      />
      <Breadcrumbs items={[{ name: "Topics", path: paths.tags() }, { name: label, path }]} />
      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">{label}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{items.length} pages carry this tag.</p>
        {groups.map((g) => (
          <section key={g.kind} className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">{kindLabel[g.kind]}</h2>
            <ContentList items={g.items} showTags={false} className="mt-5" />
          </section>
        ))}
        <p className="mt-12 text-sm text-muted-foreground">
          Related topics:{" "}
          {TAGS.filter((t) => t.id !== tag && itemsWithTag(t.id).length > 0)
            .slice(0, 8)
            .map((t, i) => (
              <span key={t.id}>
                {i > 0 && ", "}
                <Link to={paths.tag(t.id)} className="underline hover:text-foreground">{t.label}</Link>
              </span>
            ))}
        </p>
      </div>
    </Layout>
  );
}

export default TagsIndex;
