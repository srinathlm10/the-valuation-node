import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOUNDATIONS_SECTION_ICONS } from "@/lib/siteIcons";
import { FOUNDATIONS_TREE } from "@/data/foundationsTree";
import { breadcrumbLd } from "@/lib/seo";

function SectionIcon({ section }: { section: string }) {
  const Icon = FOUNDATIONS_SECTION_ICONS[section];
  if (!Icon) return null;
  return <Icon className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />;
}

// Topic tree lives in src/data/foundationsTree.ts; re-exported for existing importers.
export { FOUNDATIONS_TREE };


function Sidebar({ activeSection }: { activeSection?: string }) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(activeSection ? [activeSection] : [FOUNDATIONS_TREE[0].section])
  );

  const toggle = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <nav className="space-y-1">
      {FOUNDATIONS_TREE.map((group) => (
        <div key={group.section}>
          <button
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeSection === group.section
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => toggle(group.section)}
          >
            <span className="flex items-center gap-2.5">
              <SectionIcon section={group.section} />
              {group.label}
            </span>
            {openSections.has(group.section) ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {openSections.has(group.section) && (
            <div className="ml-3 mt-1 space-y-0.5">
              {group.topics.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/vault/guides/${topic.slug}`}
                  className={cn(
                    "flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors",
                    topic.published
                      ? "text-foreground hover:bg-muted"
                      : "text-muted-foreground/60 cursor-default pointer-events-none"
                  )}
                >
                  {topic.label}
                  {!topic.published && (
                    <span className="ml-auto text-xs text-muted-foreground/50">Soon</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function Foundations() {
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Concept Guides",
          slug: "guides",
          section: "vault",
          subsection: "guides",
          summary: "Finance from first principles in nine tracks: accounting, corporate finance, valuation, ratios, credit, markets, ESG, fintech, and data tools, with Indian context.",
        })}
        path="/vault/guides"
        titleTag="Concept Guides: Finance from First Principles - The Valuation Node"
        jsonLd={[breadcrumbLd([{ name: "The Vault", path: "/vault" }, { name: "Concept Guides", path: "/vault/guides" }])]}
      />
      <Breadcrumbs items={[{ name: "The Vault", path: "/vault" }, { name: "Concept Guides", path: "/vault/guides" }]} />

      <div className="container py-14">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-3">
                Tracks and guides
              </p>
              <Sidebar />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">Concept Guides</h1>
            <p className="mt-3 text-muted-foreground">
              Finance concepts from first principles. Each topic covers intuition, mechanics, and
              worked examples with real Indian company data.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Select a topic from the sidebar, or open a track to read its guides in order. Every
              guide covers intuition, mechanics, common mistakes, and an advanced deep dive.
            </p>

            <div className="mt-10 lg:hidden">
              <Sidebar />
            </div>

            <div className="mt-12">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
