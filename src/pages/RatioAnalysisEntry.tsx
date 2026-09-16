import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { ratioMeta } from "@/lib/contentModel";
import { Prose } from "@/components/content/Prose";
import { Callout } from "@/components/content/Callout";
import { EmptyState } from "@/components/content/EmptyState";
import { ContinueReading } from "@/components/research/ContinueReading";
import { RATIO_GROUPS, RATIOS, findRatio, ratiosInGroup } from "@/data/ratioAnalysis";
import { RATIO_GROUP_ICONS } from "@/lib/siteIcons";
import { findByName } from "@/lib/glossary";
import { breadcrumbLd } from "@/lib/seo";

const BASE = "https://valuationnode.com/learn/ratio-analysis";

export default function RatioAnalysisEntry() {
  const { slug } = useParams<{ slug: string }>();
  const ratio = findRatio(slug ?? "");

  if (!ratio) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20">
          <EmptyState
            icon={SearchX}
            title="Ratio not found"
            description="This ratio is not in the reference yet, or the link has changed."
            action={
              <Link to="/learn/ratio-analysis" className="text-sm font-medium hover:underline">
                Back to Ratio Analysis
              </Link>
            }
          />
        </div>
      </Layout>
    );
  }

  const group = RATIO_GROUPS.find((g) => g.id === ratio.group)!;
  const GroupIcon = RATIO_GROUP_ICONS[group.id];
  const siblings = ratiosInGroup(ratio.group);
  const idx = siblings.findIndex((r) => r.slug === ratio.slug);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const related = (ratio.relatedRatios ?? [])
    .map((s) => RATIOS.find((r) => r.slug === s))
    .filter((r): r is NonNullable<typeof r> => !!r);

  const path = `/learn/ratio-analysis/${ratio.slug}`;
  const url = `${BASE}/${ratio.slug}`;
  const meta = ratioMeta(ratio);

  return (
    <Layout>
      <Seo
        meta={meta}
        path={path}
        titleTag={`${ratio.name}: Formula and Definition - The Valuation Node`}
        jsonLd={[
          breadcrumbLd([
            { name: "Learn", path: "/learn" },
            { name: "Ratio Analysis", path: "/learn/ratio-analysis" },
            { name: ratio.name, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: ratio.name,
            alternateName: ratio.fullName,
            description: ratio.definition,
            url,
            inDefinedTermSet: BASE,
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container flex max-w-3xl flex-wrap items-center gap-2 py-3 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/ratio-analysis" className="hover:text-foreground">Ratio Analysis</Link></li>
          <li>/</li>
          <li className="font-medium text-foreground">{ratio.name}</li>
        </ol>
      </nav>

      <article className="container max-w-3xl py-12">
        <Link
          to={`/learn/ratio-analysis#${group.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-primary"
        >
          {GroupIcon && <GroupIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          {group.label}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{ratio.name}</h1>
        {ratio.fullName && ratio.fullName !== ratio.name && (
          <p className="mt-1 text-lg text-muted-foreground">{ratio.fullName}</p>
        )}

        {/* Definition: the featured-snippet paragraph */}
        <p className="mt-6 font-serif text-lg leading-relaxed">{ratio.definition}</p>

        {/* Formula */}
        <section className="mt-8" aria-labelledby="formula-heading">
          <h2 id="formula-heading" className="text-lg font-semibold">Formula</h2>
          <div className="mt-3 space-y-3">
            {ratio.formulas.map((f) => (
              <div key={f.label} className="rounded-lg border border-primary/25 bg-primary/5 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{f.label}</p>
                <p className="overflow-x-auto font-mono text-sm leading-relaxed">{f.expression}</p>
              </div>
            ))}
          </div>
          {ratio.benchmark && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Benchmark:</span> {ratio.benchmark}
            </p>
          )}
        </section>

        {/* Reading the number */}
        <section className="mt-10" aria-labelledby="reading-heading">
          <h2 id="reading-heading" className="text-lg font-semibold">Reading the number</h2>
          <Prose className="mt-3">{ratio.reading}</Prose>
        </section>

        {/* Indian example */}
        <section className="mt-10" aria-labelledby="example-heading">
          <h2 id="example-heading" className="text-lg font-semibold">Indian example</h2>
          <Callout variant="info" className="mt-3">
            <Prose size="sm">{ratio.example}</Prose>
          </Callout>
        </section>

        {/* Caution */}
        {ratio.caution && (
          <section className="mt-10" aria-labelledby="caution-heading">
            <Callout variant="warning" title="Where this ratio misleads" titleAs="h2" id="caution-heading">
              <Prose size="sm">{ratio.caution}</Prose>
            </Callout>
          </section>
        )}

        {/* Related ratios */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related ratios
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/learn/ratio-analysis/${r.slug}`}
                  className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Glossary + deeper reading */}
        {((ratio.glossary && ratio.glossary.length > 0) || (ratio.goDeeper && ratio.goDeeper.length > 0)) && (
          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            {ratio.glossary && ratio.glossary.length > 0 && (
              <div className="rounded-lg border p-4">
                <h2 className="text-sm font-semibold">Glossary terms</h2>
                <ul className="mt-2 space-y-1.5">
                  {ratio.glossary.map((t) => {
                    const target = findByName(t);
                    if (!target) return null;
                    return (
                      <li key={t}>
                        <Link to={`/learn/glossary/${target.slug}`} className="text-sm text-foreground hover:underline">
                          {t} →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {ratio.goDeeper && ratio.goDeeper.length > 0 && (
              <div className="rounded-lg border p-4">
                <h2 className="text-sm font-semibold">Go deeper</h2>
                <ul className="mt-2 space-y-1.5">
                  {ratio.goDeeper.map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} className="text-sm text-foreground hover:underline">
                        {l.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Prev / next within the group */}
        <nav aria-label="Ratios in this group" className="mt-12 grid gap-3 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <Link to={`/learn/ratio-analysis/${prev.slug}`} className="group rounded-lg border p-4 transition-colors hover:bg-muted/40">
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Previous
              </span>
              <p className="mt-1 font-medium group-hover:underline">{prev.name}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/learn/ratio-analysis/${next.slug}`} className="group rounded-lg border p-4 text-right transition-colors hover:bg-muted/40">
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                Next <ArrowRight className="h-3 w-3" />
              </span>
              <p className="mt-1 font-medium group-hover:underline">{next.name}</p>
            </Link>
          )}
        </nav>

        <ContinueReading
          heading="From the research"
          tags={[ratio.name, ratio.fullName ?? "", group.label].filter(Boolean)}
          className="mt-12"
        />
      </article>
    </Layout>
  );
}
