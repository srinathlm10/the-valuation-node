import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/** Extract h2 headings from a markdown string as TOC items (ids must match Prose's slugify). */
export function tocFromMarkdown(markdown: string, slugify: (s: string) => string): TocItem[] {
  const items: TocItem[] = [];
  for (const match of markdown.matchAll(/^##\s+(.+)$/gm)) {
    const label = match[1].replace(/[*_`]/g, "").trim();
    items.push({ id: slugify(label), label });
  }
  return items;
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

/**
 * Sticky "On this page" navigation for long articles and Foundations topics.
 * Highlights the section currently in view; smooth-scrolls on click unless the
 * reader prefers reduced motion.
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="On this page" className={className}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </p>
      <ul className="space-y-0.5 border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "block border-l-2 -ml-px pl-3 py-1 text-sm leading-snug transition-colors",
                active === item.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
