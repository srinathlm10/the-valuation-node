import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { DefinitionsGrid } from "@/components/learn/DefinitionsGrid";
import { FutureValueCalculator, SIPCalculator } from "@/components/calculators/FormulaCalculators";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Calculator } from "lucide-react";
import definitions from "@/data/definitions.json";

export default function Learn() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(() => [...new Set(definitions.map((d) => d.category))].sort(), []);

  const filteredDefinitions = useMemo(() => {
    return definitions.filter((def) => {
      const matchesSearch = def.term.toLowerCase().includes(search.toLowerCase()) || def.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || def.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  const handleExplain = (definition: any) => {
    setChatContext(`Explaining: ${definition.term}`);
    setInitialMessage(`Explain "${definition.term}" in simple terms. Why does it matter for Indian investors?`);
    setChatOpen(true);
  };

  const handleViewDetails = (definition: any) => {
    setChatContext(`Learning: ${definition.term}`);
    setInitialMessage(`Tell me more about ${definition.term} and how to use it in stock analysis.`);
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
          <p className="text-muted-foreground max-w-2xl">Master financial concepts through interactive learning with AI-powered explanations.</p>
        </div>
      </section>

      <div className="container py-8">
        <Tabs defaultValue="glossary" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="glossary" className="gap-2"><BookOpen className="h-4 w-4" />Financial Wiki</TabsTrigger>
            <TabsTrigger value="calculators" className="gap-2"><Calculator className="h-4 w-4" />Calculators</TabsTrigger>
          </TabsList>

          <TabsContent value="glossary" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search terms..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant={categoryFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter("all")}>All</Button>
                {categories.slice(0, 5).map((cat) => (
                  <Button key={cat} variant={categoryFilter === cat ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(cat)}>{cat}</Button>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filteredDefinitions.length} of {definitions.length} terms</p>
            <DefinitionsGrid definitions={filteredDefinitions as any} onExplain={handleExplain} onViewDetails={handleViewDetails} />
          </TabsContent>

          <TabsContent value="calculators" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SIPCalculator onExplain={handleExplainFormula} />
              <FutureValueCalculator onExplain={handleExplainFormula} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ChatSidebar isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} initialMessage={initialMessage} context={chatContext} />
    </Layout>
  );
}
