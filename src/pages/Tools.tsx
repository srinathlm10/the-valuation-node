import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Calculator } from "lucide-react";

const toolGroups = [
  {
    label: "Valuation",
    tools: [
      { slug: "dcf-sensitivity", label: "DCF Sensitivity Calculator", comingSoon: true },
      { slug: "cagr", label: "CAGR Calculator" },
    ],
  },
  {
    label: "Investment Planning",
    tools: [
      { slug: "sip", label: "SIP Calculator" },
      { slug: "future-value", label: "Future Value Calculator" },
      { slug: "present-value", label: "Present Value Calculator" },
      { slug: "compound-interest", label: "Compound Interest Calculator" },
      { slug: "rule-of-72", label: "Rule of 72" },
    ],
  },
  {
    label: "Loans",
    tools: [{ slug: "emi", label: "EMI Calculator" }],
  },
  {
    label: "Risk",
    tools: [{ slug: "inflation-adjusted-returns", label: "Inflation-Adjusted Returns Calculator" }],
  },
];

export default function Tools() {
  return (
    <Layout>
      <Helmet>
        <title>Tools - The Valuation Node</title>
        <meta
          name="description"
          content="Financial calculators for SIP, CAGR, EMI, compound interest, future value, present value, and more."
        />
        <link rel="canonical" href="https://valuationnode.com/tools" />
      </Helmet>

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
        <p className="mt-3 text-muted-foreground">
          Financial calculators for quick, accurate computations.
        </p>

        <div className="mt-10 space-y-10">
          {toolGroups.map((group) => (
            <section key={group.label}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {group.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.tools.map((tool) => (
                  <div key={tool.slug} className="rounded-lg border bg-muted/10 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        {tool.comingSoon ? (
                          <span className="text-sm font-medium text-muted-foreground">
                            {tool.label}
                          </span>
                        ) : (
                          <Link
                            to={`/tools/${tool.slug}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {tool.label}
                          </Link>
                        )}
                      </div>
                      {tool.comingSoon && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
