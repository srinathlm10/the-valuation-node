import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ContentItem, ContentKind } from "@/lib/contentIndex";
import { tagLabel, tagPath } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<ContentKind, string> = {
  article: "Analysis",
  guide: "Concept Guide",
  course: "Course",
  track: "Track",
  formula: "Formula",
  term: "Glossary",
  calculator: "Calculator",
  lesson: "Lesson",
  news: "News & Trends",
  archive: "Archive",
};

function fmtDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Card list for any set of ContentItems (section landings, tag archives,
 * tracks, the Archive). One anchor per card on the headline, stretched over
 * the card with a pseudo-element so the whole card is clickable without three
 * separate links to the same page.
 */
export function ContentList({
  items,
  showTags = true,
  emptyText = "Nothing here yet.",
  className,
}: {
  items: ContentItem[];
  showTags?: boolean;
  emptyText?: string;
  className?: string;
}) {
  if (items.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{emptyText}</p>;
  }
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item.path} className="relative flex flex-col rounded-xl border bg-muted/20 p-5 transition-colors hover:bg-muted/40">
          <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{KIND_LABEL[item.kind]}</span>
          <h3 className="mt-2 font-semibold leading-snug">
            <Link
              to={item.path}
              className="after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.meta.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.meta.summary}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-muted-foreground">
            {item.meta.publishDate && <time dateTime={item.meta.publishDate}>{fmtDate(item.meta.publishDate)}</time>}
            {item.meta.readingTime && <span>{item.meta.readingTime} min read</span>}
            <span className="ml-auto inline-flex items-center gap-1 font-medium text-foreground">
              Read <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
          {showTags && item.meta.tags.length > 0 && (
            <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
              {item.meta.tags.slice(0, 3).map((t) => (
                <Link key={t} to={tagPath(t)} className="rounded border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground">
                  {tagLabel(t)}
                </Link>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
