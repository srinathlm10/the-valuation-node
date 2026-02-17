import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  // Props kept for compatibility but unused in this version
  onExplain?: (definition: Definition) => void;
  onViewDetails?: (definition: Definition) => void;
}

export function DefinitionCard({ definition }: DefinitionCardProps) {
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
    <Dialog>
      <Card className="card-interactive group h-full flex flex-col hover:shadow-lg transition-all duration-300">
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
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
            {definition.term}
          </CardTitle>
          <p className="text-xs text-muted-foreground line-clamp-1">{definition.fullName}</p>
        </CardHeader>
        <CardContent className="pt-0 flex-grow flex flex-col">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
            {definition.definition}
          </p>

          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between mt-auto group/btn hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Learn more
              <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn(categoryColors[definition.category])}>
              {definition.category}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-primary">{definition.term}</DialogTitle>
          <p className="text-muted-foreground text-sm">{definition.fullName}</p>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <div>
            <h3 className="text-base font-semibold mb-2">Definition</h3>
            <p className="text-muted-foreground leading-relaxed">{definition.definition}</p>
          </div>

          {definition.formula && (
            <div className="bg-muted/50 border border-border/50 p-4 rounded-lg font-mono text-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Formula</p>
              <div className="p-2 bg-background rounded border border-border/50 text-center">
                {definition.formula}
              </div>
            </div>
          )}

          {definition.whyItMatters && (
            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center gap-2 text-foreground/90">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Why it matters
              </h3>
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-lg">
                <p className="text-muted-foreground text-sm leading-relaxed">{definition.whyItMatters}</p>
              </div>
            </div>
          )}

          {definition.example && (
            <div>
              <h3 className="text-base font-semibold mb-2">Real World Example</h3>
              <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground italic">"{definition.example}"</p>
              </div>
            </div>
          )}

          {definition.relatedTerms && definition.relatedTerms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {definition.relatedTerms.map((term, i) => (
                  <Badge key={i} variant="secondary" className="hover:bg-secondary/80">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DefinitionsGridProps {
  definitions: Definition[];
  onExplain?: (definition: Definition) => void;
  onViewDetails?: (definition: Definition) => void;
}

export function DefinitionsGrid({ definitions, onExplain, onViewDetails }: DefinitionsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
