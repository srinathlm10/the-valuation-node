import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ReadIncomeStatementLesson } from "@/components/learn/ReadIncomeStatementLesson";

export default function ReadIncomeStatementPage() {
  return (
    <Layout>
      <Helmet>
        <title>Read an Income Statement, Line by Line - The Valuation Node</title>
        <meta
          name="description"
          content="Walk through a real Indian company's P&L one line at a time. Understand what each number means and how revenue becomes net profit."
        />
        <link rel="canonical" href="https://valuationnode.com/learn/by-doing/read-an-income-statement" />
        <meta property="og:title" content="Read an Income Statement, Line by Line - The Valuation Node" />
        <meta
          property="og:description"
          content="An interactive lesson that reveals a company's income statement line by line, explaining each item as you go."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Read an Income Statement, Line by Line",
            description:
              "An interactive lesson that reveals a company's income statement line by line, explaining what each item means.",
            provider: { "@type": "Organization", name: "The Valuation Node" },
            educationalLevel: "Beginner",
            learningResourceType: "Interactive Tutorial",
            teaches: ["Income statement", "P&L", "Gross profit", "EBITDA", "Net profit", "Margins"],
            url: "https://valuationnode.com/learn/by-doing/read-an-income-statement",
          })}
        </script>
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-5xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/learn" className="hover:text-foreground">Learn</Link></li>
          <li>/</li>
          <li><Link to="/learn/by-doing" className="hover:text-foreground">Learn-by-Doing</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Read an Income Statement</li>
        </ol>
      </nav>

      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Read an Income Statement, Line by Line</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Pick a real Indian company and reveal its profit &amp; loss statement one line at a time. Each line explains
            what the number means, how it's derived, and what to watch for, so you learn to read a P&amp;L the way an
            analyst does.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>~20 min</span>
            <span>·</span>
            <span>13 lines</span>
            <span>·</span>
            <span>Beginner</span>
          </div>
        </div>

        <ReadIncomeStatementLesson />
      </div>
    </Layout>
  );
}
