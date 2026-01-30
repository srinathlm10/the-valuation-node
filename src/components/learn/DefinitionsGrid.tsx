import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Definition {
  id: string;
  term: string;
  fullName: string;
  category: string;
  definition: string;
  formula?: string;
  whyItMatters: string;
  example: string;
  relatedTerms: string[];
}

interface DefinitionCardProps {
  definition: Definition;
  onExplain: (definition: Definition) => void;
  onViewDetails: (definition: Definition) => void;
}

export function DefinitionCard({ definition, onExplain, onViewDetails }: DefinitionCardProps) {
  const categoryColors: Record<string, string> = {
    Valuation: "bg-blue-100 text-blue-800",
    Profitability: "bg-emerald-100 text-emerald-800",
    Growth: "bg-purple-100 text-purple-800",
    Size: "bg-amber-100 text-amber-800",
    Leverage: "bg-rose-100 text-rose-800",
    Income: "bg-teal-100 text-teal-800",
    "Mutual Funds": "bg-indigo-100 text-indigo-800",
    "Investment Strategy": "bg-cyan-100 text-cyan-800",
    Risk: "bg-orange-100 text-orange-800",
    Performance: "bg-green-100 text-green-800",
    Technical: "bg-pink-100 text-pink-800",
    Basics: "bg-gray-100 text-gray-800",
    Index: "bg-violet-100 text-violet-800",
  };

  return (
    <Card className="card-interactive group h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge
            className={cn(
              "text-xs",
              categoryColors[definition.category] || "bg-gray-100 text-gray-800"
            )}
          >
            {definition.category}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
          {definition.term}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{definition.fullName}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {definition.definition}
        </p>
        {definition.formula && (
          <div className="bg-muted/50 rounded px-3 py-2 mb-3 font-mono text-xs">
            {definition.formula}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onExplain(definition);
            }}
          >
            <Bot className="h-3.5 w-3.5" />
            Why it matters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(definition);
            }}
          >
            Learn more
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface DefinitionsGridProps {
  definitions: Definition[];
  onExplain: (definition: Definition) => void;
  onViewDetails: (definition: Definition) => void;
}

export function DefinitionsGrid({ definitions, onExplain, onViewDetails }: DefinitionsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {definitions.map((definition) => (
        <DefinitionCard
          key={definition.id}
          definition={definition}
          onExplain={onExplain}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
