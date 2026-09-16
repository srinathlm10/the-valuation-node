import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { TRACKS } from "@/lib/taxonomy";
import { itemsInTrack } from "@/lib/contentIndex";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";

/**
 * /start-here: reading paths through the library for four kinds of reader.
 * Each path is an ordered list of existing pages; nothing new is written here.
 */

const PATHS = [
  {
    id: "first-statements",
    title: "I have never read a financial statement",
    intro: "Three guides, in order, then one interactive lesson to make it stick.",
    steps: [
      { label: "Reading an Income Statement", href: paths.guide("reading-an-income-statement") },
      { label: "Reading a Balance Sheet", href: paths.guide("reading-a-balance-sheet") },
      { label: "Reading a Cash Flow Statement", href: paths.guide("reading-a-cash-flow-statement") },
      { label: "Read an Income Statement, Line by Line (lesson)", href: paths.interactiveItem("read-an-income-statement") },
    ],
  },
  {
    id: "value-a-company",
    title: "I want to value a company",
    intro: "The theory, the most common mistakes, then build a DCF on real numbers.",
    steps: [
      { label: "Time Value of Money", href: paths.guide("time-value-of-money") },
      { label: "Cost of Capital (Debt, Equity, WACC)", href: paths.guide("cost-of-capital") },
      { label: "DCF: Theory and Mechanics", href: paths.guide("dcf-theory-and-mechanics") },
      { label: "Common DCF Mistakes", href: paths.guide("common-dcf-mistakes") },
      { label: "Build a DCF, Step by Step (lesson)", href: paths.interactiveItem("build-a-dcf") },
      { label: "DCF Sensitivity Calculator", href: paths.interactiveItem("dcf-sensitivity") },
    ],
  },
  {
    id: "screen-a-stock",
    title: "I want to judge a stock quickly",
    intro: "The ratios that matter, what a good number looks like, and the checks that catch bad companies.",
    steps: [
      { label: "PE Ratio", href: paths.formula("pe-ratio") },
      { label: "Return on Equity", href: paths.formula("return-on-equity") },
      { label: "Debt to Equity Ratio", href: paths.formula("debt-to-equity") },
      { label: "CFO to PAT Ratio", href: paths.formula("cfo-to-pat") },
      { label: "Promoter Holding", href: paths.formula("promoter-holding") },
      { label: "Spot the Red Flags (lesson)", href: paths.interactiveItem("spot-the-red-flags") },
    ],
  },
  {
    id: "banks",
    title: "I am analysing a bank",
    intro: "Banks break the usual rules. This is the ratio set that replaces them.",
    steps: [
      { label: "Sector-Specific Valuation (Banks, Insurance, Real Estate)", href: paths.guide("sector-specific-valuation") },
      { label: "CASA Ratio", href: paths.formula("casa-ratio") },
      { label: "Net NPA Ratio", href: paths.formula("net-npa") },
      { label: "Net Interest Margin", href: paths.formula("net-interest-margin") },
      { label: "Common-Size Analysis (Banks)", href: paths.formula("common-size-analysis-banks") },
      { label: "Why Banks Cannot Be Valued Like Normal Companies", href: paths.guide("sector-specific-valuation") },
    ],
  },
];

export default function StartHere() {
  const crumbs = [{ name: "Start here", path: "/start-here" }];
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Start Here",
          slug: "start-here",
          section: "vault",
          summary: "Four reading paths through The Valuation Node: first financial statements, valuing a company, judging a stock quickly, and analysing a bank.",
        })}
        path="/start-here"
        titleTag="Start Here: Reading Paths - The Valuation Node"
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <div className="container max-w-5xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Start here</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          The library is meant to be read in any order, but if you want a path, pick the one that matches
          why you came. Each step is an existing page; the order is the only thing added.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PATHS.map((p) => (
            <section key={p.id} className="border border-border bg-card p-6" aria-labelledby={`path-${p.id}`}>
              <h2 id={`path-${p.id}`} className="font-serif text-xl leading-snug">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.intro}</p>
              <ol className="mt-4 space-y-2">
                {p.steps.map((s, i) => (
                  <li key={s.href + i} className="flex gap-3 text-sm">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <Link to={s.href} className="hover:underline">{s.label}</Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <section className="mt-14" aria-labelledby="tracks-heading">
          <h2 id="tracks-heading" className="text-xl font-semibold tracking-tight">Or follow a track</h2>
          <p className="mt-2 text-sm text-muted-foreground">Nine tracks of Concept Guides, each readable in order.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t) => (
              <li key={t.id} className="border border-border bg-card p-4">
                <Link to={paths.track(t.id)} className="font-semibold hover:underline">{t.label}</Link>
                <p className="mt-1 text-xs text-muted-foreground">{itemsInTrack(t.id).length} guides</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
