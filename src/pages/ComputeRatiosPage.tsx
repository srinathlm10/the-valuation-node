import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { interactiveMeta } from "@/lib/contentModel";
import { breadcrumbLd } from "@/lib/seo";
import { ComputeRatiosLesson } from "@/components/learn/ComputeRatiosLesson";

export default function ComputeRatiosPage() {
  return (
    <Layout>
      <Seo
        meta={interactiveMeta({ slug: "compute-ratios", title: "Compute Ratios from Raw Statements", description: "Pull numbers from real financial statements and compute the ratios analysts use every day. Type your answers and get instant feedback.", kind: "lesson" })}
        path="/vault/interactive/compute-ratios"
        jsonLd={[
          {
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: "Compute Ratios from Raw Statements",
              description:
                "An interactive drill where you compute financial ratios from raw statements and get instant feedback.",
              provider: { "@type": "Organization", name: "The Valuation Node" },
              educationalLevel: "Beginner to Intermediate",
              learningResourceType: "Interactive Exercise",
              teaches: ["Financial ratios", "Net margin", "ROE", "Current ratio", "Debt-to-equity", "Interest coverage"],
              url: "https://valuationnode.com/vault/interactive/compute-ratios",
            },
          breadcrumbLd([
            { name: "The Vault", path: "/vault" },
            { name: "Interactive", path: "/vault/interactive" },
            { name: "Compute Ratios from Raw Statements", path: "/vault/interactive/compute-ratios" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "The Vault", path: "/vault" }, { name: "Interactive", path: "/vault/interactive" }, { name: "Compute Ratios from Raw Statements", path: "/vault/interactive/compute-ratios" }]} />

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compute Ratios from Raw Statements</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            The only way to truly learn ratios is to compute them yourself. You'll be given the raw numbers from a real
            company's statements and the formula, then you type the answer. Get instant feedback and a plain-English
            interpretation of what each ratio actually tells you.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~25 min</span>
            <span>·</span>
            <span>6 ratios</span>
            <span>·</span>
            <span>Beginner to Intermediate</span>
          </div>
        </div>

        <ComputeRatiosLesson />
      </div>
    </Layout>
  );
}
