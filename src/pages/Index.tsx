import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { Sidebar } from "@/components/layout/Sidebar";
import { ArticleCard } from "@/components/content/ArticleCard";
import { staticMeta } from "@/lib/contentModel";
import { CONTENT_INDEX, landingItems, latestItems, publishedItems, type ContentItem } from "@/lib/contentIndex";
import { useHiddenSlugs } from "@/lib/articleVisibility";
import { getSection } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { GLOSSARY } from "@/lib/glossary";
import { RATIOS } from "@/data/ratioAnalysis";

/**
 * Home page, from the prototype: a 70/30 grid (2.3fr / 1fr, 2.5rem gap; one
 * column below 900px). Main column: hero lead story, then a two-column news
 * grid. Sidebar: Latest Updates, Trending Topics, Weekly Briefing. Below the
 * grid: one block of three cards per content section, a Start Here block, and
 * a Vault promo with glossary search. Card budget: 1 hero + 4 grid + 3 x 2
 * section blocks = 11 (target 10 to 14).
 */

const CARD_BUDGET = { hero: 1, grid: 4, perSection: 3 };

const START_HERE = [
  { label: "New to markets?", href: "/vault/guides/reading-an-income-statement", text: "Read an income statement, then a balance sheet, then link the two." },
  { label: "Want to value a company?", href: "/vault/guides/dcf-theory-and-mechanics", text: "DCF theory first, then build one step by step on real numbers." },
  { label: "Checking a stock quickly?", href: "/vault/formulas", text: "Forty-nine ratios with the formula, the benchmark, and where each one lies." },
  { label: "Analysing a bank?", href: "/vault/guides/sector-specific-valuation", text: "Why banks break the usual rules, and the ratio set that replaces them." },
];

export default function Index() {
  const { data: hidden } = useHiddenSlugs();

  // Articles first (newest), then other dated content; hidden slugs never appear.
  const articles = useMemo(
    () =>
      publishedItems()
        .filter((i) => i.kind === "article" && !(hidden?.has(i.meta.slug) ?? false))
        .sort((a, b) => (b.meta.publishDate ?? "").localeCompare(a.meta.publishDate ?? "")),
    [hidden]
  );
  const hero: ContentItem | undefined = articles[0];
  const gridPool = [...articles.slice(1), ...latestItems(20).filter((i) => i.kind !== "article")];
  const grid = gridPool.filter((i) => i.path !== hero?.path).slice(0, CARD_BUDGET.grid);
  const usedPaths = new Set([hero?.path, ...grid.map((g) => g.path)]);

  const sectionBlocks = (["analysis", "esg", "news"] as const)
    .map((id) => ({
      section: getSection(id),
      items: landingItems(id)
        .filter((i) => !usedPaths.has(i.path) && !(hidden?.has(i.meta.slug) ?? false))
        .slice(0, CARD_BUDGET.perSection),
    }))
    .filter((b) => b.items.length > 0)
    .slice(0, 2);

  const latest = latestItems(5).filter((i) => !(hidden?.has(i.meta.slug) ?? false));
  const guideCount = CONTENT_INDEX.filter((i) => i.kind === "guide").length;

  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "The Valuation Node: Indian Market Research & Learning",
          slug: "home",
          section: "analysis",
          summary:
            "Original valuation and credit analysis of Indian companies, plus a free reference library: glossary, formulas, concept guides, and interactive tools. By Gajji Srinath.",
        })}
        path="/"
        titleTag="The Valuation Node: Indian Market Research & Learning"
        description="Research and learning on Indian markets, by Gajji Srinath. Original valuations, credit analysis, ESG, and a free reference library."
      />

      <h1 className="sr-only">The Valuation Node: Indian market research and learning</h1>

      {/* Prototype .container: 2.3fr / 1fr grid */}
      <div className="container my-8 grid gap-10 lg:grid-cols-[2.3fr_1fr]">
        <div className="flex min-w-0 flex-col gap-8">
          {hero && <ArticleCard item={hero} variant="hero" headingLevel="h2" />}

          {grid.length > 0 && (
            <section aria-labelledby="home-latest-heading">
              <h2 id="home-latest-heading" className="sr-only">Latest from the site</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {grid.map((item) => (
                  <ArticleCard key={item.path} item={item} headingLevel="h3" />
                ))}
              </div>
            </section>
          )}
        </div>

        <Sidebar latest={latest} />
      </div>

      {/* Per-section blocks */}
      {sectionBlocks.map(({ section, items }) => (
        <section key={section.id} className="container mt-14" aria-labelledby={`home-${section.id}-heading`}>
          <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-primary pb-2">
            <h2 id={`home-${section.id}-heading`} className="text-[1.1rem] font-semibold uppercase tracking-[1px]">
              {section.label}
            </h2>
            <Link to={section.path} className="text-sm font-semibold uppercase tracking-[0.5px] text-primary hover:underline">
              All {section.label} →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((item) => (
              <ArticleCard key={item.path} item={item} headingLevel="h3" />
            ))}
          </div>
        </section>
      ))}

      {/* Start here */}
      <section className="container mt-14" aria-labelledby="home-start-heading">
        <div className="border border-border bg-card p-6 md:p-8">
          <h2 id="home-start-heading" className="text-[1.1rem] font-semibold uppercase tracking-[1px]">Start here</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Four paths through the library, depending on what you came for.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {START_HERE.map((s) => (
              <li key={s.href} className="relative border border-border p-4 transition-colors hover:bg-accent">
                <h3 className="text-sm font-semibold">
                  <Link to={s.href} className="after:absolute after:inset-0 after:content-['']">
                    {s.label}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vault promo with glossary search */}
      <section className="container my-14" aria-labelledby="home-vault-heading">
        <div className="grid gap-8 bg-brand-navy p-8 text-white md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <h2 id="home-vault-heading" className="font-serif text-2xl leading-tight md:text-3xl">
              The Vault: <span className="text-brand-green">{GLOSSARY.length}</span> definitions,{" "}
              <span className="text-brand-green">{RATIOS.length}</span> formulas,{" "}
              <span className="text-brand-green">{guideCount}</span> concept guides.
            </h2>
            <p className="mt-3 max-w-xl text-[#d1d5db]">
              Every term with a formula and an Indian example. Every ratio with its benchmark and where it
              misleads. Every guide from first principles.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-[0.5px]">
              <Link to={paths.glossary()} className="text-white hover:text-brand-green">Glossary →</Link>
              <Link to={paths.formulas()} className="text-white hover:text-brand-green">Formulas →</Link>
              <Link to={paths.guides()} className="text-white hover:text-brand-green">Guides →</Link>
              <Link to={paths.interactive()} className="text-white hover:text-brand-green">Interactive →</Link>
            </div>
          </div>
          <form action={paths.glossary()} method="get" role="search" className="self-center">
            <label htmlFor="home-glossary-q" className="mb-2 block text-xs font-semibold uppercase tracking-[1px] text-[#d1d5db]">
              Look up a term
            </label>
            <div className="flex">
              <input
                id="home-glossary-q"
                name="q"
                type="search"
                placeholder="e.g. ROCE, CASA, free cash flow"
                className="w-full border border-white/20 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
              />
              <button type="submit" className="bg-brand-green px-4 text-white hover:opacity-90" aria-label="Search the glossary">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <p className="sr-only">
        <Link to={paths.analysis()}>Browse all analysis <ArrowRight className="inline h-3 w-3" /></Link>
      </p>
    </Layout>
  );
}
