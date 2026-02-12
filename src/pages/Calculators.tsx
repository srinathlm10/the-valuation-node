import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  FutureValueCalculator,
  SIPCalculator,
  CAGRCalculator,
  EMICalculator,
  PresentValueCalculator,
  CompoundInterestCalculator,
  RuleOf72Calculator,
  InflationAdjustedReturnCalculator
} from "@/components/calculators/FormulaCalculators";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Wallet, PiggyBank, Building, BarChart3 } from "lucide-react";

export default function Calculators() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(
    `You are helping users with financial calculations for the Indian market.
Page: Financial Calculators
Available: SIP, CAGR, EMI, Future Value, Present Value, Compound Interest, Rule of 72, Inflation-Adjusted Returns
Tax Considerations:
- LTCG (>1 year): 10% above ₹1 lakh for equity
- STCG (<1 year): 15% for equity
- Section 80C: ₹1.5L deduction (ELSS, PPF, EPF)
- Section 80D: Health insurance deductions
Focus: Help users understand formulas, plan investments, and optimize tax savings`
  );
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleExplainFormula = (formula: string, result: any) => {
    setChatContext(`Explaining ${formula} calculation`);
    setInitialMessage(
      `Explain the ${formula} formula calculation step by step. I used these inputs: ${JSON.stringify(result.inputs)} and got a result of ₹${Math.round(result.output).toLocaleString("en-IN")}. Break down the math and explain why this matters for wealth building in India.`
    );
    setChatOpen(true);
  };

  const upcomingCalculators = [
    { name: "Tax Savings (80C)", icon: Wallet, description: "Optimize tax-saving investments under Section 80C" },
    { name: "Retirement Corpus", icon: PiggyBank, description: "Plan your retirement savings with inflation adjustment" },
    { name: "Real Estate ROI", icon: Building, description: "Analyze property investment returns vs other assets" },
    { name: "Portfolio Risk (Sharpe)", icon: BarChart3, description: "Calculate risk-adjusted portfolio returns" },
  ];

  return (
    <Layout>
      <section className="border-b bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-slate">
              <Calculator className="h-5 w-5 text-hero-heading" />
            </div>
            <h1 className="text-3xl font-bold">Financial Calculators</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Interactive tools to plan your investments. Each calculator includes an "Explain the Math"
            button that uses FinBot to break down the formula step by step.
          </p>
        </div>
      </section>

      {/* Investment Planning */}
      <section className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-emerald" />
          <h2 className="text-xl font-semibold">Investment Planning</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SIPCalculator onExplain={handleExplainFormula} />
          <FutureValueCalculator onExplain={handleExplainFormula} />
          <PresentValueCalculator onExplain={handleExplainFormula} />
          <CAGRCalculator onExplain={handleExplainFormula} />
          <CompoundInterestCalculator onExplain={handleExplainFormula} />
          <RuleOf72Calculator onExplain={handleExplainFormula} />
        </div>
      </section>

      {/* Loans & Real Returns */}
      <section className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-amber" />
          <h2 className="text-xl font-semibold">Loans & Real Returns</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EMICalculator onExplain={handleExplainFormula} />
          <InflationAdjustedReturnCalculator onExplain={handleExplainFormula} />
        </div>
      </section>

      {/* Coming Soon */}
      <section className="container py-8">
        <h2 className="text-xl font-semibold mb-6 text-muted-foreground">Coming Soon</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {upcomingCalculators.map((calc) => (
            <Card key={calc.name} className="opacity-50">
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

      <ChatSidebar
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        initialMessage={initialMessage}
        context={chatContext}
      />
    </Layout>
  );
}
