import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const moduleLabels: Record<string, string> = {
  "build-a-dcf": "Build a DCF, Step by Step",
  "read-an-income-statement": "Read an Income Statement, Line by Line",
  "compute-ratios": "Compute Ratios from Raw Statements",
  "compare-two-companies": "Compare Two Companies Side by Side",
  "spot-the-red-flags": "Spot the Red Flags",
};

export default function LearnByDoingModule() {
  const { slug } = useParams<{ slug: string }>();
  const title = slug ? (moduleLabels[slug] ?? slug) : "Module";

  return (
    <Layout>
      <Helmet>
        <title>{title} - Learn-by-Doing - The Valuation Node</title>
        <link rel="canonical" href={`https://thevaluationnode.com/learn/by-doing/${slug}`} />
      </Helmet>

      <div className="container max-w-3xl py-14 text-center">
        <Link to="/learn/by-doing" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Learn-by-Doing
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-4 text-muted-foreground">This module is coming soon.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Subscribe to be notified when it launches.
        </p>
        <div className="mt-10 max-w-md mx-auto">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
