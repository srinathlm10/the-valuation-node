import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { Calculator, Clock } from "lucide-react";
import { TOOL_ICONS } from "@/lib/siteIcons";
import { LESSONS } from "@/data/lessons";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";

// Serves /vault/interactive: Model Templates & Interactive. One hub for the 13
// calculators (formerly /tools) and the 5 step-by-step lessons (formerly
// /learn/by-doing). Both keep their slugs under /vault/interactive/.

function ToolIcon({ slug }: { slug: string }) {
  const Icon = TOOL_ICONS[slug] ?? Calculator;
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
    </span>
  );
}

const toolGroups = [
  {
    label: "Valuation",
    tools: [
      { slug: "dcf-sensitivity", label: "DCF Sensitivity Calculator" },
      { slug: "cagr", label: "CAGR Calculator" },
      { slug: "wacc", label: "WACC Calculator" },
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
      { slug: "step-up-sip", label: "Step-Up SIP Calculator" },
      { slug: "goal-sip", label: "Goal SIP Calculator" },
    ],
  },
  {
    label: "Loans",
    tools: [
      { slug: "emi", label: "EMI Calculator" },
      { slug: "loan-prepayment", label: "Loan Prepayment Calculator" },
    ],
  },
  {
    label: "Risk",
    tools: [{ slug: "inflation-adjusted-returns", label: "Inflation-Adjusted Returns Calculator" }],
  },
];

export default function Tools() {
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "Model Templates & Interactive",
          slug: "interactive",
          section: "vault",
          subsection: "interactive",
          summary:
            "Thirteen financial calculators (SIP, CAGR, WACC, DCF sensitivity, EMI and more) and five interactive lessons that teach valuation and statement analysis on real company data.",
        })}
        path={paths.interactive()}
        titleTag="Calculators and Interactive Lessons - The Valuation Node"
        jsonLd={[breadcrumbLd([{ name: "The Vault", path: paths.vault() }, { name: "Model Templates & Interactive", path: paths.interactive() }])]}
      />

      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container flex max-w-3xl items-center gap-2 py-3 text-sm text-muted-foreground">
          <li><Link to={paths.vault()} className="hover:text-foreground">The Vault</Link></li>
          <li>/</li>
          <li className="font-medium text-foreground">Model Templates & Interactive</li>
        </ol>
      </nav>

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">Model Templates & Interactive</h1>
        <p className="mt-3 text-muted-foreground">
          Calculators for quick, accurate computations, and step-by-step lessons that teach the
          method on real Indian company numbers.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Interactive lessons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Work through a method end to end. Each lesson checks your numbers as you go.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {LESSONS.map((m) => (
              <Link key={m.slug} to={paths.interactiveItem(m.slug)} className="group rounded-lg border bg-muted/10 p-4 transition-colors hover:bg-muted/30">
                <p className="text-sm font-medium group-hover:underline">{m.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{m.description}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" /> {m.duration} · {m.steps} steps
                </p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 space-y-10">
          <h2 className="text-xl font-semibold tracking-tight">Calculators</h2>
          {toolGroups.map((group) => (
            <section key={group.label}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.tools.map((tool) => (
                  <div key={tool.slug} className="rounded-lg border bg-muted/10 p-4">
                    <div className="flex items-center gap-3">
                      <ToolIcon slug={tool.slug} />
                      <Link to={paths.interactiveItem(tool.slug)} className="text-sm font-medium hover:underline">
                        {tool.label}
                      </Link>
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
