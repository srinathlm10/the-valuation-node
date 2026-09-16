import { Helmet } from "react-helmet-async";
import {
  DEFAULT_AUTHOR,
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  SITE_NAME,
  SITE_URL,
  type PageMeta,
} from "@/lib/contentModel";

interface SeoProps {
  /** Page metadata; `title` and `summary` feed every tag below. */
  meta: Pick<PageMeta, "title" | "summary"> &
    Partial<Pick<PageMeta, "publishDate" | "updatedDate" | "featuredImage" | "imageAlt" | "author" | "status">>;
  /** Site-relative path, e.g. /vault/glossary/roe. Becomes canonical and og:url. */
  path: string;
  /** Override the <title> (default: "{title} - The Valuation Node"). */
  titleTag?: string;
  /** Override the meta description (default: summary, trimmed to 158 chars). */
  description?: string;
  /** "article" for dated posts; everything else is "website". */
  type?: "website" | "article";
  /** Keep crawlers out (drafts, hidden, auth, 404). Drafts are noindex automatically. */
  noindex?: boolean;
  /** One or more JSON-LD objects. BreadcrumbList, Article, DefinedTerm, etc. */
  jsonLd?: object[];
}

const TITLE_MAX = 65;
const DESC_MAX = 158;

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 3).replace(/\s+\S*$/, "") + "...";
}

/** YYYY-MM-DD to an ISO datetime at midnight IST, which Open Graph expects. */
function isoDate(d?: string): string | undefined {
  if (!d) return undefined;
  return /T/.test(d) ? d : `${d}T00:00:00+05:30`;
}

function absolute(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * The single head component for every page. Emits title, description,
 * canonical, Open Graph, Twitter, article dates, robots, and any JSON-LD, all
 * derived from the page's PageMeta so no page can ship without og:title or
 * og:description again. Site-wide defaults (site_name, locale, default image)
 * still come from Layout; this component only overrides what it knows.
 */
export function Seo({ meta, path, titleTag, description, type = "website", noindex, jsonLd = [] }: SeoProps) {
  const pageTitle = titleTag ?? `${meta.title} - ${SITE_NAME}`;
  const desc = clip((description ?? meta.summary ?? "").replace(/\s+/g, " ").trim(), DESC_MAX);
  const url = `${SITE_URL}${path}`;
  const image = absolute(meta.featuredImage) ?? DEFAULT_IMAGE;
  const imageAlt = meta.imageAlt ?? (image === DEFAULT_IMAGE ? DEFAULT_IMAGE_ALT : meta.title);
  const robots = noindex || meta.status === "draft" ? "noindex, nofollow" : undefined;
  const published = isoDate(meta.publishDate);
  const modified = isoDate(meta.updatedDate ?? meta.publishDate);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {desc && <meta name="description" content={desc} />}
      <link rel="canonical" href={url} />
      {robots && <meta name="robots" content={robots} />}

      <meta property="og:title" content={clip(meta.title, TITLE_MAX)} />
      {desc && <meta property="og:description" content={desc} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:title" content={clip(meta.title, TITLE_MAX)} />
      {desc && <meta name="twitter:description" content={desc} />}
      <meta name="twitter:image" content={image} />

      {type === "article" && published && <meta property="article:published_time" content={published} />}
      {type === "article" && modified && <meta property="article:modified_time" content={modified} />}
      {type === "article" && <meta property="article:author" content={meta.author ?? DEFAULT_AUTHOR} />}

      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
