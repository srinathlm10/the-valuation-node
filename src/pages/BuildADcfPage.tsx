import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BuildADcfLesson } from "@/components/learn/BuildADcfLesson";

export default function BuildADcfPage() {
  return (
    <Layout>
      <Helmet>
        <title>Build a DCF, Step by Step — Learn-by-Doing — The Valuation Node</title>
        <meta
          name="description"
          content="Build a complete discounted cash flow model for a real Indian company, one step at a time. Learn what each assumption means and how it affects the final valuation."
        />
        <link rel="canonical" href="https://thevaluationnode.com/learn/by-doing/build-a-dcf" />
        <meta property="og:title" content="Build a DCF, Step by Step — The Valuation Node" />
        <meta
          property="og:description"
          content="An interactive 8-step lesson that teaches you to build a DCF model from scratch, using real Indian companies."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Build a DCF, Step by Step",
            description:
              "An interactive 8-step lesson that teaches you to build a complete discounted cash flow model using real Indian companies.",
            provider: { "@type": "Organization", name: "The Valuation Node" },
            educationalLevel: "Beginner to Intermediate",
            learningResourceType: "Interactive Tutorial",
            teaches: ["DCF valuation", "WACC", "Terminal value", "NOPAT", "Free cash flow"],
            url: "https://thevaluationnode.com/learn/by-doing/build-a-dcf",
          })}
        </script>
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-5xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/by-doing" className="hover:text-foreground">Learn-by-Doing</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Build a DCF</li>
        </ol>
      </nav>

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Build a DCF, Step by Step</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Start from scratch and build a complete discounted cash flow model for a real Indian company — one concept at a time. Each step reveals one new assumption, explains why it matters, and shows you the live consequence in the model.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~30 min</span>
            <span>·</span>
            <span>8 steps</span>
            <span>·</span>
            <span>Beginner to Intermediate</span>
          </div>
        </div>

        <BuildADcfLesson />
      </div>
    </Layout>
  );
}
