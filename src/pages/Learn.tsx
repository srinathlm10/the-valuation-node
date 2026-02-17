import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { DefinitionsGrid } from "@/components/learn/DefinitionsGrid";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, TrendingUp, BarChart3, LineChart, Loader2, ArrowRight } from "lucide-react";
import { contentService } from "@/services/contentService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Definition Interface
interface Definition {
  id: string;
  term: string;
  fullName: string;
  category: string;
  definition: string;
  formula: string;
  whyItMatters: string;
  example: string;
  relatedTerms: string[];
}

export default function Learn() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch definitions
  const { data: definitions = [], isLoading: loadingDefs } = useQuery({
    queryKey: ['definitions'],
    queryFn: contentService.getDefinitions,
    staleTime: 60 * 60 * 1000,
  });

  // Fetch articles
  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: contentService.getArticles,
    staleTime: 60 * 60 * 1000,
  });

  // Filter Definitions
  const filteredDefinitions = useMemo(() => {
    return definitions.filter((def) =>
      def.term.toLowerCase().includes(search.toLowerCase()) ||
      def.fullName.toLowerCase().includes(search.toLowerCase()) ||
      def.definition.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, definitions]);

  // Filter Articles
  const getArticlesByCategory = (category: string) => {
    // Note: This filtering logic might need adjustment depending on exact category strings in DB
    // Basic mapping for now:
    // "Basics of Stock Market" -> "basics" or similar if stored that way.
    // For now, let's filter loosely by title or category if the category string matches.
    // Actually, let's look at the Category type in articles.ts if possible, or just string match.
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase());

      const cat = article.category.toLowerCase();
      let matchesCategory = false;

      if (category === "basics") {
        matchesCategory = cat.includes("basics") || cat.includes("investing"); // fallback
      } else if (category === "fundamental") {
        matchesCategory = cat.includes("fundamental");
      } else if (category === "technical") {
        matchesCategory = cat.includes("technical");
      }

      return matchesSearch && matchesCategory;
    });
  };

  const handleExplain = (item: Definition) => {
    setInitialMessage(`Can you explain "${item.term}" in simple terms?`);
    setChatContext(`User is asking about the financial term: ${item.term}`);
    setChatOpen(true);
  };

  const ArticleCard = ({ article }: { article: any }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(`/learn/${article.id}`)}>
      {article.imageUrl && (
        <div className="h-40 w-full overflow-hidden rounded-t-lg">
          <img src={article.imageUrl} alt={article.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline">{article.category}</Badge>
          <span className="text-xs text-muted-foreground">{article.readingTime} min read</span>
        </div>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button variant="ghost" className="w-full justify-between group">
          Read Article
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <section className="border-b bg-muted/30">
        <div className="container py-8">
          <div className="mb-8 max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Financial Knowledge Hub
            </h1>
            <p className="text-xl text-muted-foreground">
              Deep dives into Stock Markets, Analysis, and Terminology.
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search concepts, terms, or articles..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container py-8">
        <Tabs defaultValue="wiki" className="space-y-8">
          <TabsList className="grid w-full h-auto grid-cols-1 md:grid-cols-4 gap-2 bg-transparent p-0">
            <TabsTrigger
              value="wiki"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card h-24 flex flex-col items-center justify-center gap-2 rounded-lg shadow-sm"
            >
              <BookOpen className="h-6 w-6" />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Financial Wiki</span>
                <span className="text-xs opacity-70 font-normal">Definitions & Formulas</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="basics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card h-24 flex flex-col items-center justify-center gap-2 rounded-lg shadow-sm"
            >
              <TrendingUp className="h-6 w-6" />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Basics of Stock Market</span>
                <span className="text-xs opacity-70 font-normal">Start Here</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="fundamental"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card h-24 flex flex-col items-center justify-center gap-2 rounded-lg shadow-sm"
            >
              <BarChart3 className="h-6 w-6" />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Fundamental Analysis</span>
                <span className="text-xs opacity-70 font-normal">Valuation & Metrics</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="technical"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card h-24 flex flex-col items-center justify-center gap-2 rounded-lg shadow-sm"
            >
              <LineChart className="h-6 w-6" />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Technical Analysis</span>
                <span className="text-xs opacity-70 font-normal">Charts & Patterns</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wiki" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Financial Terms & Glossary</h2>
              <Badge variant="secondary">{filteredDefinitions.length} Terms</Badge>
            </div>
            {loadingDefs ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <DefinitionsGrid definitions={filteredDefinitions} onExplain={handleExplain} />
            )}
          </TabsContent>

          <TabsContent value="basics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Stock Market Basics</h2>
            </div>
            {loadingArticles ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getArticlesByCategory("basics").length > 0 ? (
                  getArticlesByCategory("basics").map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                    No articles found for Basics.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fundamental" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Fundamental Analysis</h2>
            </div>
            {loadingArticles ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getArticlesByCategory("fundamental").length > 0 ? (
                  getArticlesByCategory("fundamental").map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                    No articles found for Fundamental Analysis.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Technical Analysis</h2>
            </div>
            {loadingArticles ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getArticlesByCategory("technical").length > 0 ? (
                  getArticlesByCategory("technical").map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                    No articles found for Technical Analysis.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>

      <ChatSidebar isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} initialMessage={initialMessage} context={chatContext} />
    </Layout>
  );
}
