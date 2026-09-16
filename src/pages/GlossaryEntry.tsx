import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { glossaryMeta } from "@/lib/contentModel";
import { findTerm, findByName, siblingsOf } from "@/lib/glossary";
import { Prose } from "@/components/content/Prose";
import { Callout } from "@/components/content/Callout";
import { GLOSSARY_CATEGORY_ICONS, GLOSSARY_FALLBACK_ICON } from "@/lib/siteIcons";
import { ContinueReading } from "@/components/research/ContinueReading";
import { GLOSSARY_CATEGORY_TO_TOPIC } from "@/lib/relatedContent";
import { breadcrumbLd } from "@/lib/seo";

function CategoryIcon({ category }: { category?: string }) {
  const Icon = (category && GLOSSARY_CATEGORY_ICONS[category]) || GLOSSARY_FALLBACK_ICON;
  return <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
}

export default function GlossaryEntry() {
  const { termSlug } = useParams<{ termSlug: string }>();

  const def = findTerm(termSlug ?? "");
  const meta = def ? glossaryMeta(def) : undefined;
  const path = `/vault/glossary/${def?.slug ?? termSlug}`;
  const siblings = def ? siblingsOf(def) : [];

  if (!def || !meta) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center">
          <p className="text-muted-foreground">Term not found.</p>
          <Link to="/vault/glossary" className="mt-4 inline-block text-sm hover:underline">
            ← Back to Glossary
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        meta={meta}
        path={path}
        titleTag={`${def.term} - Glossary - The Valuation Node`}
        jsonLd={[
          breadcrumbLd([
            { name: "The Vault", path: "/vault" },
            { name: "Glossary", path: "/vault/glossary" },
            { name: def.term, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: def.term,
            description: def.definition,
            url: `https://valuationnode.com${path}`,
            inDefinedTermSet: "https://valuationnode.com/vault/glossary",
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/vault" className="hover:text-foreground">The Vault</Link></li>
          <li>/</li>
          <li><Link to="/vault/glossary" className="hover:text-foreground">Glossary</Link></li>
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
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <CategoryIcon category={def.category} />
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

        {/* Same term, other context (the duplicated Basics entries) */}
        {siblings.length > 0 && (
          <Callout variant="note" className="mt-8">
            <p className="text-sm">
              {def.term} also appears in{" "}
              {siblings.map((s, i) => (
                <span key={s.slug}>
                  {i > 0 && ", "}
                  <Link to={`/vault/glossary/${s.slug}`} className="font-medium underline">
                    {s.category ?? "another category"}
                  </Link>
                </span>
              ))}
              . The two entries explain the same idea at different depths.
            </p>
          </Callout>
        )}

        {/* Related terms */}
        {Array.isArray(def.relatedTerms) && def.relatedTerms.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Related terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {def.relatedTerms.map((t: string) => {
                const target = findByName(t);
                return target ? (
                  <Link
                    key={t}
                    to={`/vault/glossary/${target.slug}`}
                    className="px-3 py-1 rounded-full border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    {t}
                  </Link>
                ) : (
                  <span key={t} className="px-3 py-1 rounded-full border border-dashed text-sm text-muted-foreground">
                    {t}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Learn the concept */}
        {def.category && GLOSSARY_CATEGORY_TO_TOPIC[def.category] && (
          <div className="mt-8 rounded-lg border p-4">
            <h2 className="text-sm font-semibold">Learn the concept</h2>
            <Link
              to={GLOSSARY_CATEGORY_TO_TOPIC[def.category].href}
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              {GLOSSARY_CATEGORY_TO_TOPIC[def.category].label} →
            </Link>
          </div>
        )}

        {/* Related research */}
        <ContinueReading
          heading="From the research"
          tags={[def.term, def.category].filter(Boolean) as string[]}
          className="mt-10"
        />

      </article>
    </Layout>
  );
}
