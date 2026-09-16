import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { StockScreener, type Stock } from "@/components/stocks/StockScreener";
import { contentService } from "@/services/contentService";
import localStocks from "@/data/stocks.json";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Serves /news/markets-news/nifty-50. The screener needs `stocks` plus two
// handlers; the old page rendered it with no props and crashed as soon as the
// query resolved (audit item 8.1). Local stocks.json is rendered immediately
// (so the static HTML carries the table) and swapped for the Supabase rows
// once they arrive.

const FALLBACK = localStocks as Stock[];

function fmtCr(v: number) {
  return v >= 100000 ? `₹${(v / 100000).toFixed(2)} L Cr` : `₹${v.toLocaleString("en-IN")} Cr`;
}

function StockProfile({ stock, onClose }: { stock: Stock | null; onClose: () => void }) {
  return (
    <Dialog open={!!stock} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        {stock && (
          <>
            <DialogHeader>
              <DialogTitle>
                {stock.name} <span className="text-muted-foreground font-normal">({stock.id})</span>
              </DialogTitle>
              <DialogDescription>{stock.sector}</DialogDescription>
            </DialogHeader>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div><dt className="text-muted-foreground">Market cap</dt><dd className="font-mono">{fmtCr(stock.marketCap)}</dd></div>
              <div><dt className="text-muted-foreground">Price</dt><dd className="font-mono">₹{stock.currentPrice?.toLocaleString("en-IN")}</dd></div>
              <div><dt className="text-muted-foreground">P/E</dt><dd className="font-mono">{stock.pe?.toFixed(1)}</dd></div>
              <div><dt className="text-muted-foreground">P/B</dt><dd className="font-mono">{stock.pb?.toFixed(2)}</dd></div>
              <div><dt className="text-muted-foreground">ROE</dt><dd className="font-mono">{stock.roe?.toFixed(1)}%</dd></div>
              <div><dt className="text-muted-foreground">Debt to equity</dt><dd className="font-mono">{stock.debtToEquity?.toFixed(2)}</dd></div>
              <div><dt className="text-muted-foreground">Dividend yield</dt><dd className="font-mono">{stock.dividendYield?.toFixed(2)}%</dd></div>
              <div><dt className="text-muted-foreground">EPS</dt><dd className="font-mono">₹{stock.eps?.toFixed(2)}</dd></div>
              <div><dt className="text-muted-foreground">Revenue growth (5y)</dt><dd className="font-mono">{stock.revenueGrowth5Y?.toFixed(1)}%</dd></div>
              <div><dt className="text-muted-foreground">Profit growth (5y)</dt><dd className="font-mono">{stock.profitGrowth5Y?.toFixed(1)}%</dd></div>
              <div><dt className="text-muted-foreground">52-week high</dt><dd className="font-mono">₹{stock.weekHigh52?.toLocaleString("en-IN")}</dd></div>
              <div><dt className="text-muted-foreground">52-week low</dt><dd className="font-mono">₹{stock.weekLow52?.toLocaleString("en-IN")}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Read these numbers with the{" "}
              <Link to={paths.formulas()} className="underline">Key Formulas & Ratios</Link> reference. Snapshot data, not
              live quotes; not investment advice.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function MarketsNifty50() {
  const { data } = useQuery({
    queryKey: ["stocks"],
    queryFn: contentService.getStocks,
  });
  const remote = (data as Stock[] | undefined) ?? [];
  const stocks = remote.length > 0 ? remote : FALLBACK;
  const [selected, setSelected] = useState<Stock | null>(null);
  const path = paths.nifty50();

  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Nifty 50 Fundamentals",
          slug: "nifty-50",
          section: "news",
          subsection: "markets-news",
          summary:
            "Fundamental snapshot of Nifty 50 constituents: market cap, P/E, P/B, ROE, debt to equity, and dividend yield, sortable and filterable by sector.",
        })}
        path={path}
        titleTag="Nifty 50 Fundamentals: P/E, P/B, ROE, Dividend Yield - The Valuation Node"
        jsonLd={[
          breadcrumbLd([
            { name: "News & Trends", path: paths.news() },
            { name: "Markets News", path: paths.newsSub("markets-news") },
            { name: "Nifty 50 Fundamentals", path },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "News & Trends", path: paths.news() }, { name: "Markets News", path: paths.newsSub("markets-news") }, { name: "Nifty 50 Fundamentals", path }]} />

      <div className="container py-14">

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nifty 50 Fundamentals</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Snapshot fundamentals for {stocks.length} constituents. Coverage is expanding; figures are periodic snapshots, not live quotes.
            </p>
          </div>
        </div>

        <StockScreener stocks={stocks} onViewProfile={setSelected} onBotAnalysis={setSelected} />
        <StockProfile stock={selected} onClose={() => setSelected(null)} />
      </div>
    </Layout>
  );
}
