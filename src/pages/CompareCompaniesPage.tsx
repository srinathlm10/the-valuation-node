import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CompareCompaniesLesson } from "@/components/learn/CompareCompaniesLesson";

export default function CompareCompaniesPage() {
  return (
    <Layout>
      <Helmet>
        <title>Compare Two Companies Side by Side - Learn-by-Doing - The Valuation Node</title>
        <meta
          name="description"
          content="Use a structured framework to compare two Indian companies in the same sector, growth, margins, returns, leverage, and valuation."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/by-doing/compare-two-companies" />
        <meta property="og:title" content="Compare Two Companies Side by Side - The Valuation Node" />
        <meta
          property="og:description"
          content="Predict the stronger company on each metric, then see the full side-by-side profile and the analyst's verdict."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Compare Two Companies Side by Side",
            description:
              "An interactive framework for comparing two companies in the same sector across growth, margins, returns, leverage, and valuation.",
            provider: { "@type": "Organization", name: "The Valuation Node" },
            educationalLevel: "Intermediate",
            learningResourceType: "Interactive Tutorial",
            teaches: ["Peer comparison", "Relative valuation", "Margins", "ROE", "Leverage", "P/E"],
            url: "https://valuationnode.com/learn/by-doing/compare-two-companies",
          })}
        </script>
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-5xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/by-doing" className="hover:text-foreground">Learn-by-Doing</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Compare Two Companies</li>
        </ol>
      </nav>

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compare Two Companies Side by Side</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Pick two real companies from the same sector and go head-to-head across the dimensions that matter. Predict
            which company is stronger on each metric before the numbers reveal, then see the full profile on a radar
            chart and the analyst's verdict on why the "better business" isn't always the "better investment".
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~15 min</span>
            <span>·</span>
            <span>6 rounds</span>
            <span>·</span>
            <span>Intermediate</span>
          </div>
        </div>

        <CompareCompaniesLesson />
      </div>
    </Layout>
  );
}
