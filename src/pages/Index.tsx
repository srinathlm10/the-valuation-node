import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CircularCard } from "@/components/compliance/ComplianceFeed";
import { FutureValueCalculator, SIPCalculator } from "@/components/calculators/FormulaCalculators";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, FileText, Calculator, Building2, BookOpen, ArrowRight, BarChart3 } from "lucide-react";
import circulars from "@/data/circulars.json";

export default function Index() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleBotSummary = (circular: any) => {
    setChatContext(`Summarizing circular: ${circular.title}`);
    setInitialMessage(`Please explain this regulatory circular in simple terms: "${circular.title}"`);
    setChatOpen(true);
  };

  const handleExplainFormula = (formula: string, result: any) => {
    setChatContext(`Explaining ${formula} calculation`);
    setInitialMessage(`Explain the ${formula} formula. Inputs: ${JSON.stringify(result.inputs)}, Result: ₹${Math.round(result.output).toLocaleString("en-IN")}`);
    setChatOpen(true);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden gradient-slate min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container relative py-16 md:py-24 z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary-foreground backdrop-blur-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              AI-Powered Financial Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-sm">
              Decoding <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Indian Finance</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Navigate SEBI regulations, understand complex financial concepts, and analyze fundamentals with instant AI-powered insights.
            </p>
            <div className="flex justify-center pt-8">
              <div className="w-full max-w-lg shadow-xl"><GlobalSearch /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 -mt-16 relative z-20">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { href: "/compliance", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", title: "Compliance Feed", desc: "Latest SEBI, NSE & BSE circulars" },
            { href: "/stocks", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Stock Archive", desc: "Nifty 50 fundamentals" },
            { href: "/learn", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10", title: "Finance Lab", desc: "Interactive glossary & formulas" },
            { href: "/calculators", icon: Calculator, color: "text-amber-500", bg: "bg-amber-500/10", title: "Calculators", desc: "SIP, FV, CAGR & more" },
          ].map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="card-hover h-full border hover:border-primary/30 bg-card/95 backdrop-blur shadow-lg">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-snug">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Analysis Guides Section */}
      <section className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Master the Markets</h2>
            <p className="text-muted-foreground mt-1">In-depth guides to analyze stocks like a pro</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/learn">View All Guides<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/learn/fundamental-analysis">
            <Card className="card-hover h-full border-2 hover:border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                    <Building2 className="h-7 w-7 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Fundamental Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn to evaluate a company's intrinsic value through financial statements, ratios, and qualitative factors.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">P/E Ratio</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">ROE</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">DCF</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">Balance Sheet</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/learn/technical-analysis">
            <Card className="card-hover h-full border-2 hover:border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                    <BarChart3 className="h-7 w-7 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Technical Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Master chart patterns, indicators, and price action to forecast market movements.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400">RSI</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400">MACD</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400">Candlesticks</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400">Bollinger Bands</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Trending Circulars</h2>
            <p className="text-muted-foreground mt-1">Latest regulatory updates with FinBot summaries</p>
          </div>
          <Button variant="outline" asChild><Link to="/compliance">View All<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {circulars.slice(0, 3).map((circular: any) => (
            <CircularCard key={circular.id} circular={circular} onBotSummary={handleBotSummary} onViewDetails={() => { }} />
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Featured Calculators</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <SIPCalculator onExplain={handleExplainFormula} />
            <FutureValueCalculator onExplain={handleExplainFormula} />
          </div>
        </div>
      </section>

      <section className="container py-12">
        <Card className="gradient-slate">
          <CardContent className="py-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Bot className="h-10 w-10 text-hero-heading" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-hero-heading">Meet FinBot, Your AI Navigator</h2>
              <p className="text-hero-subtext">Get instant, plain-English explanations of regulations and financial concepts.</p>
            </div>
            <Button size="lg" variant="secondary" onClick={() => setChatOpen(true)} className="bg-white/90 text-slate-900 hover:bg-white">
              <Bot className="mr-2 h-5 w-5" />Try FinBot
            </Button>
          </CardContent>
        </Card>
      </section>

      <ChatSidebar isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} initialMessage={initialMessage} context={chatContext} />
    </Layout>
  );
}
