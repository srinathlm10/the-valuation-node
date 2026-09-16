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
          title: "Compliance - Markets",
          slug: "compliance",
          section: "news",
          subsection: "policy-regulation",
          summary: "SEBI, NSE, and BSE regulatory circulars summarised in plain language for Indian market participants. Updated monthly.",
        })}
        path="/markets/compliance"
        titleTag="Compliance - Markets - The Valuation Node"
      />

      <div className="container py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/markets" className="hover:text-foreground">Markets</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Compliance</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
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
