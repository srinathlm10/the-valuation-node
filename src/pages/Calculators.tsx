import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FutureValueCalculator, SIPCalculator } from "@/components/calculators/FormulaCalculators";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Wallet, PiggyBank, Building, CreditCard } from "lucide-react";

export default function Calculators() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleExplainFormula = (formula: string, result: any) => {
    setChatContext(`Explaining ${formula} calculation`);
    setInitialMessage(
      `Explain the ${formula} formula calculation step by step. I used these inputs: ${JSON.stringify(result.inputs)} and got a result of ₹${Math.round(result.output).toLocaleString("en-IN")}. Break down the math and explain why this matters for wealth building in India.`
    );
    setChatOpen(true);
  };

  const upcomingCalculators = [
    { name: "CAGR Calculator", icon: TrendingUp, description: "Calculate compound annual growth rate" },
    { name: "Tax Savings (80C)", icon: Wallet, description: "Optimize tax-saving investments" },
    { name: "EMI Calculator", icon: CreditCard, description: "Calculate loan EMI and interest" },
    { name: "Retirement Corpus", icon: PiggyBank, description: "Plan your retirement savings" },
    { name: "Real Estate ROI", icon: Building, description: "Analyze property investment returns" },
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-slate">
              <Calculator className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Financial Calculators</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Interactive tools to plan your investments. Each calculator includes an "Explain the Math" 
            button that uses FinBot to break down the formula step by step.
          </p>
        </div>
      </section>

      {/* Active Calculators */}
      <section className="container py-8">
        <h2 className="text-xl font-semibold mb-6">Available Calculators</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SIPCalculator onExplain={handleExplainFormula} />
          <FutureValueCalculator onExplain={handleExplainFormula} />
        </div>
      </section>

      {/* Upcoming Calculators */}
      <section className="container py-8">
        <h2 className="text-xl font-semibold mb-6">Coming Soon</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingCalculators.map((calc) => (
            <Card key={calc.name} className="opacity-60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <calc.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{calc.name}</CardTitle>
                    <CardDescription className="text-xs">{calc.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
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
