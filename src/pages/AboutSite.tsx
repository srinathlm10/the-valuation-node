import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";

const PRINCIPLES = [
  "I cite my sources.",
  "I show my math.",
  "I name what I do not know.",
  "I do not give investment advice.",
  "I write to learn, and to teach.",
  "No sponsored content.",
];

export default function AboutSite() {
  return (
    <Layout>
      <Helmet>
        <title>About this site - The Valuation Node</title>
        <meta
          name="description"
          content="The mission, editorial principles, and disclosure for The Valuation Node."
        />
        <link rel="canonical" href="https://valuationnode.com/about/site" />
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">About this site</li>
        </ol>
      </nav>

      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight">About this site</h1>

        {/* Mission */}
        <div className="mt-6 prose prose-slate dark:prose-invert max-w-none font-serif prose-headings:font-sans">
          <p>
            The Valuation Node exists to make serious financial analysis of Indian markets
            readable, checkable, and free. Most market commentary asks for trust; this site
            tries to earn it instead, by stating every assumption, citing primary sources,
            and publishing the reasoning alongside the conclusion.
          </p>
          <p>
            The site has two halves that feed each other. The learning library builds the
            concepts, from reading an income statement to building a DCF, and the research
            applies them to real situations. Every research piece links back to the concepts
            it uses, so a reader can always trace an argument down to first principles.
          </p>
        </div>

        {/* Editorial principles */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Editorial principles</h2>
          <ol className="mt-4 space-y-3">
            {PRINCIPLES.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-sm font-bold text-muted-foreground shrink-0 w-5">
                  {i + 1}.
                </span>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Disclosure */}
        <section className="mt-10 rounded-xl border bg-muted/20 p-6">
          <h2 className="font-semibold">Disclosure</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This is not investment advice. Any opinions are personal. No paid promotions.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For general enquiries, reach us at{" "}
            <a href="mailto:info@valuationnode.com" className="text-foreground underline underline-offset-4 hover:no-underline">
              info@valuationnode.com
            </a>
          </p>
        </section>
      </div>
    </Layout>
  );
}
