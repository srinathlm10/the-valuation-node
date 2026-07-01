import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Clock } from "lucide-react";

const modules = [
  {
    slug: "build-a-dcf",
    title: "Build a DCF, Step by Step",
    description: "Start from scratch and build a complete discounted cash flow model for a real Indian company, one concept at a time.",
    duration: "~30 min",
    steps: 8,
    live: true,
  },
  {
    slug: "read-an-income-statement",
    title: "Read an Income Statement, Line by Line",
    description: "Walk through a real Indian company's P&L, line by line, and understand what each number means.",
    duration: "~20 min",
    steps: 13,
    live: true,
  },
  {
    slug: "compute-ratios",
    title: "Compute Ratios from Raw Statements",
    description: "Pull numbers from financial statements and compute the ratios analysts use every day — you do the math, we check it.",
    duration: "~25 min",
    steps: 6,
    live: true,
  },
  {
    slug: "compare-two-companies",
    title: "Compare Two Companies Side by Side",
    description: "Use a structured framework to compare two companies in the same sector. Predict the winner, then see the full profile.",
    duration: "~15 min",
    steps: 6,
    live: true,
  },
  {
    slug: "spot-the-red-flags",
    title: "Spot the Red Flags",
    description: "Work through realistic case studies and identify the warning signs of financial distress and poor earnings quality.",
    duration: "~30 min",
    steps: 3,
    live: true,
  },
];

export default function LearnByDoing() {
  return (
    <Layout>
      <Helmet>
        <title>Learn-by-Doing - The Valuation Node</title>
        <meta
          name="description"
          content="Interactive finance lessons through actual practice with real company data."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/by-doing" />
      </Helmet>

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
                    className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
