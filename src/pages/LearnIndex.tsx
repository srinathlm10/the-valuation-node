import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { breadcrumbLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { ArrowRight } from "lucide-react";
import { LEARN_SECTION_ICONS } from "@/lib/siteIcons";
import { RATIOS } from "@/data/ratioAnalysis";
import { GLOSSARY } from "@/lib/glossary";

function SectionCardIcon({ href }: { href: string }) {
  const Icon = LEARN_SECTION_ICONS[href];
  if (!Icon) return null;
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
    </span>
  );
}

const sections = [
  {
    title: "Financial Glossary",
    href: "/vault/glossary",
    description:
      `${GLOSSARY.length} definitions, each with a formula where one exists, why it matters, a real Indian example, and links to the guide that teaches it.`,
  },
  {
    title: "Key Formulas & Ratios",
    href: "/vault/formulas",
    description:
      `${RATIOS.length} financial ratios, each with a plain definition, the formula on its own line, what a good number looks like, and a worked example. Valuation, profitability, leverage, efficiency, cash flow, banking, growth, and shareholding.`,
  },
  {
    title: "Concept Guides",
    href: "/vault/guides",
    description:
      "Finance from first principles in nine tracks: accounting, corporate finance, valuation, ratios, credit, markets, ESG, fintech, and data tools. Each guide covers intuition, mechanics, and common mistakes with Indian numbers.",
  },
  {
    title: "Model Templates & Interactive",
    href: "/vault/interactive",
    description:
      "Thirteen calculators and five step-by-step lessons on real company data: build a DCF, read an income statement, compute ratios, compare two companies, spot the red flags.",
  },
];

export default function LearnIndex() {
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "The Vault",
          slug: "vault",
          section: "vault",
          summary: "Finance concepts, from foundations to applied analysis, explained from first principles. A public learning library by Gajji Srinath.",
        })}
        path="/vault"
        titleTag="The Vault: Glossary, Formulas, Guides, Tools - The Valuation Node"
        jsonLd={[breadcrumbLd([{ name: "The Vault", path: "/vault" }])]}
      />
      <Breadcrumbs items={[{ name: "The Vault", path: "/vault" }]} />

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">The Vault</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          The reference library: every definition, formula, concept guide, and interactive tool on the site.
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
            to be read in any order, start from a definition in the Glossary, look up a formula in
            Key Formulas & Ratios, work through a Concept Guide, or jump straight into an interactive
            lesson. Wherever a concept
            appears in the original research on this site, it is linked back to the relevant Learn
            page.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              to={s.href}
              className="group rounded-xl border bg-muted/20 p-6 hover:bg-muted/40 transition-colors"
            >
              <SectionCardIcon href={s.href} />
              <h2 className="mt-4 font-semibold text-lg group-hover:underline">{s.title}</h2>
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
