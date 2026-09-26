# Site Structure: The Valuation Node

What is on the site and where it lives. Current as of 2026-09-26, after the News and
Analysis sub-section changes. 401 pages are prerendered, 378 of them are in the sitemap
(the difference is empty landings, the Archive, and query pages, all noindex).

Source of truth in code: `src/lib/taxonomy.ts` (sections, sub-sections, tracks, tags),
`src/lib/contentIndex.ts` (every content page), `src/lib/routes.ts` (paths and legacy
redirects), `src/lib/siteRoutes.ts` (what prerenders and what enters the sitemap).

## URL scheme

```
/news/[sub]/[slug]        /analysis/[sub]/[slug]      /esg/[sub]
/vault/glossary/[term]    /vault/formulas/[name]      /vault/guides/[slug]
/vault/interactive/[slug] /about/[page]               /archive/[slug]
/tags/[tag]
```

Section and sub-section landings sit at `/news`, `/news/markets-news`, and so on.

## Navigation

`[Logo] | News & Trends | Insights & Analysis | ESG & Sustainability | The Vault | About | [Search]`

Archive and Topics are footer only. Below 900px the links collapse into the hamburger sheet.

## Top level

| Page | What it holds |
|---|---|
| `/` Home | Hero lead story, a 4-card news grid, a guides row, and a sidebar with Latest Updates, Trending Topics and the Weekly Briefing signup. |
| `/start-here` | Four reading paths (first financial statement, value a company, judge a stock, analyse a bank) plus the nine guide tracks. |
| `/search` | Full-page search across every term, formula, guide, tool and article. Ctrl+K opens the overlay anywhere. Noindex. |
| `/tags` | 40 topic archives, one page per tag, listing everything carrying it. |
| `/archive` | 11 older personal-finance articles, footer only, noindex and out of the sitemap. |
| Auth, account, admin | `/login`, `/signup`, `/dashboard`, `/settings`, `/admin/*`, `/community`, `/migration`. Not in nav, noindex. |

## 1. News & Trends (`/news`)

What is moving Indian and global markets, and what the rules say.

| Sub-section | Content today |
|---|---|
| Business News | coming soon |
| Markets News | Nifty 50 fundamentals screener. Live from Supabase with `stocks.json` as fallback. |
| Economy & Policy | Compliance Calendar. 8 SEBI, NSE and BSE circulars with due dates. |
| Corporate News | coming soon |
| ESG & Sustainability News | coming soon |
| Technology & AI | Aggregates the 6 Fintech guides from the Vault by the `fintech` tag. |

## 2. Insights & Analysis (`/analysis`)

Original research. 3 published, 6 drafts that never list publicly and never prerender.

| Sub-section | Content today |
|---|---|
| Company Analysis | coming soon |
| Industry Analysis | coming soon. 1 draft: why banks cannot be valued like normal companies. |
| Market Analysis | coming soon |
| Financial Analysis | 3 published: three years of cash flow versus one, ROE and DuPont compared, what a high P/E implies. 5 drafts: five red flags, profitable but out of cash, terminal value, credit ratings, the methodology note. |
| Economic Analysis | coming soon |
| ESG Analysis | coming soon |
| Business Case Studies | coming soon |

Articles are Markdown in `src/content/research/`, compiled to
`src/data/research.generated.ts` by `scripts/generateArticles.js` at build time. The
`hidden_articles` Supabase table can hide a published article without a rebuild.

## 3. ESG & Sustainability (`/esg`)

No pages of its own. Each sub-section pulls the relevant Vault guides in by tag, per the
aggregation rules in `contentIndex.ts`.

| Sub-section | Content today |
|---|---|
| Green Finance | Green Bonds |
| Corporate Governance | coming soon |
| Impact Investing | ESG-Integrated Valuation |
| ESG Ratings & Frameworks | ESG Fundamentals, Reporting Frameworks, Carbon Accounting, Climate Risk and Stranded Assets |

## 4. The Vault (`/vault`)

The reference library, and 307 of the site's pages.

### Financial Glossary (`/vault/glossary`), 178 terms

Plain definition, the formula where one exists, and an Indian example. Source:
`src/data/definitions.json`.

