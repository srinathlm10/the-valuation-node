import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const SECTIONS = [
  {
    title: "Default DCF approach",
    body: "A five-year explicit forecast of free cash flow, followed by a Gordon growth terminal value. Revenue growth anchors to history and industry context, margins are modelled explicitly, and the terminal growth rate stays at or below long-run nominal GDP growth. Because terminal value usually dominates the answer, every published DCF shows a sensitivity table across WACC and terminal growth rather than a single point estimate.",
  },
  {
    title: "WACC methodology",
    body: "Cost of equity comes from CAPM: the 10-year G-sec yield as the risk-free rate, an equity risk premium appropriate for Indian equities, and a beta sanity-checked against business risk rather than taken raw from a regression. Cost of debt uses the company's actual borrowing cost where disclosed. Weights use market values, and the result is treated as a range, not a precise number.",
  },
  {
    title: "Treatment of operating leases under Ind AS",
    body: "Ind AS 116 already brings leases onto the balance sheet, so lease liabilities are treated as debt and right-of-use assets as operating assets. Where pre-116 periods are compared with current ones, older figures are adjusted so margins and leverage stay comparable across time.",
  },
  {
    title: "Treatment of one-offs and non-recurring items",
    body: "Exceptional items, asset-sale gains, impairments, and one-time provisions are stripped out to reach normalised earnings before any multiple or forecast is built on them. Items labelled exceptional that recur every year are treated as operating costs, because at that point they are.",
  },
  {
    title: "Data sources for Indian markets",
    body: "Primary sources first: exchange filings on NSE and BSE, annual reports, and regulatory documents. Aggregators are used for convenience and always traced back to the filing for any number that matters. Where a figure is an estimate or rounded for teaching, it is labelled as such.",
  },
  {
    title: "Stance on ESG integration",
    body: "ESG factors enter the analysis only where they change cash flows, risk, or terminal assumptions: carbon costs for emitters, governance risk in the discount rate, stranded-asset risk in terminal value. No generic ESG-score premiums or discounts are applied, because a score is not a cash flow.",
  },
];

export default function AboutMethodology() {
  return (
    <Layout>
      <Helmet>
        <title>Methodology - The Valuation Node</title>
        <meta
          name="description"
          content="How Gajji Srinath approaches financial analysis - DCF, WACC, data sources, and more."
        />
        <link rel="canonical" href="https://valuationnode.com/about/methodology" />
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Methodology</li>
        </ol>
      </nav>

      <div className="container max-w-3xl py-12">
        <p className="text-sm text-muted-foreground mb-6 italic">
          This page documents how I approach financial analysis. It is updated as my methodology
          evolves.
        </p>

        <h1 className="text-3xl font-bold tracking-tight">Methodology</h1>

        <div className="mt-8 space-y-10 divide-y">
          {SECTIONS.map((section) => (
            <div key={section.title} className="pt-8 first:pt-0">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed font-serif">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
