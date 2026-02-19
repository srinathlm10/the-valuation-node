import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, TrendingDown, BarChart3, Shield, AlertTriangle,
  Building2, FileText, Calculator, Bot, ChevronRight,
  Layers, Users, DollarSign, PieChart, Activity, Target,
  ArrowUpDown, Banknote, Factory, Laptop, Scale
} from "lucide-react";

const ANALYSIS_APPROACHES = [
  {
    id: "top-down",
    title: "Top-Down Approach",
    icon: Layers,
    description: "A systematic funnel from macro to micro",
    steps: [
      { label: "Economy", detail: "GDP growth, inflation, interest rates, fiscal policy" },
      { label: "Sector", detail: "GICS sectors, industry tailwinds, regulatory environment" },
      { label: "Company", detail: "Individual stock selection within strong sectors" },
    ],
    bestFor: "Macro-aware investors, thematic investing, sector rotation strategies"
  },
  {
    id: "bottom-up",
    title: "Bottom-Up Approach",
    icon: Target,
    description: "Focus on exceptional individual businesses",
    steps: [
      { label: "Company First", detail: "Analyze business fundamentals regardless of market conditions" },
      { label: "Competitive Moat", detail: "Identify durable advantages that protect profits" },
      { label: "Valuation", detail: "Determine if the stock price reflects intrinsic value" },
    ],
    bestFor: "Value investors, long-term holders, stock pickers like Warren Buffett"
  }
];

const QUALITATIVE_FACTORS = [
  {
    title: "Business Model",
    icon: Building2,
    question: "How does the company make money?",
    details: "Analyze revenue streams: product sales, services, subscriptions, licensing, royalties. Understand the unit economics and scalability."
  },
  {
    title: "Competitive Advantage (Moat)",
    icon: Shield,
    question: "Can the company protect its profits?",
    details: "Look for: Brand power (Coca-Cola), Network effects (Meta), Cost leadership (Walmart), Switching costs (SAP), Intangible assets (patents, licenses)."
  },
  {
    title: "Management Quality",
    icon: Users,
    question: "Is leadership trustworthy and capable?",
    details: "Check: Track record of capital allocation, insider buying/selling patterns, compensation alignment with shareholders, founder-led vs. professional management."
  },
  {
    title: "Corporate Governance",
    icon: Scale,
    question: "Are shareholder interests protected?",
    details: "Evaluate: Board independence, audit committee quality, related-party transaction policies, voting rights structure, minority shareholder treatment."
  },
  {
    title: "ESG Factors",
    icon: Activity,
    question: "Is the business sustainable long-term?",
    details: "Consider: Environmental impact (carbon footprint), Social responsibility (labor practices, community impact), Governance standards (ethics, transparency)."
  }
];

const FINANCIAL_STATEMENTS = [
  {
    id: "income",
    title: "Income Statement (P&L)",
    question: "Did the company make money?",
    icon: TrendingUp,
    color: "text-emerald-600",
    items: [
      { term: "Revenue (Top Line)", formula: "Total sales generated from business operations" },
      { term: "Gross Profit", formula: "Revenue − Cost of Goods Sold" },
      { term: "EBITDA", formula: "Earnings Before Interest, Taxes, Depreciation & Amortization" },
      { term: "Operating Income (EBIT)", formula: "Gross Profit − Operating Expenses" },
      { term: "Net Income (Bottom Line)", formula: "Final profit after all expenses and taxes" },
    ]
  },
  {
    id: "balance",
    title: "Balance Sheet",
    question: "What does the company own vs. owe?",
    icon: BarChart3,
    color: "text-blue-600",
    items: [
      { term: "Current Assets", formula: "Cash, receivables, inventory (liquid within 1 year)" },
      { term: "Non-Current Assets", formula: "Property, plant, equipment, intangibles" },
      { term: "Current Liabilities", formula: "Debts and obligations due within 1 year" },
      { term: "Long-Term Debt", formula: "Obligations due beyond 1 year" },
      { term: "Shareholders' Equity", formula: "Total Assets − Total Liabilities = Net Worth" },
    ]
  },
  {
    id: "cashflow",
    title: "Cash Flow Statement",
    question: "Where is the actual cash going?",
    icon: DollarSign,
    color: "text-amber-600",
    items: [
      { term: "Operating Cash Flow (OCF)", formula: "Cash generated from core business operations" },
      { term: "Investing Cash Flow", formula: "Cash spent/received from investments, acquisitions, CapEx" },
      { term: "Financing Cash Flow", formula: "Cash from debt, equity issuance, dividends" },
      { term: "Free Cash Flow (FCF)", formula: "Operating Cash Flow − Capital Expenditures" },
    ]
  }
];

