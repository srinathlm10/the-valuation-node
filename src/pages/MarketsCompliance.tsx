import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { breadcrumbLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { ComplianceFeed } from "@/components/compliance/ComplianceFeed";
import CIRCULARS from "@/data/circulars.json";

export default function MarketsCompliance() {
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Compliance Calendar",
          slug: "compliance-calendar",
          section: "news",
          subsection: "economy-policy",
          summary: "SEBI, NSE, and BSE regulatory circulars summarised in plain language for Indian market participants. Updated monthly.",
        })}
        path="/news/economy-policy/compliance-calendar"
        titleTag="SEBI, NSE, BSE Compliance Calendar - The Valuation Node"
        jsonLd={[breadcrumbLd([{ name: "News & Trends", path: "/news" }, { name: "Economy & Policy", path: "/news/economy-policy" }, { name: "Compliance Calendar", path: "/news/economy-policy/compliance-calendar" }])]}
      />
      <Breadcrumbs items={[{ name: "News & Trends", path: "/news" }, { name: "Economy & Policy", path: "/news/economy-policy" }, { name: "Compliance Calendar", path: "/news/economy-policy/compliance-calendar" }]} />

      <div className="container py-14">

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Compliance Calendar</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Updated monthly. For real-time updates, see{" "}
            <a
              href="https://www.sebi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              SEBI
            </a>{" "}
            and exchange websites directly.
          </p>
        </div>

        <h2 className="sr-only">Circulars</h2>
        <ComplianceFeed circulars={CIRCULARS as never} />
      </div>
    </Layout>
  );
}
