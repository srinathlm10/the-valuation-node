import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Search, SearchX } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Callout } from "@/components/content/Callout";
import { EmptyState } from "@/components/content/EmptyState";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { RATIO_GROUPS, RATIOS, type RatioEntry } from "@/data/ratioAnalysis";
import { RATIO_GROUP_ICONS } from "@/lib/siteIcons";
import { breadcrumbLd } from "@/lib/seo";

const CANONICAL = "https://valuationnode.com/learn/ratio-analysis";

function GroupIcon({ id, className }: { id: string; className?: string }) {
  const Icon = RATIO_GROUP_ICONS[id];
  if (!Icon) return null;
  return <Icon className={className ?? "h-5 w-5 text-primary"} aria-hidden="true" />;
}

function RatioCard({ r }: { r: RatioEntry }) {
  return (
    <Link
      to={`/learn/ratio-analysis/${r.slug}`}
      className="group flex flex-col rounded-xl border bg-muted/20 p-5 transition-colors hover:bg-muted/40"
    >
      <h3 className="font-semibold leading-snug group-hover:underline">
        {r.name}
        {r.fullName && r.fullName !== r.name && (
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">({r.fullName})</span>
        )}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.definition}</p>
      <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
        <p className="font-mono text-xs leading-relaxed text-foreground">{r.formulas[0].expression}</p>
        {r.formulas.length > 1 && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            +{r.formulas.length - 1} more formula{r.formulas.length > 2 ? "s" : ""} on the page
          </p>
        )}
      </div>
      {r.benchmark && (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Benchmark:</span> {r.benchmark}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-foreground">
        Definition, formula, example <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

export default function RatioAnalysis() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return RATIOS;
    return RATIOS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.fullName ?? "").toLowerCase().includes(q) ||
        r.definition.toLowerCase().includes(q) ||
        r.formulas.some((f) => f.expression.toLowerCase().includes(q))
    );
  }, [search]);

  const description =
    "Financial ratio analysis reference for Indian markets: definitions, formulas, benchmarks, and worked examples for " + RATIOS.length + " ratios across valuation, profitability, leverage, efficiency, cash flow, banking, and growth.";

  return (
    <Layout>
      <Helmet>
        <title>Ratio Analysis: Formulas, Definitions, Indian Examples - The Valuation Node</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content="Ratio Analysis: Formulas, Definitions and Indian Examples" />
        <meta property="og:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbLd([
            { name: "Learn", path: "/learn" },
            { name: "Ratio Analysis", path: "/learn/ratio-analysis" },
          ]))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Financial ratio analysis reference",
            numberOfItems: RATIOS.length,
            itemListElement: RATIOS.map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: r.name,
              url: `${CANONICAL}/${r.slug}`,
            })),
          })}
        </script>
      </Helmet>

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container flex max-w-5xl items-center gap-2 py-3 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li className="font-medium text-foreground">Ratio Analysis</li>
        </ol>
      </nav>

      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Ratio Analysis</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Every financial ratio an analyst reaches for, with its definition, its formula on one
          clearly labelled line, what a good number looks like, and a worked example, drawn from
          Indian companies wherever the source notes provide the figures.
        </p>

        <div className="prose prose-slate dark:prose-invert mt-8 max-w-3xl">
          <p>
            Ratio analysis turns three financial statements into a handful of numbers you can
            compare across years and across companies. No single ratio settles anything. Each one
            answers a narrow question, and the skill is knowing which question it answers, which
            industries it works for, and which distortions make it lie. That is what each page in
            this section covers, in the same order every time: definition, formula, how to read it,
            an Indian example, and the caution.
          </p>
        </div>

        <Callout variant="warning" title="Before you compute any ratio: standalone or consolidated?" className="mt-8 max-w-3xl">
          <p className="text-sm leading-relaxed">
            Standalone statements show only the company's own business. Consolidated statements
            add its subsidiaries, acquisitions, and stakes in other companies. Tata Motors reports
            standalone sales of roughly ₹70,000 crore, but consolidated sales including Jaguar
            Land Rover of about ₹3 lakh crore, more than four times higher. Judged on standalone
            numbers alone, the stock looks inexplicably expensive. Use consolidated figures by
            default, and ideally review both. Switching between them can move enterprise value
            from negative to positive and a PE ratio from 21 to 15 for the same company.
          </p>
        </Callout>

        {/* Group jump links */}
        <div className="mt-10 flex flex-wrap gap-2">
          {RATIO_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <GroupIcon id={g.id} className="h-3.5 w-3.5 text-primary/70" />
              {g.label}
            </a>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ratios, e.g. ROCE, CASA, cash cycle"
            className="pl-9"
            aria-label="Search ratios"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No ratio matches that search"
            description="Try a shorter word, or browse the groups below."
            className="mt-10"
          />
        ) : (
          RATIO_GROUPS.map((g) => {
            const items = filtered.filter((r) => r.group === g.id);
            if (items.length === 0) return null;
            return (
              <section key={g.id} id={g.id} className="mt-14 scroll-mt-24">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <GroupIcon id={g.id} />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{g.label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <RatioCard key={r.slug} r={r} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        <section className="mt-16 max-w-3xl rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Go deeper</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This section is the reference. For the reasoning behind each family of ratios, read
            the Financial Statement Analysis topics in Foundations. To compute them yourself from
            raw statements, use the Learn-by-Doing module.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/learn/foundations/financial-statement-analysis/profitability-ratios" className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
              Profitability ratios (Foundations)
            </Link>
            <Link to="/learn/foundations/financial-statement-analysis/dupont-decomposition" className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
              DuPont decomposition (Foundations)
            </Link>
            <Link to="/learn/by-doing/compute-ratios" className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
              Compute ratios from raw statements
            </Link>
            <Link to="/learn/glossary" className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
              Glossary
            </Link>
          </div>
        </section>

        <div className="mt-16" id="newsletter">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
