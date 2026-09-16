import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { latestItems, tagCounts, type ContentItem } from "@/lib/contentIndex";
import { getSection, getSubsection, tagLabel } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Sidebar, from the prototype's <aside class="sidebar">: three white boxed
 * sections with uppercase titles underlined in navy. In order: Latest Updates
 * (text-only items with a timestamp line), Trending Topics (tag cloud), and
 * Weekly Briefing (newsletter). Sticky on desktop; the parent grid places it
 * below the main column on mobile.
 */

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function itemLabel(item: ContentItem): string {
  if (item.meta.section === "vault") return "The Vault";
  const sub = item.meta.subsection ? getSubsection(item.meta.section, item.meta.subsection) : undefined;
  return sub?.label ?? getSection(item.meta.section).label;
}

export function SidebarSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("border border-border bg-card p-6", className)}>
      <h2 className="mb-4 border-b-2 border-primary pb-2 text-[1.1rem] font-semibold uppercase tracking-[1px]">{title}</h2>
      {children}
    </section>
  );
}

export function Sidebar({ latest, latestCount = 5, tagLimit = 12, className }: { latest?: ContentItem[]; latestCount?: number; tagLimit?: number; className?: string }) {
  const items = latest ?? latestItems(latestCount);
  const tags = tagCounts().slice(0, tagLimit);

  return (
    <aside className={cn("flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start", className)} aria-label="Sidebar">
      <SidebarSection title="Latest Updates">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.path} className="py-4 first:pt-0 last:pb-0">
              <span className="mb-1 block text-xs text-muted-foreground">
                {relativeTime(item.meta.publishDate ?? item.meta.updatedDate)} · {itemLabel(item)}
              </span>
              <Link to={item.path} className="block text-[0.95rem] font-semibold leading-snug text-foreground hover:text-primary hover:underline">
                {item.meta.title}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title="Trending Topics">
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag }) => (
            <Link
              key={tag}
              to={paths.tag(tag)}
              className="rounded border border-border bg-background px-3 py-1 text-[0.85rem] text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              #{tagLabel(tag).replace(/\s+/g, "")}
            </Link>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Weekly Briefing">
        <div id="newsletter">
          <NewsletterSignup variant="sidebar" source="sidebar" />
        </div>
      </SidebarSection>
    </aside>
  );
}
