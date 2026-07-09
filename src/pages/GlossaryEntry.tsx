import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "@/services/contentService";
import { useMemo } from "react";
import { Prose } from "@/components/content/Prose";
import { Callout } from "@/components/content/Callout";

function toSlug(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function GlossaryEntry() {
  const { termSlug } = useParams<{ termSlug: string }>();

  const { data: definitions = [] } = useQuery({
    queryKey: ["definitions"],
    queryFn: contentService.getDefinitions,
  });

  const def = useMemo(
    () => (definitions as any[]).find((d: any) => toSlug(d.term) === termSlug),
    [definitions, termSlug]
  );

  if (!def) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center">
          <p className="text-muted-foreground">Term not found.</p>
          <Link to="/learn/glossary" className="mt-4 inline-block text-sm hover:underline">
            ← Back to Glossary
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{def.term} - Glossary - The Valuation Node</title>
        <meta
          name="description"
          content={def.definition ? def.definition.slice(0, 160) : `Definition of ${def.term}`}
        />
        <link rel="canonical" href={`https://valuationnode.com/learn/glossary/${termSlug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: def.term,
          description: def.definition,
          inDefinedTermSet: "https://valuationnode.com/learn/glossary",
        })}</script>
      </Helmet>

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/glossary" className="hover:text-foreground">Glossary</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{def.term}</li>
        </ol>
      </nav>

      <article className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight">{def.term}</h1>
        {def.fullName && def.fullName !== def.term && (
          <p className="mt-1 text-lg text-muted-foreground">{def.fullName}</p>
        )}
        {def.category && (
          <span className="mt-2 inline-block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {def.category}
          </span>
        )}

        {/* Definition */}
        {def.definition && (
          <Prose className="mt-6">{def.definition}</Prose>
        )}

        {/* Formula */}
        {def.formula && (
          <div className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Formula
            </p>
            <p className="font-mono text-sm">{def.formula}</p>
          </div>
        )}

        {/* Why it matters */}
        {def.whyItMatters && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Why it matters</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed font-serif">{def.whyItMatters}</p>
          </section>
        )}

        {/* Real-world example */}
        {def.example && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Indian example</h2>
            <Callout variant="info" className="mt-2">
              <p className="font-serif">{def.example}</p>
            </Callout>
          </section>
        )}

        {/* Related terms */}
        {Array.isArray(def.relatedTerms) && def.relatedTerms.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Related terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {def.relatedTerms.map((t: string) => (
                <Link
                  key={t}
                  to={`/learn/glossary/${toSlug(t)}`}
                  className="px-3 py-1 rounded-full border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* See it applied */}
        <div className="mt-8 rounded-lg border p-4">
          <h2 className="text-sm font-semibold">See it applied</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Applications will be linked here as research is published.
          </p>
        </div>

      </article>
    </Layout>
  );
}