const RATIO_CATEGORIES = [
  {
    id: "profitability",
    title: "Profitability & Efficiency",
    icon: TrendingUp,
    description: "How well does the company generate profits?",
    ratios: [
      { name: "Return on Equity (ROE)", formula: "Net Income / Shareholders' Equity", benchmark: ">15% is excellent", interpretation: "Higher ROE = Better use of shareholder capital" },
      { name: "Return on Assets (ROA)", formula: "Net Income / Total Assets", benchmark: ">5% is good", interpretation: "Shows how efficiently assets generate profit" },
      { name: "Return on Capital Employed (ROCE)", formula: "EBIT / (Total Assets − Current Liabilities)", benchmark: ">20% is strong", interpretation: "Key metric for capital-intensive industries" },
      { name: "Net Profit Margin", formula: "Net Income / Total Revenue", benchmark: "Varies by sector", interpretation: "Higher margin = More profit per rupee of sales" },
      { name: "Asset Turnover", formula: "Revenue / Average Total Assets", benchmark: ">1.0 for most sectors", interpretation: "Efficiency of asset utilization" },
    ]
  },
  {
    id: "liquidity",
    title: "Liquidity & Solvency",
    icon: Shield,
    description: "Can the company pay its bills and survive downturns?",
    ratios: [
      { name: "Current Ratio", formula: "Current Assets / Current Liabilities", benchmark: "1.5–2.0 is healthy", interpretation: "Ability to pay short-term obligations" },
      { name: "Quick Ratio (Acid Test)", formula: "(Current Assets − Inventory) / Current Liabilities", benchmark: ">1.0 is good", interpretation: "Stricter liquidity test excluding inventory" },
      { name: "Debt-to-Equity (D/E)", formula: "Total Liabilities / Shareholders' Equity", benchmark: "<1.0 preferred", interpretation: "Lower = Less financial risk" },
      { name: "Interest Coverage Ratio", formula: "EBIT / Interest Expense", benchmark: ">3.0 is safe", interpretation: "Ability to service debt from earnings" },
    ]
  },
  {
    id: "valuation",
    title: "Valuation Ratios",
    icon: Calculator,
    description: "Is the stock cheap or expensive?",
    ratios: [
      { name: "Price-to-Earnings (P/E)", formula: "Market Price / Earnings Per Share", benchmark: "Compare to sector average", interpretation: "Lower P/E may indicate undervaluation" },
      { name: "Price-to-Book (P/B)", formula: "Market Price / Book Value Per Share", benchmark: "<1.0 could be undervalued", interpretation: "Compares market value to accounting value" },
      { name: "PEG Ratio", formula: "P/E Ratio / EPS Growth Rate", benchmark: "<1.0 = potentially undervalued", interpretation: "Adjusts P/E for growth expectations" },
      { name: "EV/EBITDA", formula: "Enterprise Value / EBITDA", benchmark: "Compare to peers", interpretation: "Valuation independent of capital structure" },
      { name: "Dividend Yield", formula: "Annual Dividend / Market Price", benchmark: "2–4% is typical", interpretation: "Income return from holding the stock" },
    ]
  }
];

const SECTOR_CHECKS = [
  {
    sector: "Banking & Finance",
    icon: Banknote,
    metrics: [
      { name: "Net Interest Margin (NIM)", description: "Interest earned minus interest paid as % of assets" },
      { name: "Gross NPA / Net NPA", description: "Bad loans as percentage of total advances" },
      { name: "CASA Ratio", description: "Low-cost current & savings deposits vs total deposits" },
      { name: "Capital Adequacy Ratio (CAR)", description: "Buffer against potential losses (RBI mandated)" },
    ]
  },
  {
    sector: "FMCG & Consumer",
    icon: Factory,
    metrics: [
      { name: "Volume Growth", description: "Actual units sold (more important than value growth from price hikes)" },
      { name: "Distribution Reach", description: "Number of retail outlets, rural penetration" },
      { name: "Working Capital Efficiency", description: "Cash conversion cycle, inventory days" },
      { name: "Brand Recall & Pricing Power", description: "Ability to pass on cost increases" },
    ]
  },
  {
    sector: "IT Services",
    icon: Laptop,
    metrics: [
      { name: "Attrition Rate", description: "Employee turnover percentage (lower is better)" },
      { name: "Utilization Rate", description: "Billable hours as % of total employee hours" },
      { name: "Order Book / Deal Pipeline", description: "Visibility of future revenue" },
      { name: "Revenue per Employee", description: "Productivity and efficiency metric" },
    ]
  }
];

