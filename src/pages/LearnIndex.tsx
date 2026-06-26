import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    title: "Foundations",
    href: "/learn/foundations",
    description:
      "Finance from first principles - accounting, valuation, credit, markets, ESG, and fintech. Each topic covers intuition, mechanics, and worked examples with Indian company numbers.",
  },
  {
    title: "Learn-by-Doing",
    href: "/learn/by-doing",
    description:
      "Interactive lessons that teach finance through actual practice with real company data. Work through a DCF, read a financial statement, compute ratios.",
  },
  {
    title: "Glossary",
    href: "/learn/glossary",
    description:
      "500+ definitions, each with a formula, a real Indian example, and links to relevant Foundations pages and research.",
  },
];

export default function LearnIndex() {
  return (
    <Layout>
      <Helmet>
        <title>Learn - The Valuation Node</title>
        <meta
          name="description"
          content="Finance concepts, from foundations to applied analysis, explained from first principles. A public learning library by Srinath Gajji."
        />
        <link rel="canonical" href="https://thevaluationnode.com/learn" />
      </Helmet>

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Finance concepts, from foundations to applied analysis, explained from first principles.
        </p>

        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
          <p>
            This is a public learning library covering accounting, corporate finance, valuation,
            credit analysis, markets, ESG, and fintech, with a focus on Indian context. Every page
            is structured in three layers, an intuitive explanation, the formal mechanics with
            worked examples on real Indian companies, and an optional deep dive into edge cases and
            sector-specific adjustments. Pages are dated and revised as the field evolves.
          </p>
          <p>
            The library is built and maintained by a single author and grows steadily. It is meant
            to be read in any order, start from a definition in the Glossary, work through a
            Foundations topic, or jump straight into a Learn-by-Doing exercise. Wherever a concept
            appears in the original research on this site, it is linked back to the relevant Learn
            page.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              to={s.href}
              className="group rounded-xl border bg-muted/20 p-6 hover:bg-muted/40 transition-colors"
            >
              <h2 className="font-semibold text-lg group-hover:underline">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16" id="newsletter">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
