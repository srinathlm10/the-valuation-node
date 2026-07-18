import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { StockScreener } from "@/components/stocks/StockScreener";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "@/services/contentService";
import { Loader2 } from "lucide-react";

export default function MarketsNifty50() {
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: contentService.getStocks,
  });

  const lastUpdated = stocks && (stocks as any[]).length > 0
    ? (stocks as any[])[0]?.last_updated || "-"
    : "-";

  return (
    <Layout>
      <Helmet>
        <title>Nifty 50 - Markets - The Valuation Node</title>
        <meta
          name="description"
          content="Fundamental data for Nifty 50 constituents: P/E, P/B, dividend yield, market cap. Coverage is expanding."
        />
        <link rel="canonical" href="https://valuationnode.com/markets/nifty50" />
      </Helmet>

      <div className="container py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/markets" className="hover:text-foreground">Markets</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Nifty 50</span>
        </nav>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nifty 50</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Snapshot as of {lastUpdated}. Updated monthly.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <StockScreener />
        )}
      </div>
    </Layout>
  );
}
