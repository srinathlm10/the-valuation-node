import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in (children as any)) {
    return headingText((children as any).props.children);
  }
  return "";
}

interface ProseProps {
  children: string;
  /** "base" for article bodies, "sm" for compact contexts (deep dives, callouts). */
  size?: "base" | "sm";
  /** Serif body for a publication feel (articles, Foundations). */
  serif?: boolean;
  className?: string;
}

/**
 * The single markdown renderer for all long-form content: Research articles,
 * Foundations topics, and glossary entries. Centralises GFM support (tables),
 * router-aware internal links, heading anchor ids, and horizontally scrollable
 * tables. Visual styling comes from the typography config in tailwind.config.ts;
 * do not add per-page prose styling.
 */
export function Prose({ children, size = "base", serif = true, className }: ProseProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        size === "sm" && "prose-sm",
        serif && "font-serif prose-headings:font-sans",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: linkChildren }) => {
            if (href && href.startsWith("/")) {
              return <Link to={href}>{linkChildren}</Link>;
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {linkChildren}
              </a>
            );
          },
          h2: ({ children: h }) => <h2 id={slugify(headingText(h))}>{h}</h2>,
          h3: ({ children: h }) => <h3 id={slugify(headingText(h))}>{h}</h3>,
          table: ({ children: t }) => (
            <div className="w-full overflow-x-auto rounded-lg border my-6 not-prose-scroll">
              <table className="my-0">{t}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
