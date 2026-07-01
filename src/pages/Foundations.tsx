import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Full topic tree
export const FOUNDATIONS_TREE = [
  {
    section: "accounting",
    label: "Accounting",
    topics: [
      { slug: "reading-an-income-statement", label: "Reading an Income Statement", published: true },
      { slug: "reading-a-balance-sheet", label: "Reading a Balance Sheet", published: true },
      { slug: "reading-a-cash-flow-statement", label: "Reading a Cash Flow Statement", published: true },
      { slug: "linking-the-three-statements", label: "Linking the Three Statements", published: true },
      { slug: "ind-as-vs-ifrs-vs-indian-gaap", label: "Ind AS vs IFRS vs Indian GAAP", published: true },
      { slug: "common-adjustments", label: "Common Adjustments (leases, ESOPs, one-offs)", published: true },
      { slug: "quality-of-earnings", label: "Quality of Earnings", published: true },
    ],
  },
  {
    section: "corporate-finance",
    label: "Corporate Finance",
    topics: [
      { slug: "time-value-of-money", label: "Time Value of Money", published: true },
      { slug: "cost-of-capital", label: "Cost of Capital (Debt, Equity, WACC)", published: true },
      { slug: "capital-structure", label: "Capital Structure", published: true },
      { slug: "working-capital", label: "Working Capital", published: true },
      { slug: "capital-budgeting", label: "Capital Budgeting (NPV, IRR, Payback)", published: true },
    ],
  },
  {
    section: "valuation",
    label: "Valuation",
    topics: [
      { slug: "dcf-theory-and-mechanics", label: "DCF: Theory and Mechanics", published: true },
      { slug: "relative-valuation", label: "Relative Valuation (P/E, EV/EBITDA, P/B, EV/Sales)", published: true },
      { slug: "sum-of-the-parts", label: "Sum-of-the-Parts", published: true },
      { slug: "sector-specific-valuation", label: "Sector-Specific Valuation (Banks, Insurance, Real Estate)", published: true },
      { slug: "terminal-value-approaches", label: "Terminal Value Approaches", published: true },
      { slug: "common-dcf-mistakes", label: "Common DCF Mistakes", published: true },
    ],
  },
  {
    section: "financial-statement-analysis",
    label: "Financial Statement Analysis",
    topics: [
      { slug: "profitability-ratios", label: "Profitability Ratios", published: true },
      { slug: "liquidity-ratios", label: "Liquidity Ratios", published: true },
      { slug: "solvency-ratios", label: "Solvency Ratios", published: true },
      { slug: "efficiency-ratios", label: "Efficiency Ratios", published: true },
      { slug: "market-ratios", label: "Market Ratios", published: true },
      { slug: "dupont-decomposition", label: "DuPont Decomposition", published: true },
    ],
  },
  {
    section: "credit-analysis",
    label: "Credit Analysis",
    topics: [
      { slug: "credit-risk-fundamentals", label: "Credit Risk Fundamentals", published: true },
      { slug: "reading-crisil-icra-moodys-reports", label: "Reading CRISIL, ICRA, Moody's Reports", published: true },
      { slug: "altman-z-score", label: "Altman Z-Score and Distress Models", published: true },
      { slug: "bond-pricing-and-yields", label: "Bond Pricing and Yields", published: true },
      { slug: "covenants-and-triggers", label: "Covenants and Triggers", published: true },
    ],
  },
  {
    section: "markets-and-instruments",
    label: "Markets and Instruments",
    topics: [
      { slug: "equities", label: "Equities (NSE, BSE, IPO Process)", published: true },
      { slug: "debt-markets-and-yield-curves", label: "Debt Markets and Yield Curves", published: true },
      { slug: "derivatives", label: "Derivatives (Futures, Options, Swaps)", published: true },
      { slug: "mutual-funds-etfs-aifs", label: "Mutual Funds, ETFs, AIFs", published: true },
      { slug: "reits-and-invits", label: "REITs and InvITs", published: true },
      { slug: "technical-analysis-primer", label: "Technical Analysis Primer", published: true },
    ],
  },
  {
    section: "esg-and-sustainable-finance",
    label: "ESG and Sustainable Finance",
    topics: [
      { slug: "esg-fundamentals", label: "ESG Fundamentals", published: true },
      { slug: "reporting-frameworks", label: "Reporting Frameworks (BRSR, SASB, ISSB)", published: true },
      { slug: "carbon-accounting", label: "Carbon Accounting", published: true },
      { slug: "green-bonds", label: "Green Bonds and Sustainability-Linked Debt", published: true },
      { slug: "esg-integrated-valuation", label: "ESG-Integrated Valuation", published: true },
      { slug: "climate-risk-and-stranded-assets", label: "Climate Risk and Stranded Assets", published: true },
    ],
  },
  {
    section: "fintech-and-digital-finance",
    label: "Fintech and Digital Finance",
    topics: [
      { slug: "payments-landscape", label: "Payments Landscape (UPI, Cards, Wallets)", published: true },
      { slug: "digital-lending-models", label: "Digital Lending Models", published: true },
      { slug: "credit-scoring", label: "Credit Scoring (Traditional and Alt-Data)", published: true },
      { slug: "blockchain-and-defi-primer", label: "Blockchain and DeFi Primer", published: true },
      { slug: "cybersecurity-in-financial-systems", label: "Cybersecurity in Financial Systems", published: true },
      { slug: "account-aggregators", label: "Account Aggregators", published: true },
    ],
  },
  {
    section: "data-and-tools",
    label: "Data and Tools for Finance",
    topics: [
      { slug: "excel-modeling-conventions", label: "Excel Modeling Conventions", published: true },
      { slug: "python-for-finance", label: "Python for Finance (pandas, yfinance, numpy)", published: true },
      { slug: "sql-for-finance-data", label: "SQL for Finance Data", published: true },
      { slug: "where-to-find-indian-markets-data", label: "Where to Find Indian Markets Data", published: true },
    ],
  },
];

