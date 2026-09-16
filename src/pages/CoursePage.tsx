import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { Callout } from "@/components/content/Callout";
import { staticMeta } from "@/lib/contentModel";
import { COURSES } from "@/lib/contentIndex";
import { getTrack } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import { FundamentalAnalysisContent } from "@/pages/FundamentalAnalysis";
import { TechnicalAnalysisContent } from "@/pages/TechnicalAnalysis";

/**
 * The two legacy course pages, restored at /vault/guides/<slug>. The course
 * text comes unchanged from FundamentalAnalysis.tsx / TechnicalAnalysis.tsx;
 * their "Ask AI" buttons now open a glossary search for the topic, since the
 * chat sidebar is not part of the public site.
 */
export default function CoursePage({ slug }: { slug: (typeof COURSES)[number]["slug"] }) {
  const course = COURSES.find((c) => c.slug === slug)!;
  const track = getTrack(course.track);
  const navigate = useNavigate();
  const path = paths.guide(course.slug);
  const onAskAI = (context: string) => {
    const topic = context.replace(/^(Fundamental|Technical) Analysis:\s*/i, "");
    navigate(`${paths.glossary()}?q=${encodeURIComponent(topic)}`);
  };
  const Body = slug === "fundamental-analysis-course" ? FundamentalAnalysisContent : TechnicalAnalysisContent;
  const crumbs = [
    { name: "The Vault", path: paths.vault() },
    { name: "Concept Guides", path: paths.guides() },
    ...(track ? [{ name: track.label, path: paths.track(track.id) }] : []),
    { name: course.title, path },
  ];

  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: course.title,
          slug: course.slug,
          section: "vault",
          subsection: "guides",
          tags: [...course.tags],
          summary: course.summary,
        })}
        path={path}
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <div className="container max-w-5xl py-12">
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{course.summary}</p>
        <Callout variant="note" className="mt-6 max-w-3xl">
          <p className="text-sm">
            This is the original long-form course, kept in full. For the same material as short
            single-concept guides, see the{" "}
            {track && (
              <Link to={paths.track(track.id)} className="underline">
                {track.label} track
              </Link>
            )}
            .
          </p>
        </Callout>
        <div className="mt-10">
          <Body onAskAI={onAskAI} />
        </div>
      </div>
    </Layout>
  );
}
