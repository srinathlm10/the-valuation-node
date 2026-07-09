import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import {
  FutureValueCalculator,
  SIPCalculator,
  CAGRCalculator,
  EMICalculator,
  PresentValueCalculator,
  CompoundInterestCalculator,
  RuleOf72Calculator,
  InflationAdjustedReturnCalculator,
} from "@/components/calculators/FormulaCalculators";
import { CollapsibleSection } from "@/components/content/CollapsibleSection";

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
    howToUse: "Enter your monthly investment amount, the expected annual return rate, and the investment duration in years. The calculator shows your estimated corpus at the end of the period.\n\nUse realistic return assumptions. Indian equity mutual funds have historically returned 12–15% CAGR over long periods, but past performance is not a guarantee.",
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
    description: "Calculate the Equated Monthly Instalment (EMI) for a home, car, or personal loan, plus the total interest you will pay over the tenure.",
    howToUse: "Enter the loan principal, the annual interest rate, and the tenure. The calculator shows the monthly EMI, the total interest paid over the life of the loan, and the total amount payable.\n\nTwo things are worth noticing as you move the sliders. First, tenure cuts both ways: a longer tenure lowers the monthly EMI but sharply increases the total interest paid, so the cheapest-feeling loan is often the most expensive one. Second, EMIs are front-loaded: in the early years most of each instalment is interest, not principal, which is why prepaying early in the tenure saves far more interest than prepaying late.\n\nTypical Indian lending rates differ by loan type: home loans are usually the cheapest (they are secured), followed by car loans, with personal loans and credit card debt the most expensive. Always compare the total interest figure, not just the EMI, when choosing between offers.",
    mathExplainer: "EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is principal, r is the monthly interest rate (annual rate ÷ 12), and n is the number of months.\n\nTotal amount payable = EMI × n. Total interest = EMI × n − P.",
    foundationsLink: { href: "/learn/foundations/corporate-finance/cost-of-capital", label: "Cost of Capital" },
  },
  "inflation-adjusted-returns": {
    label: "Inflation-Adjusted Returns Calculator",
    description: "See what a nominal return actually means after inflation, the real growth in your purchasing power.",
    howToUse: "Enter the nominal return your investment earns and the inflation rate you expect. The calculator shows the real return: the growth in what your money can actually buy.\n\nThis distinction matters more than most investors realise. A fixed deposit earning 7% while inflation runs at 6% grows your purchasing power by barely 1% a year; after tax on the interest, the real return can even turn negative. That is the quiet way conservative portfolios lose wealth over decades.\n\nNote that the real return is not simply the nominal return minus inflation. The correct formula divides rather than subtracts, and the gap between the two widens as rates rise. For India, CPI inflation has historically averaged in the mid single digits, which is a reasonable starting assumption for long-horizon planning.",
    mathExplainer: "Real Return = (1 + Nominal Return) / (1 + Inflation Rate) − 1. This is the Fisher equation.\n\nThe common shortcut (nominal minus inflation) overstates the real return. Example: 12% nominal with 6% inflation gives a true real return of 1.12/1.06 − 1 = 5.66%, not 6%.",
    foundationsLink: { href: "/learn/foundations/markets-and-instruments/debt-markets-and-yield-curves", label: "Debt Markets and Yield Curves" },
  },
};

// Every tool slug maps to its live calculator component.
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  sip: SIPCalculator,
  "future-value": FutureValueCalculator,
  "present-value": PresentValueCalculator,
  cagr: CAGRCalculator,
  "compound-interest": CompoundInterestCalculator,
  "rule-of-72": RuleOf72Calculator,
  emi: EMICalculator,
  "inflation-adjusted-returns": InflationAdjustedReturnCalculator,
};

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

  const CalculatorComponent = slug ? TOOL_COMPONENTS[slug] : undefined;

  return (
    <Layout>
      <Helmet>
        <title>{meta.label} - Tools - The Valuation Node</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`https://valuationnode.com/tools/${slug}`} />
      </Helmet>

      <div className="container max-w-3xl py-14">
        <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Tools
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{meta.label}</h1>
        <p className="mt-3 text-muted-foreground">{meta.description}</p>

        {/* Calculator */}
        {CalculatorComponent && (
          <div className="mt-8">
            <CalculatorComponent />
          </div>
        )}

        {/* How to use */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">How to use this</h2>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {meta.howToUse}
          </p>
        </section>

        {/* Math explainer */}
        <CollapsibleSection title="What the math is doing" className="mt-6">
          <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
            {meta.mathExplainer}
          </p>
        </CollapsibleSection>

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
