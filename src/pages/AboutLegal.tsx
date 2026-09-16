import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { Prose } from "@/components/content/Prose";
import { staticMeta } from "@/lib/contentModel";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";

// Short, honest stubs for the pages the footer and sign-up form already linked
// to but which did not exist (audit item 8.2). Owner can expand the text; the
// structure, dates, and routing are what matter here.

interface LegalPage {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  body: string;
}

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "contact",
    title: "Contact",
    summary: "How to reach Gajji Srinath about the research, the learning library, corrections, or collaboration.",
    updated: "2026-09-16",
    body: `The Valuation Node is written and maintained by one person, so replies come from the author directly and can take a few days.

**Email:** [srinath@valuationnode.com](mailto:srinath@valuationnode.com)

**LinkedIn:** [linkedin.com/in/gajji-srinath](https://www.linkedin.com/in/gajji-srinath/)

## What to write about

- **Corrections.** If a number, a formula, or a claim on any page is wrong, say which page and what the source says. Corrections are logged on the page they affect.
- **Questions on a piece.** Happy to explain a method or an assumption further.
- **Collaboration and citations.** Academic and editorial use of the material is welcome with attribution; see the citation block at the end of each research piece.

## What not to expect

No stock recommendations, no portfolio reviews, and no paid placements. The [disclaimer](/about/disclaimer) explains why.`,
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary: "What The Valuation Node collects when you read, subscribe, or sign in, and what it does with it.",
    updated: "2026-09-16",
    body: `This site collects as little as it can and sells none of it.

## Reading

Page views are counted with [Umami](https://umami.is), a privacy-focused analytics tool that does not use cookies and does not build visitor profiles. It records the page, the referrer, the browser type, and the country. No personal data is stored.

## Newsletter

If you subscribe, your email address is held by the newsletter provider solely to send the newsletter. Every email carries an unsubscribe link, and unsubscribing removes the address.

## Accounts

If you create an account, your email address and profile details are stored with [Supabase](https://supabase.com), which hosts the site's database. Bookmarks, reading progress, and comments are tied to that account. You can delete the account from Settings; the data goes with it.

## Third parties

Fonts are served by Google Fonts, which sees the request for the font file. There are no advertising networks and no social tracking pixels on this site.

## Questions

Write to [srinath@valuationnode.com](mailto:srinath@valuationnode.com) or use the [contact page](/about/contact).`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary: "Everything on The Valuation Node is educational analysis, not investment advice. What that means in practice.",
    updated: "2026-09-16",
    body: `Everything published on The Valuation Node is educational analysis. It is not investment advice, it is not a recommendation to buy, sell, or hold any security, and it is not tailored to your circumstances.

## Who writes this

The site is written by an individual author who is not a SEBI-registered investment adviser or research analyst. Nothing here should be read as if it were.

## Sources and errors

Figures are drawn from company filings, exchange data, and the sources named on each page. They can be out of date and they can be wrong. Each research piece carries a "Where I might be wrong" section for that reason. If you find an error, [please report it](/about/contact).

## Your decisions

Investing in securities carries risk, including the loss of the money invested. Any decision you make after reading this site is your own. Consult a registered adviser before acting.

## Positions

The author may hold positions in securities discussed. Where that is the case for a specific research piece, it is stated on that piece.`,
  },
  {
    slug: "terms",
    title: "Terms of Use",
    summary: "The terms that apply to reading The Valuation Node and to using an account on it.",
    updated: "2026-09-16",
    body: `By using this site you agree to the terms below. They are short because the site is simple.

## Content

The articles, guides, glossary, formulas, and tools are the author's original work unless a source is credited. You may quote and link with attribution. You may not republish whole pieces, or present the material as your own, without permission.

## Tools and calculators

The calculators produce illustrative results from the inputs you give them. They simplify real-world tax, fees, and timing. Check any number that matters with a professional before relying on it.

## Accounts and community

If you create an account you are responsible for keeping your login private. Comments must be civil and on topic; the author may remove content or close accounts that are abusive, spam, or off topic.

## No advice

Nothing on the site is investment, legal, or tax advice. See the [disclaimer](/about/disclaimer).

## Changes

These terms may change. The date at the top of this page shows the current version.`,
  },
];

export default function AboutLegal() {
  const { page = "" } = useParams<{ page: string }>();
  const entry = LEGAL_PAGES.find((p) => p.slug === page);

  if (!entry) {
    return (
      <Layout>
        <div className="container max-w-3xl py-20 text-center text-sm text-muted-foreground">
          Page not found. <Link to={paths.about()} className="underline hover:text-foreground">Back to About</Link>
        </div>
      </Layout>
    );
  }

  const path = paths.aboutPage(entry.slug);

  return (
    <Layout>
      <Seo
        meta={staticMeta({ title: entry.title, slug: entry.slug, section: "about", subsection: entry.slug, summary: entry.summary, updatedDate: entry.updated })}
        path={path}
        jsonLd={[breadcrumbLd([{ name: "About", path: paths.about() }, { name: entry.title, path }])]}
      />
      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container flex max-w-3xl items-center gap-2 py-3 text-sm text-muted-foreground">
          <li><Link to={paths.about()} className="hover:text-foreground">About</Link></li>
          <li>/</li>
          <li className="font-medium text-foreground">{entry.title}</li>
        </ol>
      </nav>
      <article className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight">{entry.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {new Date(entry.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        <Prose className="mt-8">{entry.body}</Prose>
      </article>
    </Layout>
  );
}
