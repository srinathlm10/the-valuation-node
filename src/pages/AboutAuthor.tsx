import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Mail, Linkedin, Github, FileText } from "lucide-react";

export default function AboutAuthor() {
  return (
    <Layout>
      <Helmet>
        <title>Srinath Gajji — The Valuation Node</title>
        <meta
          name="description"
          content="About Srinath Gajji, Founder of The Valuation Node, MBA candidate at NIT Rourkela."
        />
        <link rel="canonical" href="https://thevaluationnode.com/about/author" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Srinath Gajji",
          jobTitle: "Founder and Editor, The Valuation Node | MBA Candidate, NIT Rourkela",
          email: "srinath@thevaluationnode.com",
          url: "https://thevaluationnode.com/about/author",
        })}</script>
      </Helmet>

      <nav className="border-b">
        <ol className="container max-w-3xl py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Author</li>
        </ol>
      </nav>

      <div className="container max-w-3xl py-12">
        {/* Photo placeholder */}
        <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center mb-6">
          <span className="text-xs text-muted-foreground text-center px-2">
            [Author photo placeholder]
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Srinath Gajji</h1>
        <p className="mt-1 text-muted-foreground">
          Founder and Editor, The Valuation Node | MBA Candidate, NIT Rourkela
        </p>

        {/* Bio */}
        <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
          {/* TODO: Author bio, 400-600 words. Srinath to fill. */}
          <p className="text-muted-foreground italic">
            [Author bio — 400-600 words. Srinath to fill.]
          </p>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://linkedin.com" // TODO: Replace with actual LinkedIn URL
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href="https://github.com" // TODO: Replace with actual GitHub URL
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a
            href="mailto:srinath@thevaluationnode.com"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" /> srinath@thevaluationnode.com
          </a>
          <a
            href="/resume.pdf" // TODO: Replace with actual resume PDF link
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" /> Resume (PDF placeholder)
          </a>
        </div>

        {/* Currently working on */}
        <section className="mt-10">
          <h2 className="font-semibold">Currently working on</h2>
          <ul className="mt-3 text-sm text-muted-foreground list-disc list-inside space-y-1">
            {/* TODO: Srinath to fill in 2-3 current projects */}
            <li>— [Current project 1 — Srinath to fill] —</li>
            <li>— [Current project 2 — Srinath to fill] —</li>
            <li>— [Current project 3 — Srinath to fill] —</li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
