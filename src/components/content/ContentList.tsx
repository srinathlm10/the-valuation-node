import type { ContentItem } from "@/lib/contentIndex";
import { ArticleCard } from "@/components/content/ArticleCard";
import { cn } from "@/lib/utils";

/**
 * The prototype's .news-grid: two columns of ArticleCards (one column below
 * 900px), 1.5rem gap. Used by section landings, tag archives, tracks, and
 * the Archive. `showTags` is accepted for API compatibility; the card itself
 * shows the section label rather than a tag row.
 */
export function ContentList({
  items,
  emptyText = "Nothing here yet.",
  className,
  headingLevel = "h3",
}: {
  items: ContentItem[];
  showTags?: boolean;
  emptyText?: string;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  if (items.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{emptyText}</p>;
  }
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {items.map((item) => (
        <ArticleCard key={item.path} item={item} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