function Sidebar({ activeSection }: { activeSection?: string }) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(activeSection ? [activeSection] : [FOUNDATIONS_TREE[0].section])
  );

  const toggle = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <nav className="space-y-1">
      {FOUNDATIONS_TREE.map((group) => (
        <div key={group.section}>
          <button
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeSection === group.section
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => toggle(group.section)}
          >
            {group.label}
            {openSections.has(group.section) ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {openSections.has(group.section) && (
            <div className="ml-3 mt-1 space-y-0.5">
              {group.topics.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/learn/foundations/${group.section}/${topic.slug}`}
                  className={cn(
                    "flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors",
                    topic.published
                      ? "text-foreground hover:bg-muted"
                      : "text-muted-foreground/60 cursor-default pointer-events-none"
                  )}
                >
                  {topic.label}
                  {!topic.published && (
                    <span className="ml-auto text-xs text-muted-foreground/50">Soon</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function Foundations() {
  return (
    <Layout>
      <Helmet>
        <title>Foundations - The Valuation Node</title>
        <meta
          name="description"
          content="Finance from first principles. Topics in accounting, valuation, credit, markets, ESG, and fintech, with Indian context."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/foundations" />
      </Helmet>

      <div className="container py-14">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-3">
                Topics
              </p>
              <Sidebar />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 max-w-2xl">
            <Link
              to="/learn"
              className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
            >
              ← Learn
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Foundations</h1>
            <p className="mt-3 text-muted-foreground">
              Finance concepts from first principles. Each topic covers intuition, mechanics, and
              worked examples with real Indian company data.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Select a topic from the sidebar. Pages marked "Soon" are placeholders - content is
              added as it's written.
            </p>

            <div className="mt-10 lg:hidden">
              <Sidebar />
            </div>

            <div className="mt-12">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
