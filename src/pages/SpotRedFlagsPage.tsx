import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { interactiveMeta } from "@/lib/contentModel";
import { breadcrumbLd } from "@/lib/seo";
import { SpotRedFlagsLesson } from "@/components/learn/SpotRedFlagsLesson";

export default function SpotRedFlagsPage() {
  return (
    <Layout>
      <Seo
        meta={interactiveMeta({ slug: "spot-the-red-flags", title: "Spot the Red Flags", description: "Work through realistic case studies and identify the warning signs of financial distress and poor earnings quality, before they blow up.", kind: "lesson" })}
        path="/vault/interactive/spot-the-red-flags"
        jsonLd={[
          {
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: "Spot the Red Flags",
              description:
                "An interactive case-study exercise for identifying warning signs of financial distress and poor earnings quality.",
              provider: { "@type": "Organization", name: "The Valuation Node" },
              educationalLevel: "Intermediate",
              learningResourceType: "Interactive Exercise",
              teaches: ["Earnings quality", "Financial distress", "Red flags", "Forensic accounting", "Governance"],
              url: "https://valuationnode.com/vault/interactive/spot-the-red-flags",
            },
          breadcrumbLd([
            { name: "The Vault", path: "/vault" },
            { name: "Interactive", path: "/vault/interactive" },
            { name: "Spot the Red Flags", path: "/vault/interactive/spot-the-red-flags" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "The Vault", path: "/vault" }, { name: "Interactive", path: "/vault/interactive" }, { name: "Spot the Red Flags", path: "/vault/interactive/spot-the-red-flags" }]} />

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Spot the Red Flags</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Three hypothetical companies, each hiding a different kind of trouble. Read each case, tick the observations
            you'd genuinely flag, then reveal which are real warning signs and which are harmless, with an explanation
            for every one. Train the pattern recognition that keeps analysts out of blow-ups.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~30 min</span>
            <span>·</span>
            <span>3 cases</span>
            <span>·</span>
            <span>Intermediate</span>
          </div>
        </div>

        <SpotRedFlagsLesson />
      </div>
    </Layout>
  );
}
