import { useState, useEffect, useMemo } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Calculator, BookOpen, Sigma, GraduationCap, MousePointerClick, Newspaper, Archive } from "lucide-react";
import { publishedItems, type ContentItem, type ContentKind } from "@/lib/contentIndex";
import { tagLabel } from "@/lib/taxonomy";

// Search across every content page in the site index. Results are grouped by
// type with Vault entries (glossary, formulas, guides, tools) first, then
// analysis and news. Replaces the old four-item lists that navigated to paths
// that no longer existed (audit item 8.3).

const GROUPS: { kind: ContentKind[]; heading: string; icon: typeof FileText }[] = [
  { kind: ["term"], heading: "Glossary", icon: BookOpen },
  { kind: ["formula"], heading: "Formulas & Ratios", icon: Sigma },
  { kind: ["guide", "course", "track"], heading: "Concept Guides", icon: GraduationCap },
  { kind: ["calculator"], heading: "Calculators", icon: Calculator },
  { kind: ["lesson"], heading: "Interactive Lessons", icon: MousePointerClick },
  { kind: ["article"], heading: "Insights & Analysis", icon: FileText },
  { kind: ["news"], heading: "News & Trends", icon: Newspaper },
  { kind: ["archive"], heading: "Archive", icon: Archive },
];

const MAX_PER_GROUP = 6;

function score(item: ContentItem, q: string): number {
  const title = item.meta.title.toLowerCase();
  const summary = item.meta.summary.toLowerCase();
  const tags = item.meta.tags.map(tagLabel).join(" ").toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (tags.includes(q)) return 30;
  if (summary.includes(q)) return 20;
  return 0;
}

/**
 * SearchOverlay: the magnifier icon in the nav expands into a search dialog
 * (cmdk). `variant="bar"` renders the wide search field used on landing
 * pages and the 404 page. GlobalSearch is kept as an alias for old imports.
 */
export function SearchOverlay({ variant = "bar" }: { variant?: "icon" | "bar" } = {}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = publishedItems();
    const pick = (kinds: ContentKind[]) => {
      const pool = items.filter((i) => kinds.includes(i.kind));
      if (!q) return pool.slice(0, 4);
      return pool
        .map((i) => ({ i, s: score(i, q) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, MAX_PER_GROUP)
        .map((x) => x.i);
    };
    return GROUPS.map((g) => ({ ...g, items: pick(g.kind) })).filter((g) => g.items.length > 0);
  }, [query]);

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="search-btn h-10 w-10 rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          title="Search"
          aria-label="Search the site"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      ) : (
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm text-muted-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-64 lg:w-80"
        aria-label="Search the site"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search terms, formulas, guides, analysis...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md" shouldFilter={false}>
          <CommandInput placeholder="Search terms, formulas, guides, analysis..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {results.map((g) => {
              const Icon = g.icon;
              return (
                <CommandGroup key={g.heading} heading={g.heading}>
                  {g.items.map((item) => (
                    <CommandItem
                      key={item.path}
                      value={item.path}
                      onSelect={() => go(item.path)}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{item.meta.title}</span>
                        <span className="truncate text-xs text-muted-foreground">{item.meta.summary}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export const GlobalSearch = SearchOverlay;
