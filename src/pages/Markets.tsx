import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight } from "lucide-react";

export default function Markets() {
  return (
    <Layout>
      <Helmet>
        <title>Markets - The Valuation Node</title>
        <meta
          name="description"
          content="Indian market data - Nifty 50 fundamentals and SEBI/NSE/BSE compliance circulars."
        />
        <link rel="canonical" href="https://thevaluationnode.com/markets" />
      </Helmet>

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
        <p className="mt-3 text-muted-foreground">
          Reference data on Indian markets. Updated monthly.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            to="/markets/nifty50"
            className="group rounded-xl border bg-muted/10 p-6 hover:bg-muted/30 transition-colors"
          >
            <h2 className="font-semibold text-lg group-hover:underline">Nifty 50</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fundamental data on P/E, P/B, dividend yield, and market cap for all 50 constituents.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
              View data <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            to="/markets/compliance"
            className="group rounded-xl border bg-muted/10 p-6 hover:bg-muted/30 transition-colors"
          >
            <h2 className="font-semibold text-lg group-hover:underline">Compliance</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              SEBI, NSE, and BSE circulars. Updated monthly. For real-time updates, see official exchange websites.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
              View circulars <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
