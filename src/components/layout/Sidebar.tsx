import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { latestItems, tagCounts, type ContentItem } from "@/lib/contentIndex";
import { getSection, getSubsection, tagLabel } from "@/lib/taxonomy";
import { RECENT_UPDATES } from "@/data/recentUpdates";
import { paths } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Sidebar: the prototype's <aside class="sidebar"> with its three
 * .sidebar-section boxes, class for class (src/styles/prototype.css):
 *
 *   Latest Updates   .recent-list > .recent-item (.recent-time + .recent-link)
 *   Trending Topics  .tags-cloud > .tag-pill
 *   Weekly Briefing  .newsletter-text + form (.newsletter-input, .newsletter-btn)
 *
 * Latest Updates merges dated research articles with the explicit Vault
 * additions log (src/data/recentUpdates.ts), newest first.
 */

interface Recent {
  date: string;
  section: string;
  title: string;
  path: string;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function itemSection(item: ContentItem): string {
  if (item.meta.section === "vault") return "The Vault";
  const sub = item.meta.subsection ? getSubsection(item.meta.section, item.meta.subsection) : undefined;
  return sub?.label ?? getSection(item.meta.section).label;
}

function recentFeed(latest: ContentItem[] | undefined, count: number): Recent[] {
  const fromContent: Recent[] = (latest ?? latestItems(count))
    .filter((i) => i.meta.publishDate)
    .map((i) => ({ date: i.meta.publishDate!, section: itemSection(i), title: i.meta.title, path: i.path }));
  const fromLog: Recent[] = RECENT_UPDATES.map((u) => ({ date: u.date, section: u.section, title: `${u.label}: ${u.title}`, path: u.path }));
  const seen = new Set<string>();
  return [...fromContent, ...fromLog]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((r) => (seen.has(r.path) ? false : (seen.add(r.path), true)))
    .slice(0, count);
}

/** "#FinancialModeling" style label, as in the prototype tag cloud. */
function hashtag(tag: string): string {
  return "#" + tagLabel(tag).replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

export function Sidebar({
  latest,
  latestCount = 5,
  tagLimit = 8,
  className,
}: {
  latest?: ContentItem[];
  latestCount?: number;
  tagLimit?: number;
  className?: string;
}) {
  const recent = recentFeed(latest, latestCount);
  const tags = tagCounts().slice(0, tagLimit);

  return (
    <aside className={cn("sidebar", className)} aria-label="Sidebar">
      {/* Recently Added */}
      <section className="sidebar-section" aria-labelledby="sidebar-latest">
        <h3 id="sidebar-latest" className="sidebar-title">Latest Updates</h3>
        <ul className="recent-list">
          {recent.map((r) => (
            <li key={r.path} className="recent-item">
              <span className="recent-time">
                <time dateTime={r.date}>{relativeTime(r.date)}</time> • {r.section}
              </span>
              <Link to={r.path} className="recent-link">{r.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Trending Topics / Tags */}
      <section className="sidebar-section" aria-labelledby="sidebar-topics">
        <h3 id="sidebar-topics" className="sidebar-title">Trending Topics</h3>
        <div className="tags-cloud">
          {tags.map(({ tag }) => (
            <Link key={tag} to={paths.tag(tag)} className="tag-pill">
              {hashtag(tag)}
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Opt-in */}
      <section className="sidebar-section" aria-labelledby="sidebar-newsletter" id="newsletter">
        <h3 id="sidebar-newsletter" className="sidebar-title">Weekly Briefing</h3>
        <NewsletterSignup variant="sidebar" source="sidebar" />
      </section>
    </aside>
  );
}

