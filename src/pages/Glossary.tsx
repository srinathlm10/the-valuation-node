import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { GLOSSARY } from "@/lib/glossary";
import { Search, SearchX } from "lucide-react";
import { EmptyState } from "@/components/content/EmptyState";
import { GLOSSARY_CATEGORY_ICONS, GLOSSARY_FALLBACK_ICON } from "@/lib/siteIcons";

function CategoryIcon({ category }: { category?: string }) {
  const Icon = (category && GLOSSARY_CATEGORY_ICONS[category]) || GLOSSARY_FALLBACK_ICON;
  return <Icon className="mt-1 h-4 w-4 shrink-0 text-primary/60" aria-hidden="true" />;
}
import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function toSlug(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Glossary() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [jumpLetter, setJumpLetter] = useState("");

  const definitions = GLOSSARY;
  const isLoading = false;

  const filtered = useMemo(() => {
    let items = definitions as any[];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (d: any) =>
          d.term?.toLowerCase().includes(q) ||
          d.fullName?.toLowerCase().includes(q) ||
          d.definition?.toLowerCase().includes(q)
      );
    }
    if (jumpLetter && !search) {
      items = items.filter((d: any) =>
        (d.term || "").toUpperCase().startsWith(jumpLetter)
      );
    }
    return [...items].sort((a: any, b: any) => a.term?.localeCompare(b.term));
  }, [definitions, search, jumpLetter]);

  return (
    <Layout>
      <Helmet>
        <title>Glossary - The Valuation Node</title>
        <meta
          name="description"
          content="170+ finance definitions, each with a formula, a real Indian example, and links to Foundations pages."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/glossary" />
      </Helmet>

      <div className="container max-w-4xl py-14">
        <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Learn
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Glossary</h1>
        <p className="mt-3 text-muted-foreground">
          Finance terms, defined. Each entry includes a formula where applicable and a real Indian
          example.
        </p>

        {/* Search */}
        <div className="mt-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setJumpLetter(""); }}
            className="pl-9"
          />
        </div>

        {/* A-Z jump links */}
        {!search && (
          <div className="mt-4 flex flex-wrap gap-1">
            <button
              className={cn(
                "px-2 py-1 rounded text-xs font-medium transition-colors",
                !jumpLetter ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setJumpLetter("")}
            >
              All
            </button>
            {ALPHABET.map((l) => (
              <button
                key={l}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-colors",
                  jumpLetter === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setJumpLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="mt-8 divide-y">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No matching terms"
              description="Try a different spelling, or browse by letter."
            />
          ) : (
            filtered.map((def: any) => (
              <div key={def.id} className="py-4">
                <Link
                  to={`/learn/glossary/${toSlug(def.term)}`}
                  className="group flex items-start gap-2.5 font-medium"
                >
                  <CategoryIcon category={def.category} />
                  <span className="group-hover:underline">
                  {def.term}
                  {def.fullName && def.fullName !== def.term && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {def.fullName}
                    </span>
                  )}
                  </span>
                </Link>
                {def.definition && (
                  <p className="mt-1 pl-[26px] text-sm text-muted-foreground line-clamp-2">
                    {def.definition}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
