import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Circular {
  id: string;
  title: string;
  source: "SEBI" | "NSE" | "BSE";
  category: string;
  date: string;
  summary: string;
  botSummary: string;
  tags: string[];
}

interface CircularCardProps {
  circular: Circular;
  onBotSummary: (circular: Circular) => void;
  onViewDetails: (circular: Circular) => void;
}

export function CircularCard({ circular, onBotSummary, onViewDetails }: CircularCardProps) {
  const sourceColors = {
    SEBI: "badge-sebi",
    NSE: "badge-nse",
    BSE: "badge-bse",
  };

  return (
    <Card className="card-interactive group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("badge-source", sourceColors[circular.source])}>
              {circular.source}
            </span>
            <Badge variant="outline" className="text-xs">
              {circular.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(circular.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <CardTitle className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {circular.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm line-clamp-2 mb-4">
          {circular.summary}
        </CardDescription>
        <div className="flex flex-wrap gap-1 mb-4">
          {circular.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onBotSummary(circular);
            }}
          >
            <Bot className="h-3.5 w-3.5" />
            Bot Summary
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(circular);
            }}
          >
            Read Full
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ComplianceFeedProps {
  circulars: Circular[];
  onBotSummary: (circular: Circular) => void;
  onViewDetails: (circular: Circular) => void;
}

export function ComplianceFeed({ circulars, onBotSummary, onViewDetails }: ComplianceFeedProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {circulars.map((circular) => (
        <CircularCard
          key={circular.id}
          circular={circular}
          onBotSummary={onBotSummary}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
