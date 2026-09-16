import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { interactiveMeta } from "@/lib/contentModel";
import { breadcrumbLd } from "@/lib/seo";
import { CompareCompaniesLesson } from "@/components/learn/CompareCompaniesLesson";

export default function CompareCompaniesPage() {
  return (
    <Layout>
      <Seo
        meta={interactiveMeta({ slug: "compare-two-companies", title: "Compare Two Companies Side by Side", description: "Use a structured framework to compare two Indian companies in the same sector, growth, margins, returns, leverage, and valuation.", kind: "lesson" })}
        path="/vault/interactive/compare-two-companies"
        jsonLd={[
          {
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: "Compare Two Companies Side by Side",
              description:
                "An interactive framework for comparing two companies in the same sector across growth, margins, returns, leverage, and valuation.",
              provider: { "@type": "Organization", name: "The Valuation Node" },
              educationalLevel: "Intermediate",
              learningResourceType: "Interactive Tutorial",
              teaches: ["Peer comparison", "Relative valuation", "Margins", "ROE", "Leverage", "P/E"],
              url: "https://valuationnode.com/vault/interactive/compare-two-companies",
            },
          breadcrumbLd([
            { name: "The Vault", path: "/vault" },
            { name: "Interactive", path: "/vault/interactive" },
            { name: "Compare Two Companies Side by Side", path: "/vault/interactive/compare-two-companies" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "The Vault", path: "/vault" }, { name: "Interactive", path: "/vault/interactive" }, { name: "Compare Two Companies Side by Side", path: "/vault/interactive/compare-two-companies" }]} />

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compare Two Companies Side by Side</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Pick two real companies from the same sector and go head-to-head across the dimensions that matter. Predict
            which company is stronger on each metric before the numbers reveal, then see the full profile on a radar
            chart and the analyst's verdict on why the "better business" isn't always the "better investment".
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~15 min</span>
            <span>·</span>
            <span>6 rounds</span>
            <span>·</span>
            <span>Intermediate</span>
          </div>
        </div>

        <CompareCompaniesLesson />
      </div>
    </Layout>
  );
}
