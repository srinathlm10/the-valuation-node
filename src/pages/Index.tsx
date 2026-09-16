import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { Sidebar } from "@/components/layout/Sidebar";
import { staticMeta } from "@/lib/contentModel";
import { findByPath, latestItems, publishedItems, type ContentItem } from "@/lib/contentIndex";
import { RECENT_UPDATES } from "@/data/recentUpdates";
import { useHiddenSlugs } from "@/lib/articleVisibility";
import { getSection, getSubsection } from "@/lib/taxonomy";

/**
 * Home page: the prototype's layout and DOM, class for class
 * (src/styles/prototype.css holds the rules):
 *
 *   <div class="home-container">           2.3fr / 1fr grid, one column under 900px
 *     <main class="main-content">
 *       <a class="hero-card"> .hero-img / .hero-content (.tag, .hero-title, .hero-desc, .read-more)
 *       <div class="news-grid"> 4 x <a class="news-card"> .news-img / .news-content
 *     </main>
 *     <aside class="sidebar"> Latest Updates / Trending Topics / Weekly Briefing
 *   </div>
 *
 * Hero: the newest published research article. Grid: the next four recent
 * items (research, guides, lessons, formulas). Cards are single anchors, as
 * in the prototype. The h1 is the hero title, as in the prototype.
 */

function sectionLabel(item: ContentItem): string {
  const sub = item.meta.subsection ? getSubsection(item.meta.section, item.meta.subsection) : undefined;
  if (item.meta.section === "vault") {
    return { term: "Glossary", formula: "Formula", guide: "Concept Guide", course: "Course", track: "Track", calculator: "Calculator", lesson: "Lesson" }[item.kind] ?? "The Vault";
  }
  return sub?.label ?? getSection(item.meta.section).label;
}

function isEsg(item: ContentItem) {
  return item.meta.section === "esg" || item.meta.tags.includes("esg");
}

function CardImage({ item, hero }: { item: ContentItem; hero?: boolean }) {
  return (
    <div className={hero ? "hero-img" : "news-img"} aria-hidden={item.meta.featuredImage ? undefined : true}>
      {item.meta.featuredImage ? (
        <img
          src={item.meta.featuredImage}
          alt={item.meta.imageAlt ?? ""}
          width={hero ? 1200 : 600}
          height={hero ? 350 : 180}
          loading={hero ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <img src="/logo.png" alt="" width={hero ? 96 : 56} height={hero ? 96 : 56} className={hero ? "h-24 w-24 opacity-70" : "h-14 w-14 opacity-60"} loading="lazy" />
      )}
    </div>
  );
}

export default function Index() {
  const { data: hidden } = useHiddenSlugs();
  const visible = (i: ContentItem) => !(hidden?.has(i.meta.slug) ?? false);

  const articles = useMemo(
    () =>
      publishedItems()
        .filter((i) => i.kind === "article" && visible(i))
        .sort((a, b) => (b.meta.publishDate ?? "").localeCompare(a.meta.publishDate ?? "")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hidden]
  );
  const hero = articles[0];
  // Next four recent items: remaining articles, then anything else with a
  // date, then the latest Vault additions (recentUpdates.ts), then guides.
  const vaultAdditions = RECENT_UPDATES.map((u) => findByPath(u.path)).filter((x): x is ContentItem => !!x);
  const guides = publishedItems().filter((x) => x.kind === "guide" || x.kind === "lesson");
  const seen = new Set<string>(hero ? [hero.path] : []);
  const grid: ContentItem[] = [];
  for (const item of [...articles.slice(1), ...latestItems(20).filter((x) => x.kind !== "article"), ...vaultAdditions, ...guides]) {
    if (grid.length === 4) break;
    if (!visible(item) || seen.has(item.path)) continue;
    seen.add(item.path);
    grid.push(item);
  }

  return (
    <Layout bare>
      <Seo
        meta={staticMeta({
          title: "The Valuation Node: Indian Market Research & Learning",
          slug: "home",
          section: "analysis",
          summary:
            "Original valuation and credit analysis of Indian companies, plus a free reference library: glossary, formulas, concept guides, and interactive tools. By Gajji Srinath.",
        })}
        path="/"
        titleTag="The Valuation Node: Indian Market Research & Learning"
        description="Research and learning on Indian markets, by Gajji Srinath. Original valuations, credit analysis, ESG, and a free reference library."
      />

      <div className="home-container">
        {/* Main Content Area (70%) */}
        <main className="main-content">
          {/* Hero Block */}
          {hero ? (
            <Link to={hero.path} className="hero-card">
              <CardImage item={hero} hero />
              <div className="hero-content">
                <span className={isEsg(hero) ? "tag esg" : "tag"}>{sectionLabel(hero)}</span>
                <h1 className="hero-title">{hero.meta.title}</h1>
                <p className="hero-desc">{hero.meta.summary}</p>
                <span className="read-more">Read Full Analysis</span>
              </div>
            </Link>
          ) : (
            <h1 className="hero-title">The Valuation Node</h1>
          )}

          {/* News & Analysis Grid */}
          <div className="news-grid">
            {grid.map((item) => (
              <Link key={item.path} to={item.path} className="news-card">
                <CardImage item={item} />
                <div className="news-content">
                  <span className={isEsg(item) ? "tag esg" : "tag"}>{sectionLabel(item)}</span>
                  <h2 className="news-title">{item.meta.title}</h2>
                  <p className="news-desc">{item.meta.summary}</p>
                  <span className="read-more">Read More</span>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Sidebar Area (30%) */}
        <Sidebar />
      </div>
    </Layout>
  );
}
