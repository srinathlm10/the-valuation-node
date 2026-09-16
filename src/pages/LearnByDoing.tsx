import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { LESSONS } from "@/data/lessons";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Clock } from "lucide-react";

const modules = LESSONS;

export default function LearnByDoing() {
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Learn-by-Doing",
          slug: "by-doing",
          section: "vault",
          subsection: "interactive",
          summary: "Interactive finance lessons through actual practice with real company data.",
        })}
        path="/learn/by-doing"
        titleTag="Learn-by-Doing - The Valuation Node"
      />

      <div className="container max-w-3xl py-14">
        <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Learn
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Learn-by-Doing</h1>
        <p className="mt-3 text-muted-foreground">
          Interactive lessons that teach finance through actual practice with real company data.
        </p>

        <div className="mt-10 divide-y">
          {modules.map((m) => (
            <div key={m.slug} className="py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-lg leading-snug">
                    {m.live ? (
                      <Link to={`/learn/by-doing/${m.slug}`} className="hover:underline">
                        {m.title}
                      </Link>
                    ) : (
                      m.title
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {m.duration}
                    </span>
                    {m.steps && <span>{m.steps} steps</span>}
                  </div>
                </div>
                {m.live ? (
                  <Link
                    to={`/learn/by-doing/${m.slug}`}
                    className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Start →
                  </Link>
                ) : (
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