| Category | Terms | Category | Terms |
|---|---|---|---|
| Basics of Stock Market | 62 | Technical Analysis | 8 |
| Credit & Debt | 15 | Risk & Portfolio | 7 |
| Investment Planning | 13 | ESG & Governance | 6 |
| Valuation Ratios | 13 | Taxation | 5 |
| Profitability Ratios | 11 | Fundamentals | 5 |
| Regulatory Compliance | 10 | Fintech | 5 |
| Macroeconomics | 10 | Liquidity, Solvency, Mutual Funds, Efficiency, Indices | 8 |

### Key Formulas & Ratios (`/vault/formulas`), 49 ratios

One page each: the formula on one line, how to read it, and what a good number looks
like. Source: `src/data/ratioAnalysis.ts`.

| Group | Ratios |
|---|---|
| Size and Price Metrics | 13 |
| Profitability and Return | 8 |
| Leverage and Liquidity | 5 |
| Efficiency | 5 |
| Cash Flow Checks | 3 |
| Banking | 12 |
| Growth and Shareholding | 3 |

### Concept Guides (`/vault/guides`), 62 pages

51 topics, 9 track landings, and 2 restored courses (Fundamental Analysis, Technical
Analysis). Source: `src/data/foundationsTree.ts` and `foundationsContent*.ts`.

| Track | Topics |
|---|---|
| Accounting | 7 |
| Corporate Finance | 5 |
| Valuation | 6 |
| Financial Statement Analysis | 6 |
| Credit Analysis | 5 |
| Markets and Instruments | 6 |
| ESG and Sustainable Finance | 6 |
| Fintech and Digital Finance | 6 |
| Data and Tools for Finance | 4 |

### Model Templates & Interactive (`/vault/interactive`), 18 pages

13 calculators: DCF sensitivity, WACC, CAGR, SIP, step-up SIP, goal SIP, EMI, loan
prepayment, present value, future value, compound interest, rule of 72,
inflation-adjusted returns.

5 lessons: build a DCF, read an income statement, compute ratios, compare two companies,
spot the red flags.

## 5. About (`/about`)

Hub plus 7 pages: About the Site, About the Author, Editorial Philosophy, Contact,
Privacy, Disclaimer, Terms of Use.

## 6. Archive (`/archive`), 11 articles

Earlier personal-finance pieces from 2024, kept reachable so no URL breaks. Linked from
the footer, noindex, out of the sitemap, and they keep their quiz and bookmark features.
Source: `src/data/articles.ts`.

## Two rules that govern the whole map

1. **Teaching content lives in the Vault.** News, Analysis and ESG sub-sections with no
   article of their own aggregate Vault guides by tag rather than duplicating them. The
   rules are the `AGGREGATIONS` map in `src/lib/contentIndex.ts`.

2. **Empty means "coming soon", not hidden.** Every sub-section appears in the landing
   pills and the footer site map. An empty one carries a "coming soon" marker
   (`src/components/content/ComingSoonTag.tsx`), renders a "Coming soon..." landing, and
   stays noindex and out of the sitemap until it has content. It flips to indexed
   automatically once something publishes there, with no code change.

## Tags (40)

Cross-cutting, one archive page each at `/tags/[tag]`, defined in `src/lib/taxonomy.ts`:

valuation, dcf, relative-valuation, cost-of-capital, financial-statements, cash-flow,
earnings-quality, red-flags, ratios, profitability, leverage, liquidity, efficiency,
growth, banking, credit-risk, bonds, equities, derivatives, funds-and-etfs,
technical-analysis, esg, green-finance, corporate-governance, climate-risk,
esg-reporting, fintech, payments, digital-lending, blockchain, cybersecurity,
data-and-tools, excel, python, sql, personal-finance, taxation, regulation,
macroeconomics, indian-markets.

## Redirects

Every URL the site has ever used still resolves. 337 old paths carry a 301 to their
current home, listed in `public/_redirects` (read by Netlify before `netlify.toml`) and
mirrored client-side by `<LegacyRedirect/>` and `rewriteLegacyPath`. Links inside article
bodies are rewritten at render time by `Prose`, so no body text was edited. The families
covered: `/research/*`, `/learn/*` (glossary, ratio-analysis, foundations, by-doing,
legacy articles), `/tools/*`, `/markets/*`, both retired News taxonomies, both retired
Analysis sub-sections, and the old `/privacy`, `/disclaimer`, `/terms`,
`/about/methodology`.
