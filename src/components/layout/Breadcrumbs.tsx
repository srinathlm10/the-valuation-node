import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Breadcrumbs for every page except the home page. Takes the same Crumb[] the
 * BreadcrumbList JSON-LD uses (src/lib/seo.ts breadcrumbLd), so the visible
 * trail and the structured data never drift apart. The last crumb is the
 * current page (not a link, aria-current="page"); "Home" is prepended.
 */
export function Breadcrumbs({ items, className, wide = false }: { items: Crumb[]; className?: string; wide?: boolean }) {
  if (items.length === 0) return null;
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("border-b border-border bg-background", className)}>
      <ol className={cn("container flex flex-wrap items-center gap-1.5 py-3 text-sm text-muted-foreground", wide ? "max-w-none" : "max-w-5xl")}>
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.path + i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-border" aria-hidden="true" />}
              {last ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path} className="hover:text-foreground hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