const RED_FLAGS = [
  {
    flag: "Aggressive Revenue Recognition",
    description: "Recognizing revenue before it is truly earned to inflate short-term profits",
    checkFor: "Unbilled revenue growing faster than billed revenue, unusual Q4 spikes"
  },
  {
    flag: "Negative Cash Flow vs. High Profit",
    description: "If a company reports high profits but has consistently negative operating cash flow, profits may be 'fake' or uncollected",
    checkFor: "OCF/Net Income ratio < 0.8 consistently"
  },
  {
    flag: "Related Party Transactions",
    description: "Large deals with promoters' other companies that may not be at arm's length",
    checkFor: "Check annual report footnotes, disproportionate loans to group entities"
  },
  {
    flag: "Inventory Shrinkage",
    description: "Significant gaps between recorded and physical inventory can signal theft or mismanagement",
    checkFor: "Inventory growing faster than sales, auditor qualifications"
  },
  {
    flag: "Frequent Accounting Policy Changes",
    description: "Changes in depreciation or revenue recognition methods used to 'smooth' earnings",
    checkFor: "Note 1 of financial statements, compare policies year-over-year"
  },
  {
    flag: "Promoter Pledging",
    description: "Shares pledged as collateral for loans—risk of forced selling",
    checkFor: "Shareholding pattern disclosure, pledge percentage trends"
  }
];

const VALUATION_MODELS = [
  {
    model: "Discounted Cash Flow (DCF)",
    description: "Project future free cash flows and discount them back to present value",
    formula: "PV = Σ FCFt / (1 + WACC)^t + Terminal Value",
    bestFor: "Companies with predictable cash flows, mature businesses",
    limitations: "Highly sensitive to growth rate and discount rate assumptions"
  },
  {
    model: "Dividend Discount Model (DDM)",
    description: "Value based on expected future dividends",
    formula: "Value = D₁ / (r − g) (Gordon Growth Model)",
    bestFor: "Stable dividend-paying companies (utilities, mature banks)",
    limitations: "Not applicable to non-dividend or high-growth stocks"
  },
  {
    model: "Relative Valuation (Multiples)",
    description: "Compare ratios to industry peers",
    formula: "Fair Price = Peer Average P/E × Company EPS",
    bestFor: "Quick comparisons, sector analysis",
    limitations: "Assumes peers are fairly valued"
  }
];

// ... (imports remain the same, I will assume they are available or I need to check if I can just replace the component definition)

// I will replace the component definition to split it.

