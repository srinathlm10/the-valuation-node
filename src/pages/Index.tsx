import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CircularCard } from "@/components/compliance/ComplianceFeed";
import { FutureValueCalculator, SIPCalculator } from "@/components/calculators/FormulaCalculators";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, FileText, Calculator, Building2, BookOpen, ArrowRight } from "lucide-react";
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
      <section className="relative overflow-hidden gradient-slate">
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-hero-heading">Decoding Indian Finance</h1>
            <p className="text-lg md:text-xl text-hero-subtext max-w-2xl mx-auto">
              Navigate SEBI regulations, understand complex financial concepts, and analyze fundamentals with AI-powered insights.
            </p>
            <div className="flex justify-center pt-4">
              <div className="w-full max-w-md"><GlobalSearch /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 -mt-8 relative z-10">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { href: "/compliance", icon: FileText, color: "bg-blue-100 text-blue-700", title: "Compliance Feed", desc: "Latest SEBI, NSE & BSE circulars" },
            { href: "/stocks", icon: Building2, color: "bg-emerald-100 text-emerald-700", title: "Stock Archive", desc: "Nifty 50 fundamentals" },
            { href: "/learn", icon: BookOpen, color: "bg-purple-100 text-purple-700", title: "Finance Lab", desc: "Interactive glossary & formulas" },
            { href: "/calculators", icon: Calculator, color: "bg-amber-100 text-amber-700", title: "Calculators", desc: "SIP, FV, CAGR & more" },
          ].map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="card-hover h-full border-2 hover:border-primary/20">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
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
            <CircularCard key={circular.id} circular={circular} onBotSummary={handleBotSummary} onViewDetails={() => {}} />
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
