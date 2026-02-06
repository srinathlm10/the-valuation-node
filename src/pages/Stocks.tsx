import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { StockScreener } from "@/components/stocks/StockScreener";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, Loader2 } from "lucide-react";
import { contentService } from "@/services/contentService";

export default function Stocks() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ['stocks'],
    queryFn: contentService.getStocks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });



  const handleBotAnalysis = (stock: any) => {
    setChatContext(`Analyzing ${stock.name}`);
    setInitialMessage(
      `Analyze ${stock.name} (${stock.id}) based on these fundamentals:\n` +
      `- Sector: ${stock.sector}\n` +
      `- Market Cap: ₹${stock.marketCap.toLocaleString("en-IN")} Cr\n` +
      `- P/E Ratio: ${stock.pe}\n` +
      `- ROE: ${stock.roe}%\n` +
      `- Debt-to-Equity: ${stock.debtToEquity}\n` +
      `- 5Y Revenue Growth: ${stock.revenueGrowth5Y}%\n` +
      `- 5Y Profit Growth: ${stock.profitGrowth5Y}%\n\n` +
      `Explain what these numbers mean for a beginner investor. Is this stock fundamentally strong?`
    );
    setChatOpen(true);
  };

  const handleViewProfile = (stock: any) => {
    setChatContext(`Viewing profile for ${stock.name}`);
    setInitialMessage(
      `Give me a brief overview of ${stock.name} (${stock.id}). What does the company do, and what should I know about its business model and competitive position in the ${stock.sector} sector?`
    );
    setChatOpen(true);
  };

  // Calculate some market stats
  const avgPE = stocks.length > 0 ? stocks.reduce((acc: number, s: any) => acc + (Number(s.pe) || 0), 0) / stocks.length : 0;
  const avgROE = stocks.length > 0 ? stocks.reduce((acc: number, s: any) => acc + (Number(s.roe) || 0), 0) / stocks.length : 0;
  const totalMarketCap = stocks.reduce((acc: number, s: any) => acc + (Number(s.marketCap) || 0), 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Stock Fundamental Archive</h1>
          <p className="text-muted-foreground max-w-2xl">
            Pre-loaded 10-year fundamental data for Nifty 50 companies.
            Analyze key metrics and get AI-powered explanations for beginners.
          </p>
          <Badge variant="secondary" className="mt-4">
            Live Data • Powered by Supabase
          </Badge>
        </div>
      </section>

      {/* Market Overview Cards */}
      <section className="container py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Market Cap (Nifty 50)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ₹{(totalMarketCap / 100000).toFixed(1)}L Cr
                </span>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average P/E Ratio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{avgPE.toFixed(1)}</span>
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average ROE</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{avgROE.toFixed(1)}%</span>
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stock Screener */}
      <section className="container py-6">
        <StockScreener
          stocks={stocks as any}
          onBotAnalysis={handleBotAnalysis}
          onViewProfile={handleViewProfile}
        />
      </section>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        initialMessage={initialMessage}
        context={chatContext}
      />
    </Layout>
  );
}
