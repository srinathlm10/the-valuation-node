import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { ContentList } from "@/components/content/ContentList";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { EmptyState } from "@/components/content/EmptyState";
import { staticMeta } from "@/lib/contentModel";
import { landingItems, landingHasContent } from "@/lib/contentIndex";
import { getSection, getSubsection, type SectionId } from "@/lib/taxonomy";
import { breadcrumbLd } from "@/lib/seo";
import { Inbox } from "lucide-react";

/**
 * Landing page for News & Trends, Insights & Analysis, and ESG & Sustainability
 * and for each of their sub-sections. Lists the section's own pages plus any
 * tag-aggregated Concept Guides (contentIndex.landingItems). Empty landings
 * render with noindex and are hidden from the menus until they have content.
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
  const liveSubs = sec.subsections.filter((s) => landingHasContent(section, s.id));

  return (
    <Layout>
      <Seo
        meta={staticMeta({ title, slug: sub ?? section, section, subsection: sub, summary })}
        path={path}
        titleTag={subsection ? `${subsection.label} - ${sec.label} - The Valuation Node` : `${sec.label} - The Valuation Node`}
        noindex={!hasContent}
        jsonLd={[
          breadcrumbLd(
            subsection
              ? [{ name: sec.label, path: sec.path }, { name: subsection.label, path }]
              : [{ name: sec.label, path: sec.path }]
          ),
        ]}
      />

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container flex max-w-5xl flex-wrap items-center gap-2 py-3 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          {subsection ? (
            <>
              <li><Link to={sec.path} className="hover:text-foreground">{sec.label}</Link></li>
              <li>/</li>
              <li className="font-medium text-foreground">{subsection.label}</li>
            </>
          ) : (
            <li className="font-medium text-foreground">{sec.label}</li>
          )}
        </ol>
      </nav>

      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{summary}</p>

        {liveSubs.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to={sec.path}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${!sub ? "border-foreground text-foreground" : "text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              All
            </Link>
            {liveSubs.map((s) => (
              <Link
                key={s.id}
                to={`${sec.path}/${s.id}`}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${sub === s.id ? "border-foreground text-foreground" : "text-muted-foreground hover:border-foreground hover:text-foreground"}`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}

        {hasContent ? (
          <ContentList items={items} className="mt-10" />
        ) : (
          <EmptyState
            icon={Inbox}
            title="No posts here yet"
            description="This section is part of the site map but has no published pieces so far. New work lands here as it is written."
            className="mt-10"
            action={<Link to={sec.path} className="text-sm font-medium hover:underline">Browse {sec.label}</Link>}
          />
        )}

        <div className="mt-16" id="newsletter">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
