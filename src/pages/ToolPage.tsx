import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { interactiveMeta } from "@/lib/contentModel";
import { TOOL_META } from "@/data/tools";
import {
  FutureValueCalculator,
  SIPCalculator,
  CAGRCalculator,
  EMICalculator,
  PresentValueCalculator,
  CompoundInterestCalculator,
  RuleOf72Calculator,
  InflationAdjustedReturnCalculator,
  StepUpSIPCalculator,
  GoalSIPCalculator,
  LoanPrepaymentCalculator,
  WACCCalculator,
} from "@/components/calculators/FormulaCalculators";
import { CollapsibleSection } from "@/components/content/CollapsibleSection";
import { ContinueReading } from "@/components/research/ContinueReading";
import { getRelatedTools } from "@/lib/relatedContent";
import { TOOL_ICONS } from "@/lib/siteIcons";
import { breadcrumbLd } from "@/lib/seo";

// Every tool slug maps to its live calculator component.
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  sip: SIPCalculator,
  "future-value": FutureValueCalculator,
  "present-value": PresentValueCalculator,
  cagr: CAGRCalculator,
  "compound-interest": CompoundInterestCalculator,
  "rule-of-72": RuleOf72Calculator,
  emi: EMICalculator,
  "inflation-adjusted-returns": InflationAdjustedReturnCalculator,
  "step-up-sip": StepUpSIPCalculator,
  "goal-sip": GoalSIPCalculator,
  "loan-prepayment": LoanPrepaymentCalculator,
  "wacc": WACCCalculator,
};

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? TOOL_META[slug] : null;

  if (!meta) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center">
          <p className="text-muted-foreground">Tool not found.</p>
          <Link to="/vault/interactive" className="mt-4 inline-block text-sm hover:underline">← Tools</Link>
        </div>
      </Layout>
    );
  }

  const CalculatorComponent = slug ? TOOL_COMPONENTS[slug] : undefined;
  const pagePath = `/vault/interactive/${slug}`;
  const pageMeta = interactiveMeta({ slug: slug!, title: meta.label, description: meta.description, kind: "calculator" });

  return (
    <Layout>
      <Seo
        meta={pageMeta}
        path={pagePath}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: meta.label,
            description: meta.description,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            url: `https://valuationnode.com${pagePath}`,
          },
          breadcrumbLd([
            { name: "The Vault", path: "/vault" },
            { name: "Interactive", path: "/vault/interactive" },
            { name: meta.label, path: pagePath },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "The Vault", path: "/vault" },
          { name: "Interactive", path: "/vault/interactive" },
          { name: meta.label, path: pagePath },
        ]}
      />
      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">{meta.label}</h1>
        <p className="mt-3 text-muted-foreground">{meta.description}</p>

        {/* Calculator (the card inside uses h3, so this h2 keeps the outline in order) */}
        {CalculatorComponent && (
          <section className="mt-8" aria-labelledby="calculator-heading">
            <h2 id="calculator-heading" className="sr-only">Calculator</h2>
            <CalculatorComponent />
          </section>
        )}

        {/* How to use */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">How to use this</h2>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {meta.howToUse}
          </p>
        </section>

        {/* Math explainer */}
        <CollapsibleSection title="What the math is doing" className="mt-6">
          <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
            {meta.mathExplainer}
          </p>
        </CollapsibleSection>

        {/* Related research */}
        <ContinueReading heading="From the research" tags={[meta.label]} className="mt-8" />

        {/* Learn the concept */}
        {meta.foundationsLink && (
          <div className="mt-3 rounded-lg border p-4">
            <h2 className="text-sm font-semibold">Learn the concept</h2>
            <Link
              to={meta.foundationsLink.href}
              className="mt-1 text-sm text-foreground hover:underline inline-block"
            >
              {meta.foundationsLink.label} →
            </Link>
          </div>
        )}

        {/* More tools */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            More tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {getRelatedTools(slug ?? "").map((t) => {
              const Icon = TOOL_ICONS[t.slug];
              return (
                <Link
                  key={t.slug}
                  to={`/vault/interactive/${t.slug}`}
                  className="group flex items-center gap-2.5 rounded-xl border bg-card p-3.5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  {Icon && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                  )}
                  <span className="text-sm font-medium leading-snug group-hover:underline">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
