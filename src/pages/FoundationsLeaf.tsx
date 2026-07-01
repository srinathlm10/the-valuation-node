import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { FOUNDATIONS_TREE } from "./Foundations";
import { FOUNDATIONS_CONTENT } from "@/data/foundationsContent";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden mt-6">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="px-4 py-4">{children}</div>}
    </div>
  );
}

export default function FoundationsLeaf() {
  const { section, topic } = useParams<{ section: string; topic: string }>();

  const sectionData = FOUNDATIONS_TREE.find((g) => g.section === section);
  const topicMeta = sectionData?.topics.find((t) => t.slug === topic);

  if (!sectionData || !topicMeta) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center text-muted-foreground text-sm">
          Page not found.{" "}
          <Link to="/learn/foundations" className="underline hover:text-foreground">
            Back to Foundations
          </Link>
        </div>
      </Layout>
    );
  }

  const content = FOUNDATIONS_CONTENT[topic!];
  const isPlaceholder = !topicMeta.published || !content;

  return (
    <Layout>
      <Helmet>
        <title>{topicMeta.label} - Foundations - The Valuation Node</title>
        <meta
          name="description"
          content={`Learn ${topicMeta.label} from first principles, with Indian context and worked examples.`}
        />
        <link
          rel="canonical"
          href={`https://valuationnode.com/learn/foundations/${section}/${topic}`}
        />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: topicMeta.label,
          author: { "@type": "Person", name: "Srinath Gajji" },
          provider: { "@type": "Organization", name: "The Valuation Node" },
        })}</script>
      </Helmet>

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/foundations" className="hover:text-foreground">Foundations</Link></li>
          <li>/</li>
          <li><Link to={`/learn/foundations/${section}`} className="hover:text-foreground">{sectionData.label}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{topicMeta.label}</li>
        </ol>
      </nav>

      <article className="container max-w-3xl py-12">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Foundations · {sectionData.label}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{topicMeta.label}</h1>

        {isPlaceholder ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground font-medium">Coming as I learn</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This page is a placeholder. Content will be added here as it's written.
            </p>
            <div className="mt-8">
              <NewsletterSignup />
            </div>
          </div>
        ) : (
          <>
            {/* Meta */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{content.readingTime}</span>
              <span>Last reviewed: {content.lastReviewed}</span>
            </div>

            {/* Prerequisites */}
            {content.prerequisites.length > 0 && (
              <div className="mt-6 rounded-lg bg-muted/30 border p-4">
                <p className="text-sm font-medium">Before reading this, you should be comfortable with:</p>
                <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {content.prerequisites.map((p) => (
                    <li key={p.href}>
                      <Link to={p.href} className="underline underline-offset-2 hover:text-foreground">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Intuition */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Intuition</h2>
              <div className="mt-3 prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                <ReactMarkdown>{content.intuition}</ReactMarkdown>
              </div>
            </section>

            {/* Mechanics */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Mechanics</h2>
              <div className="mt-3 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{content.mechanics}</ReactMarkdown>
              </div>
            </section>

            {/* Deep Dive */}
            <Collapsible title="Show advanced details">
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground">
                <ReactMarkdown>{content.deepDive}</ReactMarkdown>
              </div>
            </Collapsible>

            {/* Common Mistakes */}
            <div className="mt-8 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-6">
              <h2 className="font-semibold text-red-800 dark:text-red-200">Common mistakes</h2>
              <ul className="mt-3 space-y-2">
                {content.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* See it applied */}
            <div className="mt-8 rounded-lg border p-4">
              <h2 className="text-sm font-semibold">See it applied</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Applications will be linked here as research is published.
              </p>
            </div>

            {/* Try it yourself */}
            {content.tryItHref ? (
              <div className="mt-4 rounded-lg border p-4">
                <h2 className="text-sm font-semibold">Try it yourself</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Practice the concepts with an interactive calculator:{" "}
                  <Link to={content.tryItHref} className="text-foreground underline underline-offset-2 hover:no-underline">
                    open tool →
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border p-4">
                <h2 className="text-sm font-semibold">Try it yourself</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Interactive exercises coming soon.
                </p>
              </div>
            )}

            <div className="mt-10">
              <NewsletterSignup />
            </div>
          </>
        )}
      </article>
    </Layout>
  );
}
