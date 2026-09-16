import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { guideMetaFor, staticMeta, summarise } from "@/lib/contentModel";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { findTopic } from "@/data/foundationsTree";
import { paths } from "@/lib/routes";
import { getTrack } from "@/lib/taxonomy";
import { FOUNDATIONS_CONTENT } from "@/data/foundationsContent";
import { FOUNDATIONS_SECTION_ICONS } from "@/lib/siteIcons";

const TOPIC_TOC = [
  { id: "intuition", label: "Intuition" },
  { id: "mechanics", label: "Mechanics" },
  { id: "common-mistakes", label: "Common mistakes" },
];
import { X } from "lucide-react";
import { Prose } from "@/components/content/Prose";
import { Callout } from "@/components/content/Callout";
import { CollapsibleSection } from "@/components/content/CollapsibleSection";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ContinueReading } from "@/components/research/ContinueReading";
import { RelatedTopics } from "@/components/learn/RelatedTopics";
import { getGlossaryTermsForSection, ARTICLE_CATEGORY_BY_SECTION } from "@/lib/relatedContent";
import { breadcrumbLd } from "@/lib/seo";

export default function FoundationsLeaf() {
  const { slug } = useParams<{ slug: string }>();
  const found = findTopic(slug ?? "");
  const sectionData = found?.section;
  const topicMeta = found?.topic;
  const section = sectionData?.section;
  const topic = topicMeta?.slug;
  const trackLabel = section ? getTrack(section)?.label ?? sectionData.label : "";

  if (!sectionData || !topicMeta) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center text-muted-foreground text-sm">
          Page not found.{" "}
          <Link to="/vault/guides" className="underline hover:text-foreground">
            Back to Concept Guides
          </Link>
        </div>
      </Layout>
    );
  }

  const content = FOUNDATIONS_CONTENT[topic!];
  const SectionGlyph = FOUNDATIONS_SECTION_ICONS[sectionData.section];
  const keyTerms = getGlossaryTermsForSection(sectionData.section, 6);
  const isPlaceholder = !topicMeta.published || !content;
  const pagePath = paths.guide(topic!);
  // Reviewed summary + tags from foundationsMeta.ts; fall back to the intuition text.
  const pageMeta =
    guideMetaFor(topic!, content?.readingTime) ??
    staticMeta({
      title: topicMeta.label,
      slug: topic!,
      section: "vault",
      subsection: "guides",
      summary: summarise(content?.intuition) || `${topicMeta.label}, explained from first principles with Indian context and worked examples.`,
    });

  return (
    <Layout>
      <Seo
        meta={pageMeta}
        path={pagePath}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: topicMeta.label,
            description: pageMeta.summary,
            inLanguage: "en-IN",
            learningResourceType: "Reading",
            dateModified: pageMeta.updatedDate,
            timeRequired: pageMeta.readingTime ? `PT${pageMeta.readingTime}M` : undefined,
            author: { "@type": "Person", name: "Gajji Srinath" },
            provider: { "@type": "Organization", name: "The Valuation Node" },
            url: `https://valuationnode.com${pagePath}`,
          },
          breadcrumbLd([
            { name: "The Vault", path: paths.vault() },
            { name: "Concept Guides", path: paths.guides() },
            { name: trackLabel, path: paths.track(section!) },
            { name: topicMeta.label, path: pagePath },
          ]),
        ]}
      />

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to={paths.vault()} className="hover:text-foreground">The Vault</Link></li>
          <li>/</li>
          <li><Link to={paths.guides()} className="hover:text-foreground">Concept Guides</Link></li>
          <li>/</li>
          <li><Link to={paths.track(section!)} className="hover:text-foreground">{trackLabel}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{topicMeta.label}</li>
        </ol>
      </nav>

      <ReadingProgress />

      <div className="container py-12 max-w-3xl xl:max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_230px] xl:gap-12">
      <article className="min-w-0 w-full max-w-3xl mx-auto xl:mx-0">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {SectionGlyph && <SectionGlyph className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
          Concept Guide · {trackLabel}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{topicMeta.label}</h1>

        {isPlaceholder ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground font-medium">Coming as I learn</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This page is a placeholder. Content will be added here as it's written.
            </p>
            <div className="mt-8">
              <NewsletterSignup />
            </div>
          </div>
        ) : (
          <>
            {/* Meta */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{content.readingTime}</span>
              <span>Last reviewed: {content.lastReviewed}</span>
            </div>

            {/* Prerequisites */}
            {content.prerequisites.length > 0 && (
              <Callout variant="note" title="Before you read this" className="mt-6">
                <p>You should be comfortable with:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {content.prerequisites.map((p) => (
                    <li key={p.href}>
                      <Link to={p.href} className="underline underline-offset-2 hover:text-foreground">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Callout>
            )}

            {/* Intuition */}
            <section className="mt-10">
              <h2 id="intuition" className="text-xl font-semibold">Intuition</h2>
              <Prose className="mt-3">{content.intuition}</Prose>
            </section>

            {/* Mechanics */}
            <section className="mt-10">
              <h2 id="mechanics" className="text-xl font-semibold">Mechanics</h2>
              <Prose className="mt-3">{content.mechanics}</Prose>
            </section>

            {/* Deep Dive */}
            <CollapsibleSection title="Show advanced details" className="mt-6">
              <Prose size="sm">{content.deepDive}</Prose>
            </CollapsibleSection>

            {/* Common Mistakes */}
            <Callout variant="danger" title="Common mistakes" titleAs="h2" id="common-mistakes" className="mt-8">
              <ul className="space-y-2.5">
                {content.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex gap-2.5">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </Callout>

            {/* Related research */}
            <ContinueReading
              heading="From the research"
              category={ARTICLE_CATEGORY_BY_SECTION[sectionData.section]}
              tags={[topicMeta.label]}
              className="mt-10"
            />

            {/* Try it yourself */}
            {content.tryItHref ? (
              <div className="mt-4 rounded-lg border p-4">
                <h2 className="text-sm font-semibold">Try it yourself</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Practice the concepts with an interactive calculator:{" "}
                  <Link to={content.tryItHref} className="text-foreground underline underline-offset-2 hover:no-underline">
                    open tool →
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border p-4">
                <h2 className="text-sm font-semibold">Try it yourself</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Interactive exercises coming soon.
                </p>
              </div>
            )}

            {/* Key glossary terms */}
            {keyTerms.length > 0 && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Key glossary terms
                </h2>
                <div className="flex flex-wrap gap-2">
                  {keyTerms.map((t) => (
                    <Link
                      key={t.slug}
                      to={`/vault/glossary/${t.slug}`}
                      className="px-3 py-1 rounded-full border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    >
                      {t.term}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <RelatedTopics section={sectionData.section} topic={topicMeta.slug} className="mt-10" />

            <div className="mt-10">
              <NewsletterSignup />
            </div>
          </>
        )}
      </article>

      {!isPlaceholder && (
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents items={TOPIC_TOC} />
          </div>
        </aside>
      )}
      </div>
    </Layout>
  );
}
