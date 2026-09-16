import { Link } from "react-router-dom";
import type { ContentItem, ContentKind } from "@/lib/contentIndex";
import { getSection, getSubsection } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

/**
 * ArticleCard, from the prototype's .news-card and .hero-card:
 * white card, 1px border, lift-on-hover; 16:9 image area (object-fit cover,
 * gradient placeholder when the item has no image); a section label pill
 * (.tag, or .tag.esg for ESG); a serif headline clamped to two lines; the
 * summary; reading time; and a "Read more" cue whose arrow nudges on hover.
 *
 * One anchor only, on the headline, stretched over the whole card with a
 * ::after pseudo-element. Tag links (if shown) sit above it with z-index.
 */

const KIND_FALLBACK: Record<ContentKind, string> = {
  article: "Analysis",
  guide: "Concept Guide",
  course: "Course",
  track: "Track",
  formula: "Formula",
  term: "Glossary",
  calculator: "Calculator",
  lesson: "Lesson",
  news: "News",
  archive: "Archive",
};

function sectionLabel(item: ContentItem): string {
  const sub = item.meta.subsection ? getSubsection(item.meta.section, item.meta.subsection) : undefined;
  if (sub && item.meta.section !== "vault") return sub.label;
  if (item.meta.section === "vault") return KIND_FALLBACK[item.kind];
  try {
    return getSection(item.meta.section).label;
  } catch {
    return KIND_FALLBACK[item.kind];
  }
}

function fmtDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function ArticleCard({
  item,
  variant = "grid",
  className,
  headingLevel = "h3",
}: {
  item: ContentItem;
  /** "hero" is the lead story (taller image, larger headline). */
  variant?: "grid" | "hero";
  className?: string;
  /** Heading element so the page outline stays in order. */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const isEsg = item.meta.section === "esg" || item.meta.tags.includes("esg");
  const label = sectionLabel(item);
  const hero = variant === "hero";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden border border-border bg-card text-card-foreground transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] motion-reduce:transform-none",
        className
      )}
    >
      {/* Image: fixed 16:9 box so nothing shifts when the image loads */}
      <div className={cn("relative w-full overflow-hidden bg-muted", hero ? "aspect-[16/9]" : "aspect-[16/9]")}>
        {item.meta.featuredImage ? (
          <img
            src={item.meta.featuredImage}
            alt={item.meta.imageAlt ?? ""}
            width={1200}
            height={675}
            loading={hero ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--muted))_25%,hsl(var(--border))_100%)] dark:bg-[linear-gradient(135deg,hsl(var(--card))_25%,hsl(var(--muted))_100%)]"
          >
            <img src="/logo.png" alt="" width={96} height={96} className="absolute right-4 top-4 h-10 w-10 opacity-40" aria-hidden="true" loading="lazy" />
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", hero ? "p-6" : "p-5")}>
        <span
          className={cn(
            "mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
            isEsg ? "bg-tag-esg text-tag-esg-foreground" : "bg-tag text-tag-foreground"
          )}
        >
          {label}
        </span>
        <Heading className={cn("font-serif leading-tight", hero ? "text-2xl md:text-[2rem] md:leading-[1.2]" : "text-xl leading-[1.3] line-clamp-2")}>
          <Link
            to={item.path}
            className="text-foreground after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {item.meta.title}
          </Link>
        </Heading>
        <p className={cn("mt-3 flex-1 text-muted-foreground", hero ? "text-[1.05rem] leading-relaxed" : "text-sm leading-relaxed line-clamp-3")}>
          {item.meta.summary}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            {item.meta.publishDate && <time dateTime={item.meta.publishDate}>{fmtDate(item.meta.publishDate)}</time>}
            {item.meta.readingTime && <span>{item.meta.readingTime} min read</span>}
          </span>
          <span className="text-[0.85rem] font-semibold uppercase tracking-[0.5px] text-primary after:ml-1 after:inline-block after:transition-transform after:content-['→'] group-hover:after:translate-x-1">
            {hero ? "Read full analysis" : "Read more"}
          </span>
        </div>
      </div>
    </article>
  );
}
