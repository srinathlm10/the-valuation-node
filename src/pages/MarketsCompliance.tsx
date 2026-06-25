import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { ComplianceFeed } from "@/components/compliance/ComplianceFeed";

export default function MarketsCompliance() {
  return (
    <Layout>
      <Helmet>
        <title>Compliance — Markets — The Valuation Node</title>
        <meta
          name="description"
          content="SEBI, NSE, and BSE regulatory circulars. Updated monthly."
        />
        <link rel="canonical" href="https://thevaluationnode.com/markets/compliance" />
      </Helmet>

      <div className="container py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/markets" className="hover:text-foreground">Markets</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Compliance</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Updated monthly. For real-time updates, see{" "}
            <a
              href="https://www.sebi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              SEBI
            </a>{" "}
            and exchange websites directly.
          </p>
        </div>

        <ComplianceFeed />
      </div>
    </Layout>
  );
}
