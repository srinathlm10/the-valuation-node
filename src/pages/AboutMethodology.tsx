import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const SECTIONS = [
  "Default DCF approach",
  "WACC methodology",
  "Treatment of operating leases under Ind AS",
  "Treatment of one-offs and non-recurring items",
  "Data sources for Indian markets",
  "Stance on ESG integration",
];

export default function AboutMethodology() {
  return (
    <Layout>
      <Helmet>
        <title>Methodology - The Valuation Node</title>
        <meta
          name="description"
          content="How Srinath Gajji approaches financial analysis - DCF, WACC, data sources, and more."
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
            <div key={section} className="pt-8 first:pt-0">
              <h2 className="text-lg font-semibold">{section}</h2>
              <p className="mt-3 text-sm text-muted-foreground italic">
                {/* TODO: Srinath to fill in methodology notes for each section. */}
                [Content for "{section}" - Srinath to fill.]
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
