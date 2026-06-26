import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight } from "lucide-react";

const subpages = [
  {
    href: "/about/author",
    title: "Author",
    description: "About Srinath Gajji - background, what he's working on, and how to reach him.",
  },
  {
    href: "/about/site",
    title: "About this site",
    description: "The mission, editorial principles, and disclosure.",
  },
  {
    href: "/about/methodology",
    title: "Methodology",
    description: "How valuation and credit analysis work on this site - DCF approach, WACC, data sources.",
  },
];

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About - The Valuation Node</title>
        <meta
          name="description"
          content="About The Valuation Node - Indian markets research and learning by Srinath Gajji."
        />
        <link rel="canonical" href="https://thevaluationnode.com/about" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Srinath Gajji",
          jobTitle: "Founder, The Valuation Node",
          affiliation: { "@type": "Organization", name: "NIT Rourkela" },
          url: "https://thevaluationnode.com/about/author",
        })}</script>
      </Helmet>

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="mt-3 text-muted-foreground">
          The Valuation Node is an independent finance research publication.
        </p>

        <div className="mt-10 grid gap-4">
          {subpages.map((p) => (
            <Link
              key={p.href}
              to={p.href}
              className="group rounded-xl border bg-muted/10 p-5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold group-hover:underline">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
