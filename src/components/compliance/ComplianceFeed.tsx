import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Circular {
  id: string;
  title: string;
  source: "SEBI" | "NSE" | "BSE";
  category: string;
  date: string;
  summary: string;
  botSummary?: string;
  tags: string[];
}

const sourceColors: Record<Circular["source"], string> = {
  SEBI: "badge-sebi",
  NSE: "badge-nse",
  BSE: "badge-bse",
};

export function CircularCard({ circular }: { circular: Circular }) {
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
        <CardTitle className="text-base font-semibold leading-tight text-foreground">
          {circular.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-4">{circular.summary}</CardDescription>
        <div className="flex flex-wrap gap-1">
          {circular.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ComplianceFeed({ circulars = [] }: { circulars?: Circular[] }) {
  if (circulars.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        No circulars to show yet. For the latest updates, see the SEBI and exchange
        websites directly.
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {circulars.map((circular) => (
        <CircularCard key={circular.id} circular={circular} />
      ))}
    </div>
  );
}
