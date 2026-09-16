import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { ContentList } from "@/components/content/ContentList";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmptyState } from "@/components/content/EmptyState";
import { staticMeta } from "@/lib/contentModel";
import { landingItems, landingHasContent } from "@/lib/contentIndex";
import { getSection, getSubsection, type SectionId } from "@/lib/taxonomy";
import { breadcrumbLd } from "@/lib/seo";
import { ComingSoonTag } from "@/components/content/ComingSoonTag";
import { Inbox } from "lucide-react";

/**
 * Landing page for News & Trends, Insights & Analysis, and ESG & Sustainability
 * and for each of their sub-sections. Lists the section's own pages plus any
 * tag-aggregated Concept Guides (contentIndex.landingItems). Every sub-section
 * is listed; the ones with nothing published yet are marked "coming soon" and
 * render a coming-soon page with noindex (owner decision, 2026-09-16).
 */
export default function SectionLanding({ section }: { section: SectionId }) {
  const { sub } = useParams<{ sub?: string }>();
  const sec = getSection(section);
  const subsection = sub ? getSubsection(section, sub) : undefined;

  if (sub && !subsection) {
    return (
      <Layout>
        <Seo meta={staticMeta({ title: "Not found", slug: "404", section, summary: "" })} path={`${sec.path}/${sub}`} noindex />
        <div className="container max-w-3xl py-20">
          <EmptyState icon={Inbox} title="No such section" description="That sub-section does not exist." action={<Link to={sec.path} className="text-sm font-medium hover:underline">Back to {sec.label}</Link>} />
        </div>
      </Layout>
    );
  }

  const items = landingItems(section, sub);
  const path = sub ? `${sec.path}/${sub}` : sec.path;
  const title = subsection ? `${subsection.label}` : sec.label;
  const summary = subsection ? subsection.description : sec.description;
  const hasContent = items.length > 0;
  const subs = sec.subsections.map((s) => ({ ...s, live: landingHasContent(section, s.id) }));
  const crumbs = subsection
    ? [{ name: sec.label, path: sec.path }, { name: subsection.label, path }]
    : [{ name: sec.label, path: sec.path }];

  return (
    <Layout>
      <Seo
        meta={staticMeta({ title, slug: sub ?? section, section, subsection: sub, summary })}
        path={path}
        titleTag={subsection ? `${subsection.label} - ${sec.label} - The Valuation Node` : `${sec.label} - The Valuation Node`}
        noindex={!hasContent}
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="container my-8 grid gap-10 lg:grid-cols-[2.3fr_1fr]">
      <div className="min-w-0 py-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{summary}</p>

        {subs.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to={sec.path}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${!sub ? "border-foreground text-foreground" : "text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              All
            </Link>
            {subs.map((s) => (
              <Link
                key={s.id}
                to={`${sec.path}/${s.id}`}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${sub === s.id ? "border-foreground text-foreground" : "text-muted-foreground hover:border-foreground hover:text-foreground"}`}
              >
                {s.label}
                {!s.live && <ComingSoonTag />}
              </Link>
            ))}
          </div>
        )}

        {hasContent ? (
          <ContentList items={items} className="mt-10" headingLevel="h2" />
        ) : (
          <EmptyState
            icon={Inbox}
            title="Coming soon..."
            description={`Nothing is published in ${title} yet. New work lands here as it is written.`}
            className="mt-10"
            action={<Link to={sec.path} className="text-sm font-medium hover:underline">Browse {sec.label}</Link>}
          />
        )}

      </div>
      <Sidebar />
      </div>
    </Layout>
  );
}
