import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ComplianceFeed } from "@/components/compliance/ComplianceFeed";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import circulars from "@/data/circulars.json";

export default function Compliance() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const sources = ["SEBI", "NSE", "BSE"];
  const categories = [...new Set(circulars.map((c) => c.category))];

  const filteredCirculars = circulars.filter((circular) => {
    const matchesSearch =
      circular.title.toLowerCase().includes(search.toLowerCase()) ||
      circular.summary.toLowerCase().includes(search.toLowerCase()) ||
      circular.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesSource = sourceFilter === "all" || circular.source === sourceFilter;
    const matchesCategory = categoryFilter === "all" || circular.category === categoryFilter;
    return matchesSearch && matchesSource && matchesCategory;
  });

  const handleBotSummary = (circular: any) => {
    setChatContext(`Explaining circular: ${circular.title}`);
    setInitialMessage(
      `Please explain this ${circular.source} circular in simple terms. Title: "${circular.title}". Summary: "${circular.summary}". What does this mean for retail investors?`
    );
    setChatOpen(true);
  };

  const handleViewDetails = (circular: any) => {
    // In a real app, this would navigate to a detail page
    setChatContext(`Reading circular: ${circular.title}`);
    setInitialMessage(`Tell me more about this circular: "${circular.title}". What are the key points I should know?`);
    setChatOpen(true);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Compliance & Regulatory Feed</h1>
          <p className="text-muted-foreground max-w-2xl">
            Stay updated with the latest circulars from SEBI, NSE, and BSE. 
            Use FinBot to get plain-English summaries of complex regulatory documents.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search circulars, topics, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCirculars.length} of {circulars.length} circulars
          </p>
          <div className="flex gap-2">
            {sourceFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {sourceFilter}
                <button onClick={() => setSourceFilter("all")} className="ml-1 hover:text-foreground">
                  ×
                </button>
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categoryFilter}
                <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:text-foreground">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        <ComplianceFeed
          circulars={filteredCirculars as any}
          onBotSummary={handleBotSummary}
          onViewDetails={handleViewDetails}
        />

        {filteredCirculars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No circulars found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setSourceFilter("all");
                setCategoryFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
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
