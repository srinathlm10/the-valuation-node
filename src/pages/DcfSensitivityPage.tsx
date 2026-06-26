import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { DcfSensitivityCalculator } from "@/components/tools/DcfSensitivityCalculator";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

export default function DcfSensitivityPage() {
  return (
    <Layout>
      <Helmet>
        <title>DCF Sensitivity Calculator - Tools - The Valuation Node</title>
        <meta
          name="description"
          content="Interactive DCF model with a 5×5 sensitivity grid across WACC and terminal growth. Adjust assumptions live and download as Excel. Built for Indian markets research."
        />
        <link rel="canonical" href="https://thevaluationnode.com/tools/dcf-sensitivity" />
        <meta property="og:title" content="DCF Sensitivity Calculator - The Valuation Node" />
        <meta
          property="og:description"
          content="Two-stage DCF model with live sliders, sensitivity heatmap, and Excel export. For Indian markets research."
        />
      </Helmet>

      <div className="container max-w-5xl py-14">
        <Link
          to="/tools"
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Tools
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">DCF Sensitivity Calculator</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          A two-stage discounted cash flow model with live assumption sliders and a WACC × terminal
          growth sensitivity grid. Adjust below and download your model as Excel.
        </p>

        <div className="mt-8">
          <DcfSensitivityCalculator />
        </div>

        {/* How to use */}
        <section className="mt-14 space-y-3">
          <h2 className="text-xl font-semibold">How to read this</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Assumptions (top-left):</strong> Six sliders control
              the key drivers. Revenue growth and operating margin determine the size of each year's FCF.
              WACC is the cost of capital - it both discounts the forecast-period cash flows and anchors
              the terminal value denominator. Terminal growth is the rate at which cash flows are assumed
              to grow in perpetuity beyond the forecast period.
            </p>
            <p>
              <strong className="text-foreground">Cash flow table (top-right):</strong> Year-by-year
              projection. FCF here is NOPAT (EBIT after tax) - a simplification that ignores capex and
              working capital changes. The TV row shows the Gordon Growth perpetuity value, discounted
              back to today. The final EV row is their sum.
            </p>
            <p>
              <strong className="text-foreground">Sensitivity grid (bottom-left):</strong> The 5×5
              matrix holds WACC fixed on columns (±2% from your base) and terminal growth on rows. Green
              = higher value, red = lower. The outlined cell is your current base case. A single-point
              DCF estimate is almost never the right answer - the grid shows the range of outcomes under
              plausible assumptions.
            </p>
            <p>
              <strong className="text-foreground">Valuation summary (bottom-right):</strong> Enterprise
              value minus net debt gives equity value. Divide by shares outstanding to get per-share
              intrinsic value. If you set a current market price (via the props API when embedding this
              in a research article), the tool shows upside or downside to the market's implied estimate.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <section className="mt-8 border rounded-lg p-5 bg-muted/20 space-y-2">
          <h2 className="text-sm font-semibold">What this model does not capture</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Capex and depreciation (FCF ≠ NOPAT in capital-intensive businesses)</li>
            <li>Working capital changes across the business cycle</li>
            <li>Balance sheet items: debt maturity profile, contingent liabilities, minorities</li>
            <li>Non-linear or declining growth phases (a two-stage or three-stage model)</li>
            <li>
              Qualitative factors: management quality, competitive moat, regulatory environment,
              promoter track record
            </li>
          </ul>
          <p className="text-xs text-muted-foreground pt-1">
            Use this as a first-pass framework, then stress-test with your own numbers.
          </p>
        </section>

        {/* Learn links */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold">Learn the concept</p>
            <Link
              to="/learn/foundations/valuation/dcf-theory-and-mechanics"
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              DCF: Theory and Mechanics →
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold">Common DCF mistakes</p>
            <Link
              to="/learn/foundations/valuation/common-dcf-mistakes"
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              Common DCF Mistakes →
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold">Cost of capital</p>
            <Link
              to="/learn/foundations/corporate-finance/cost-of-capital"
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              Cost of Capital →
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold">Terminal value approaches</p>
            <Link
              to="/learn/foundations/valuation/terminal-value-approaches"
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              Terminal Value Approaches →
            </Link>
          </div>
        </div>

        {/* See it used in research */}
        <div className="mt-4 rounded-lg border p-4">
          <p className="text-sm font-semibold">See it used in research</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Links to research articles using this DCF model will appear here once published.
          </p>
        </div>

        {/* Newsletter */}
        <div className="mt-12 max-w-md">
          <NewsletterSignup source="tools:dcf-sensitivity" />
        </div>
      </div>
    </Layout>
  );
}
