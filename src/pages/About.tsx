import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/seo/Seo";
import { staticMeta } from "@/lib/contentModel";
import { ArrowRight } from "lucide-react";

const subpages = [
  {
    href: "/about/author",
    title: "Author",
    description: "About Gajji Srinath, background, what he's working on, and how to reach him.",
  },
  {
    href: "/about/site",
    title: "About this site",
    description: "The mission, editorial principles, and disclosure.",
  },
  {
    href: "/about/philosophy",
    title: "Editorial philosophy",
    description: "How valuation and credit analysis work on this site, DCF approach, WACC, data sources.",
  },
  {
    href: "/about/contact",
    title: "Contact",
    description: "Email and LinkedIn, what to write about, and what not to expect.",
  },
  {
    href: "/about/privacy",
    title: "Privacy",
    description: "What the site collects when you read, subscribe, or sign in.",
  },
  {
    href: "/about/disclaimer",
    title: "Disclaimer",
    description: "Educational analysis, not investment advice, and what that means in practice.",
  },
];

export default function About() {
  return (
    <Layout>
      <Seo
        meta={staticMeta({
          title: "About",
          slug: "about",
          section: "about",
          summary: "About The Valuation Node - Indian markets research and learning by Gajji Srinath.",
        })}
        path="/about"
        titleTag="About - The Valuation Node"
        jsonLd={[
          {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Gajji Srinath",
          jobTitle: "Founder, The Valuation Node",
          affiliation: { "@type": "Organization", name: "NIT Rourkela" },
          url: "https://valuationnode.com/about/author",
        },
        ]}
      />
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />

      <div className="container max-w-3xl py-14">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The Valuation Node is an independent finance research publication.
        </p>

        <div className="mt-10 space-y-3">
          {subpages.map((p) => (
            <Link
              key={p.href}
              to={p.href}
              className="group flex items-center justify-between gap-4 rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div>
                <h2 className="font-semibold group-hover:underline">{p.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
