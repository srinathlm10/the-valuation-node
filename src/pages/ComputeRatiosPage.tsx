import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ComputeRatiosLesson } from "@/components/learn/ComputeRatiosLesson";

export default function ComputeRatiosPage() {
  return (
    <Layout>
      <Helmet>
        <title>Compute Ratios from Raw Statements - Learn-by-Doing - The Valuation Node</title>
        <meta
          name="description"
          content="Pull numbers from real financial statements and compute the ratios analysts use every day. Type your answers and get instant feedback."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/by-doing/compute-ratios" />
        <meta property="og:title" content="Compute Ratios from Raw Statements - The Valuation Node" />
        <meta
          property="og:description"
          content="An interactive drill: compute margin, ROE, current ratio, leverage, and more from raw statements, with instant validation."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Compute Ratios from Raw Statements",
            description:
              "An interactive drill where you compute financial ratios from raw statements and get instant feedback.",
            provider: { "@type": "Organization", name: "The Valuation Node" },
            educationalLevel: "Beginner to Intermediate",
            learningResourceType: "Interactive Exercise",
            teaches: ["Financial ratios", "Net margin", "ROE", "Current ratio", "Debt-to-equity", "Interest coverage"],
            url: "https://valuationnode.com/learn/by-doing/compute-ratios",
          })}
        </script>
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-5xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/by-doing" className="hover:text-foreground">Learn-by-Doing</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Compute Ratios</li>
        </ol>
      </nav>

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compute Ratios from Raw Statements</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            The only way to truly learn ratios is to compute them yourself. You'll be given the raw numbers from a real
            company's statements and the formula, then you type the answer. Get instant feedback and a plain-English
            interpretation of what each ratio actually tells you.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~25 min</span>
            <span>·</span>
            <span>6 ratios</span>
            <span>·</span>
            <span>Beginner to Intermediate</span>
          </div>
        </div>

        <ComputeRatiosLesson />
      </div>
    </Layout>
  );
}
