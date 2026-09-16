import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { Input } from "@/components/ui/input";
import { GLOSSARY } from "@/lib/glossary";
import { breadcrumbLd } from "@/lib/seo";
import { Search, SearchX } from "lucide-react";
import { EmptyState } from "@/components/content/EmptyState";
import { GLOSSARY_CATEGORY_ICONS, GLOSSARY_FALLBACK_ICON } from "@/lib/siteIcons";

function CategoryIcon({ category }: { category?: string }) {
  const Icon = (category && GLOSSARY_CATEGORY_ICONS[category]) || GLOSSARY_FALLBACK_ICON;
  return <Icon className="mt-1 h-4 w-4 shrink-0 text-primary/60" aria-hidden="true" />;
}
import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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
      <Seo
        meta={staticMeta({
          title: "Financial Glossary",
          slug: "glossary",
          section: "vault",
          subsection: "glossary",
          summary: `${GLOSSARY.length} finance definitions, each with a formula where one exists, why it matters, a real Indian example, and a link to the guide that teaches it.`,
        })}
        path="/vault/glossary"
        titleTag="Financial Glossary - The Valuation Node"
        jsonLd={[breadcrumbLd([{ name: "The Vault", path: "/vault" }, { name: "Financial Glossary", path: "/vault/glossary" }])]}
      />
      <Breadcrumbs items={[{ name: "The Vault", path: "/vault" }, { name: "Financial Glossary", path: "/vault/glossary" }]} />

      <div className="container max-w-4xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Financial Glossary</h1>
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
                  to={`/vault/glossary/${def.slug}`}
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
