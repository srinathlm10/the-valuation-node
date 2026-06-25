import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { FutureValueCalculator, SIPCalculator } from "@/components/calculators/FormulaCalculators";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const TOOL_META: Record<string, {
  label: string;
  description: string;
  howToUse: string;
  mathExplainer: string;
  foundationsLink?: { href: string; label: string };
}> = {
  sip: {
    label: "SIP Calculator",
    description: "Estimate the maturity value of a Systematic Investment Plan (SIP) over time.",
    howToUse: "Enter your monthly investment amount, the expected annual return rate, and the investment duration in years. The calculator shows your estimated corpus at the end of the period.\n\nUse realistic return assumptions — Indian equity mutual funds have historically returned 12–15% CAGR over long periods, but past performance is not a guarantee.",
    mathExplainer: "SIP maturity value = P × [(1+r)ⁿ − 1] / r × (1+r), where P is the monthly investment, r is the monthly return rate (annual rate ÷ 12), and n is the total number of months.",
    foundationsLink: { href: "/learn/foundations/corporate-finance/time-value-of-money", label: "Time Value of Money" },
  },
  "future-value": {
    label: "Future Value Calculator",
    description: "Calculate the future value of a lump-sum investment given a rate of return and time horizon.",
    howToUse: "Enter the principal (lump-sum amount), the expected annual return, and the number of years. The result is the compounded value of your investment.\n\nThis is useful for estimating how a one-time investment grows, unlike SIP which models periodic investments.",
    mathExplainer: "FV = PV × (1 + r)ⁿ, where PV is the present value (principal), r is the annual rate of return, and n is the number of years.",
    foundationsLink: { href: "/learn/foundations/corporate-finance/time-value-of-money", label: "Time Value of Money" },
  },
  "present-value": {
    label: "Present Value Calculator",
    description: "Find the present value of a future sum, given a discount rate and time horizon.",
    howToUse: "Enter the future value, the discount rate (your required rate of return), and the number of years. The result tells you what that future sum is worth in today's terms.",
    mathExplainer: "PV = FV / (1 + r)ⁿ, where FV is the future value, r is the discount rate, and n is the number of years.",
    foundationsLink: { href: "/learn/foundations/valuation/dcf-theory-and-mechanics", label: "DCF: Theory and Mechanics" },
  },
  cagr: {
    label: "CAGR Calculator",
    description: "Compute the compound annual growth rate between a starting and ending value over a number of years.",
    howToUse: "Enter the beginning value, ending value, and number of years. CAGR is the single rate at which the beginning value would have grown each year to reach the ending value.",
    mathExplainer: "CAGR = (Ending Value / Beginning Value)^(1/n) − 1, where n is the number of years.",
    foundationsLink: { href: "/learn/foundations/financial-statement-analysis/market-ratios", label: "Market Ratios" },
  },
  "compound-interest": {
    label: "Compound Interest Calculator",
    description: "Calculate interest that compounds over time at a given frequency.",
    howToUse: "Enter the principal, annual interest rate, compounding frequency (monthly, quarterly, annually), and number of years.",
    mathExplainer: "A = P × (1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency per year, and t is years.",
    foundationsLink: { href: "/learn/foundations/corporate-finance/time-value-of-money", label: "Time Value of Money" },
  },
  "rule-of-72": {
    label: "Rule of 72",
    description: "A quick mental-math shortcut to estimate how many years it takes to double an investment.",
    howToUse: "Divide 72 by the annual rate of return. The result is the approximate number of years to double your money. The calculator also shows the exact answer for comparison.",
    mathExplainer: "Approximate doubling time ≈ 72 / r, where r is the annual return rate as a percentage. The exact formula is ln(2) / ln(1 + r).",
    foundationsLink: { href: "/learn/foundations/corporate-finance/time-value-of-money", label: "Time Value of Money" },
  },
  emi: {
    label: "EMI Calculator",
    description: "Calculate the Equated Monthly Instalment (EMI) for a loan.",
    howToUse: "Enter the loan principal, annual interest rate, and tenure in months. The calculator shows the monthly EMI, total interest paid, and total amount payable.",
    mathExplainer: "EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is principal, r is monthly interest rate, and n is the number of months.",
    foundationsLink: { href: "/learn/foundations/corporate-finance/cost-of-capital", label: "Cost of Capital" },
  },
  "inflation-adjusted-returns": {
    label: "Inflation-Adjusted Returns Calculator",
    description: "See what a nominal return actually means after adjusting for inflation.",
    howToUse: "Enter the nominal return and the inflation rate. The real return tells you the purchasing power gain — which is what matters for long-term wealth creation.",
    mathExplainer: "Real Return ≈ (1 + Nominal Return) / (1 + Inflation Rate) − 1. This is the Fisher equation.",
    foundationsLink: { href: "/learn/foundations/markets-and-instruments/debt-markets-and-yield-curves", label: "Debt Markets and Yield Curves" },
  },
};

function MathExplainer({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        What the math is doing
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="px-4 py-4 text-sm text-muted-foreground font-mono whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
}

// Placeholder calculator for tools without a dedicated component yet
function PlaceholderCalculator({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="text-muted-foreground font-medium">{label}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {/* TODO: Implement calculator UI for this tool */}
        Calculator UI coming soon.
      </p>
    </div>
  );
}

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? TOOL_META[slug] : null;

  if (!meta) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center">
          <p className="text-muted-foreground">Tool not found.</p>
          <Link to="/tools" className="mt-4 inline-block text-sm hover:underline">← Tools</Link>
        </div>
      </Layout>
    );
  }

  const renderCalculator = () => {
    if (slug === "sip") return <SIPCalculator onExplain={() => {}} />;
    if (slug === "future-value") return <FutureValueCalculator onExplain={() => {}} />;
    return <PlaceholderCalculator label={meta.label} />;
  };

  return (
    <Layout>
      <Helmet>
        <title>{meta.label} — Tools — The Valuation Node</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`https://thevaluationnode.com/tools/${slug}`} />
      </Helmet>

      <div className="container max-w-3xl py-14">
        <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{meta.label}</h1>
        <p className="mt-3 text-muted-foreground">{meta.description}</p>

        {/* Calculator */}
        <div className="mt-8">{renderCalculator()}</div>

        {/* How to use */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">How to use this</h2>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {meta.howToUse}
          </p>
        </section>

        {/* Math explainer */}
        <MathExplainer content={meta.mathExplainer} />

        {/* See it used in */}
        <div className="mt-6 rounded-lg border p-4">
          <h2 className="text-sm font-semibold">See it used in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Links to research articles using this tool will appear here.
          </p>
        </div>

        {/* Learn the concept */}
        {meta.foundationsLink && (
          <div className="mt-3 rounded-lg border p-4">
            <h2 className="text-sm font-semibold">Learn the concept</h2>
            <Link
              to={meta.foundationsLink.href}
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              {meta.foundationsLink.label} →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
