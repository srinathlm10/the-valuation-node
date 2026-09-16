import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
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
          subsection: "policy-regulation",
          summary: "SEBI, NSE, and BSE regulatory circulars summarised in plain language for Indian market participants. Updated monthly.",
        })}
        path="/news/policy-regulation/compliance-calendar"
        titleTag="SEBI, NSE, BSE Compliance Calendar - The Valuation Node"
      />

      <div className="container py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/news" className="hover:text-foreground">News & Trends</Link>
          <span>/</span>
          <Link to="/news/policy-regulation" className="hover:text-foreground">Policy & Regulation</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Compliance Calendar</span>
        </nav>

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

        <ComplianceFeed circulars={CIRCULARS as never} />
      </div>
    </Layout>
  );
}
