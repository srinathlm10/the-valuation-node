import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { DefinitionsGrid } from "@/components/learn/DefinitionsGrid";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Calculator, TrendingUp, Shield, BarChart3, Percent, LineChart, FileText } from "lucide-react";
import definitions from "@/data/definitions.json";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Investment Planning": TrendingUp,
  "Profitability Ratios": BarChart3,
  "Valuation Ratios": Percent,
  "Liquidity Ratios": Shield,
  "Solvency Ratios": Shield,
  "Efficiency Ratios": BarChart3,
  "Technical Analysis": LineChart,
  "Regulatory Compliance": FileText,
  "Risk & Portfolio": TrendingUp,
  "Taxation": Percent,
  "Fundamentals": BarChart3,
  "Mutual Funds": TrendingUp,
  "Indices": LineChart,
};

const CATEGORY_GROUPS = [
  { name: "Investment Planning", categories: ["Investment Planning"] },
  { name: "Fundamental Analysis", categories: ["Profitability Ratios", "Valuation Ratios", "Liquidity Ratios", "Solvency Ratios", "Efficiency Ratios"] },
  { name: "Technical Analysis", categories: ["Technical Analysis"] },
  { name: "Regulatory & Compliance", categories: ["Regulatory Compliance"] },
  { name: "Risk & Portfolio", categories: ["Risk & Portfolio"] },
  { name: "Taxation", categories: ["Taxation"] },
  { name: "Market Basics", categories: ["Fundamentals", "Mutual Funds", "Indices"] },
];

export default function Learn() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const categories = useMemo(() => [...new Set(definitions.map((d) => d.category))].sort(), []);

  const filteredDefinitions = useMemo(() => {
    return definitions.filter((def) => {
      const matchesSearch = def.term.toLowerCase().includes(search.toLowerCase()) || 
                           def.fullName.toLowerCase().includes(search.toLowerCase()) ||
                           def.definition.toLowerCase().includes(search.toLowerCase());
      
      if (activeGroup !== "all") {
        const group = CATEGORY_GROUPS.find(g => g.name === activeGroup);
        if (group && !group.categories.includes(def.category)) return false;
      }
      
      const matchesCategory = categoryFilter === "all" || def.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, activeGroup]);

  const groupedDefinitions = useMemo(() => {
    const grouped: Record<string, typeof definitions> = {};
    filteredDefinitions.forEach(def => {
      if (!grouped[def.category]) grouped[def.category] = [];
      grouped[def.category].push(def);
    });
    return grouped;
  }, [filteredDefinitions]);

  const handleExplain = (definition: any) => {
    setChatContext(`Explaining: ${definition.term}`);
    setInitialMessage(`Explain "${definition.term}" (${definition.fullName}) in simple terms. Include the formula: ${definition.formula}. Why does it matter for Indian investors?`);
    setChatOpen(true);
  };

  const handleViewDetails = (definition: any) => {
    setChatContext(`Learning: ${definition.term}`);
    setInitialMessage(`Tell me more about ${definition.term}. Give me a practical example with Indian market context and how to use it in analysis.`);
    setChatOpen(true);
  };

  const handleExplainFormula = (formula: string, result: any) => {
    setChatContext(`Explaining ${formula}`);
    setInitialMessage(`Explain the ${formula} calculation step by step. Inputs: ${JSON.stringify(result.inputs)}, Result: ₹${Math.round(result.output).toLocaleString("en-IN")}`);
    setChatOpen(true);
  };

  return (
    <Layout>
      <section className="border-b bg-muted/30">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Finance Lab</h1>
          <p className="text-muted-foreground max-w-2xl">
            Master financial concepts through interactive learning. Explore {definitions.length}+ definitions, formulas, and calculators with AI-powered explanations.
          </p>
        </div>
      </section>

      <div className="container py-8">
        <Tabs defaultValue="glossary" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-2">
            <TabsTrigger value="glossary" className="gap-2"><BookOpen className="h-4 w-4" />Financial Wiki ({definitions.length})</TabsTrigger>
            <TabsTrigger value="calculators" className="gap-2"><Calculator className="h-4 w-4" />Calculators</TabsTrigger>
          </TabsList>

          <TabsContent value="glossary" className="space-y-6">
            {/* Search and Category Groups */}
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search terms, formulas, definitions..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-10" 
                />
              </div>
              
              {/* Category Group Tabs */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeGroup === "all" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => { setActiveGroup("all"); setCategoryFilter("all"); }}
                >
                  All Topics
                </Button>
                {CATEGORY_GROUPS.map((group) => (
                  <Button 
                    key={group.name} 
                    variant={activeGroup === group.name ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => { setActiveGroup(group.name); setCategoryFilter("all"); }}
                  >
                    {group.name}
                  </Button>
                ))}
              </div>

              {/* Sub-category filters when group is selected */}
              {activeGroup !== "all" && (
                <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-muted">
                  <span className="text-sm text-muted-foreground self-center">Filter:</span>
                  <Button 
                    variant={categoryFilter === "all" ? "secondary" : "ghost"} 
                    size="sm" 
                    onClick={() => setCategoryFilter("all")}
                  >
                    All
                  </Button>
                  {CATEGORY_GROUPS.find(g => g.name === activeGroup)?.categories.map((cat) => (
                    <Button 
                      key={cat} 
                      variant={categoryFilter === cat ? "secondary" : "ghost"} 
                      size="sm" 
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {filteredDefinitions.length} of {definitions.length} terms
              {activeGroup !== "all" && ` in ${activeGroup}`}
            </p>

            {/* Grouped Display */}
            {Object.keys(groupedDefinitions).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedDefinitions)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([category, defs]) => {
                    const IconComponent = CATEGORY_ICONS[category] || BookOpen;
                    return (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-semibold">{category}</h2>
                          <Badge variant="secondary" className="text-xs">{defs.length}</Badge>
                        </div>
                        <DefinitionsGrid 
                          definitions={defs as any} 
                          onExplain={handleExplain} 
                          onViewDetails={handleViewDetails} 
                        />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No definitions found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calculators" className="space-y-8">
            {/* Investment & Personal Finance Calculators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald" />
                <h2 className="text-xl font-semibold">Investment & Personal Finance</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SIPCalculator onExplain={handleExplainFormula} />
                <FutureValueCalculator onExplain={handleExplainFormula} />
                <PresentValueCalculator onExplain={handleExplainFormula} />
                <CAGRCalculator onExplain={handleExplainFormula} />
                <EMICalculator onExplain={handleExplainFormula} />
                <CompoundInterestCalculator onExplain={handleExplainFormula} />
                <RuleOf72Calculator onExplain={handleExplainFormula} />
                <InflationAdjustedReturnCalculator onExplain={handleExplainFormula} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ChatSidebar isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} initialMessage={initialMessage} context={chatContext} />
    </Layout>
  );
}