export function FundamentalAnalysisContent({ onAskAI }: { onAskAI: (context: string, message: string) => void }) {
  const handleAskAI = (topic: string, question: string) => {
    const context = `Fundamental Analysis: ${topic}`;
    onAskAI(context, question);
  };

  return (
    <div className="space-y-12">
      {/* Analysis Approaches */}
      <section>
        <h2 className="text-2xl font-bold mb-2">1. Analysis Approaches</h2>
        <p className="text-muted-foreground mb-6">The order in which you conduct research defines your investment strategy.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {ANALYSIS_APPROACHES.map((approach) => {
            const IconComponent = approach.icon;
            return (
              <Card key={approach.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{approach.title}</CardTitle>
                      <CardDescription>{approach.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {approach.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-medium">{step.label}:</span>
                          <span className="text-muted-foreground text-sm ml-1">{step.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Best for: </span>
                    <span className="text-xs">{approach.bestFor}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Qualitative Analysis */}
      <section>
        <h2 className="text-2xl font-bold mb-2">2. Qualitative Analysis</h2>
        <p className="text-muted-foreground mb-6">Before diving into numbers, assess the quality of the business itself.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUALITATIVE_FACTORS.map((factor) => {
            const IconComponent = factor.icon;
            return (
              <Card key={factor.title} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{factor.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm font-medium text-foreground/80">
                    {factor.question}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{factor.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Financial Statements */}
      <section>
        <h2 className="text-2xl font-bold mb-2">3. Financial Statement Deep Dive</h2>
        <p className="text-muted-foreground mb-6">Methodical review of the "Big Three" reports.</p>

        <Tabs defaultValue="income" className="space-y-4">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            {FINANCIAL_STATEMENTS.map((stmt) => (
              <TabsTrigger key={stmt.id} value={stmt.id} className="text-xs sm:text-sm">
                {stmt.title.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {FINANCIAL_STATEMENTS.map((stmt) => {
            const IconComponent = stmt.icon;
            return (
              <TabsContent key={stmt.id} value={stmt.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${stmt.color}`} />
                      <div>
                        <CardTitle>{stmt.title}</CardTitle>
                        <CardDescription className="text-base">{stmt.question}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stmt.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b last:border-0">
                          <span className="font-medium min-w-[180px]">{item.term}</span>
                          <span className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                            {item.formula}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 gap-2"
                      onClick={() => handleAskAI(stmt.title, `Explain the ${stmt.title} in simple terms. What should I look for when analyzing a company's ${stmt.title.toLowerCase()}? Give examples from Indian companies.`)}
                    >
                      <Bot className="h-4 w-4" />
                      Explain with Examples
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      {/* Ratio Checklist */}
      <section>
        <h2 className="text-2xl font-bold mb-2">4. Quantitative Metric Checklist</h2>
        <p className="text-muted-foreground mb-6">Ratios allow for "apples-to-apples" comparisons between companies of different sizes.</p>

        <Accordion type="multiple" className="space-y-4">
          {RATIO_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{category.title}</div>
                      <div className="text-sm text-muted-foreground font-normal">{category.description}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {category.ratios.map((ratio, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{ratio.name}</span>
                          <Badge variant="outline" className="text-xs">{ratio.benchmark}</Badge>
                        </div>
                        <div className="font-mono text-sm bg-background px-3 py-1.5 rounded border">
                          {ratio.formula}
                        </div>
                        <p className="text-sm text-muted-foreground">{ratio.interpretation}</p>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleAskAI(category.title, `Explain ${category.title} ratios in fundamental analysis. Which ratios are most important for Indian investors and why? Give practical examples.`)}
                    >
                      <Bot className="h-4 w-4" />
                      Ask AI about {category.title}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Sector-Specific Checks */}
      <section>
        <h2 className="text-2xl font-bold mb-2">5. Sector-Specific Checks</h2>
        <p className="text-muted-foreground mb-6">A "good" ratio depends entirely on the industry. Here are specialized metrics by sector.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {SECTOR_CHECKS.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <Card key={sector.sector}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{sector.sector}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sector.metrics.map((metric, idx) => (
                    <div key={idx} className="border-l-2 border-primary/30 pl-3">
                      <div className="font-medium text-sm">{metric.name}</div>
                      <div className="text-xs text-muted-foreground">{metric.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Red Flags */}
      <section>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          6. Forensic Checklist: Red Flags
        </h2>
        <p className="text-muted-foreground mb-6">Always check the footnotes of financial disclosures for "earnings quality".</p>

        <div className="grid md:grid-cols-2 gap-4">
          {RED_FLAGS.map((item, idx) => (
            <Card key={idx} className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {item.flag}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 px-3 py-2 rounded">
                  <strong>Check for:</strong> {item.checkFor}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Valuation Models */}
      <section>
        <h2 className="text-2xl font-bold mb-2">7. Valuation Modeling</h2>
        <p className="text-muted-foreground mb-6">The final step: calculating a specific number for intrinsic value.</p>

        <div className="space-y-4">
          {VALUATION_MODELS.map((model, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{model.model}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAskAI(model.model, `Explain the ${model.model} valuation method step by step. Show me a practical example for an Indian company. What are the key assumptions I need to make?`)}
                  >
                    <Bot className="h-4 w-4" />
                    Learn
                  </Button>
                </div>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="font-mono text-sm bg-muted px-4 py-2 rounded-lg">
                  {model.formula}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Best for: </span>
                    <span>{model.bestFor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Limitations: </span>
                    <span>{model.limitations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold mb-2">Ready to Apply These Concepts?</h3>
        <p className="text-muted-foreground mb-4">Explore our Stock Archive to analyze Nifty 50 companies with these fundamentals.</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <a href="/stocks">
              <BarChart3 className="h-4 w-4 mr-2" />
              Explore Stocks
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function FundamentalAnalysis() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(
    `You are helping users learn fundamental analysis for Indian stocks.
Page: Fundamental Analysis Guide
Topics: Financial statements (P&L, Balance Sheet, Cash Flow), Ratio analysis, Valuation models
Key Concepts:
- Qualitative: Business model, competitive moat, management quality, governance
- Quantitative: ROE, ROA, ROCE, P/E, P/B, Debt-to-Equity, Current Ratio
- Valuation: DCF, DDM, Relative valuation (multiples)
- Red Flags: Aggressive revenue recognition, negative cash flow, related party transactions
Focus: Explain concepts in simple terms, use Indian company examples (TCS, Reliance, HDFC Bank, etc.)`
  );
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleAskAI = (context: string, question: string) => {
    setChatContext(context);
    setInitialMessage(question);
    setChatOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container py-10">
          <Badge variant="secondary" className="mb-4">
            <BarChart3 className="h-3 w-3 mr-1" />
            Investment Research Guide
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Fundamental Analysis</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A methodical process to determine the <strong>intrinsic value</strong> of a security by examining
            economic, financial, and qualitative factors. The goal: identify if a stock is
            <span className="text-emerald-600 font-medium"> undervalued (buy)</span> or
            <span className="text-rose-600 font-medium"> overvalued (sell)</span>.
          </p>
        </div>
      </section>

      <div className="container py-8">
        <FundamentalAnalysisContent onAskAI={handleAskAI} />
      </div>

      <ChatSidebar
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        initialMessage={initialMessage}
        context={chatContext}
      />
    </Layout>
  );
}
