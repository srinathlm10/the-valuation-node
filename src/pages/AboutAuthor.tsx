import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Mail, Linkedin } from "lucide-react";

// Set to "/author-headshot.jpg" once a square photo is added to /public.
// Until then the initials avatar renders as the fallback.
const AUTHOR_PHOTO: string | null = null;

export default function AboutAuthor() {
  return (
    <Layout>
      <Helmet>
        <title>Gajji Srinath - The Valuation Node</title>
        <meta
          name="description"
          content="About Gajji Srinath, Founder of The Valuation Node, MBA candidate at NIT Rourkela."
        />
        <link rel="canonical" href="https://valuationnode.com/about/author" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Gajji Srinath",
          jobTitle: "Founder and Editor, The Valuation Node | MBA Candidate, NIT Rourkela",
          email: "srinath@valuationnode.com",
          url: "https://valuationnode.com/about/author",
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
        {/* Headshot slot */}
        {AUTHOR_PHOTO ? (
          <img
            src={AUTHOR_PHOTO}
            alt="Gajji Srinath, founder of The Valuation Node"
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md border"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center mb-6 shadow-md">
            <span className="text-2xl font-bold text-primary-foreground tracking-tight select-none">SG</span>
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight">Gajji Srinath</h1>
        <p className="mt-1 text-muted-foreground">
          Founder and Editor, The Valuation Node | MBA Candidate, NIT Rourkela
        </p>

        {/* Bio */}
        <div className="mt-6 prose prose-slate dark:prose-invert max-w-none font-serif prose-headings:font-sans">
          <p>
            I am Gajji Srinath, the founder and sole author of The Valuation Node. I am an
            MBA candidate at NIT Rourkela, and I write about Indian markets from first
            principles: valuation, credit, and the accounting that sits underneath both.
          </p>
          <p>
            This site is how I learn in public. Every Foundations topic, calculator, and
            research note here is something I needed to understand properly myself, written
            up so the next person can get there faster. The rule I hold myself to is simple:
            state the assumptions, show the math, cite the source, and say plainly where I
            might be wrong.
          </p>
          <p>
            Nothing on this site is investment advice. If you spot an error, I want to know
            about it; the fastest way to reach me is by email below.
          </p>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/in/gajji-srinath/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href="mailto:srinath@valuationnode.com"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Mail className="h-4 w-4" /> srinath@valuationnode.com
          </a>
        </div>

        {/* Currently working on */}
        <section className="mt-10">
          <h2 className="font-semibold">Currently working on</h2>
          <ul className="mt-3 text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Expanding the research library with verified real-company case studies</li>
            <li>Deepening Foundations topics with more worked Indian examples</li>
            <li>Growing the glossary and cross-linking it through every page</li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </Layout>
  );
}
