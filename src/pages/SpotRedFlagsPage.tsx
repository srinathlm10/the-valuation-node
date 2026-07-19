import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SpotRedFlagsLesson } from "@/components/learn/SpotRedFlagsLesson";

export default function SpotRedFlagsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Spot the Red Flags - The Valuation Node</title>
        <meta
          name="description"
          content="Work through realistic case studies and identify the warning signs of financial distress and poor earnings quality, before they blow up."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/by-doing/spot-the-red-flags" />
        <meta property="og:title" content="Spot the Red Flags - The Valuation Node" />
        <meta
          property="og:description"
          content="Three case studies, a checklist of signals, and instant feedback. Learn to catch the warning signs analysts look for."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Spot the Red Flags",
            description:
              "An interactive case-study exercise for identifying warning signs of financial distress and poor earnings quality.",
            provider: { "@type": "Organization", name: "The Valuation Node" },
            educationalLevel: "Intermediate",
            learningResourceType: "Interactive Exercise",
            teaches: ["Earnings quality", "Financial distress", "Red flags", "Forensic accounting", "Governance"],
            url: "https://valuationnode.com/learn/by-doing/spot-the-red-flags",
          })}
        </script>
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-5xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/by-doing" className="hover:text-foreground">Learn-by-Doing</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Spot the Red Flags</li>
        </ol>
      </nav>

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
