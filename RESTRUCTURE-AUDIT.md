# Restructure Audit: The Valuation Node

Phase 1 deliverable. Read-only; nothing in the codebase was changed to produce this.
Repo: `fin-bot-india/`. Audited at `main` commit `3924d46`; the `restructure` branch has not been created yet (file only, per your instruction).
Date: 2026-09-16.

## 1. Framework, build tool, routing

| Item | Finding |
|---|---|
| Framework | React 18.3.1 + TypeScript 5.8.3 (`strict: false`, `strictNullChecks: false`, `noImplicitAny: false`) |
| Build tool | Vite 7.3.1, `@vitejs/plugin-react-swc`; `lovable-tagger` in dev only |
| Styling | Tailwind 3.4 + `@tailwindcss/typography`, token palette in `src/index.css` (HSL vars, light "warm paper" / dark "deep slate", single teal accent), shadcn/ui primitives, `next-themes` for dark mode, Inter + Source Serif 4 from Google Fonts |
| Router | `react-router-dom` 6.30.3 data routes. `src/App.tsx` exports `routes: RouteRecord[]`; no `BrowserRouter` in app code |
| Static generation | `vite-react-ssg` 0.9.1-beta.1. `src/main.tsx` is `export const createRoot = ViteReactSSG({ routes })`. SSG supplies the router and the `HelmetProvider` |
| Head management | `react-helmet-async` 1.3.0 (pinned; 3.x crashes the SSG). Site-wide OG defaults in `src/components/layout/Layout.tsx`; per-page `<Helmet>` in each page |
| Prerender rules | `vite.config.ts` `ssgOptions.dirStyle: "nested"`, `includedRoutes()` drops `NO_PRERENDER_EXACT` (auth, dashboard, settings, migration, 7 legacy paths) and `NO_PRERENDER_PREFIX` (`/admin`, `/community`) |
| Dynamic prerender | `getStaticPaths` on `research/:slug` (dated and not in Supabase `hidden_articles`), `learn/foundations/:section/:topic` (51), `learn/glossary/:termSlug` (178 entries, 173 unique slugs), `learn/ratio-analysis/:slug` (49), `tools/:slug` (12 hard-coded) |
| Build pipeline | `npm run build` = `scripts/generateArticles.js` (research .md to `src/data/research.generated.ts`) then `scripts/generateSitemap.js` then `scripts/generateOgImage.js` (sharp, single site-wide image) then `vite-react-ssg build`. Output: 310 `index.html` files |
| Hosting | Netlify (`netlify.toml`): security headers, immutable cache for `/assets/*`, seven 301 redirects for legacy paths, SPA fallback. `public/_redirects` also defines the SPA fallback (see 7.4, it very likely defeats the 301s). `vercel.json` is a leftover with different headers (`X-Frame-Options: DENY` vs Netlify `SAMEORIGIN`) |
| Data backend | Supabase (`src/integrations/supabase/client.ts`, PKCE, env `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`). Public content no longer depends on it except the Nifty 50 table and the `hidden_articles` visibility flag. Auth, profiles, bookmarks, comments, quizzes, chat sessions, legacy `articles` table remain in Supabase |
| Analytics | Umami (`index.html`), plus `window.umami.track` calls in `ContinueReading`, lessons, `AuthCallback` |
| Tests | `vitest`; the only suite is `src/lib/dcf.test.ts` |
| Lockfiles | Both `bun.lockb` and `package-lock.json` present |

## 2. Rendering mode

Statically generated at build time for every public content page (310 HTML files), hydrated
client-side. Client-rendered only: auth pages, `/dashboard`, `/settings`, `/admin/*`,
`/community/*`, `/migration`, `/learn/foundations/:section` (route exists, no
`getStaticPaths`), `/learn/by-doing/:slug` catch-all, `/learn/:slug` legacy article view,
`*` 404, and the 5 undated research drafts. Because `public/_redirects` serves
`/index.html` with HTTP 200 for any unknown path, every client-only URL and every 404 is
delivered to crawlers as a copy of the home page HTML (soft-404, canonical pointing to `/`).

`/markets/nifty50` prerenders only a spinner; its table is fetched from Supabase at runtime
(and currently crashes, see 8.1).

## 3. Content inventory

Word counts are body-text words after stripping markdown. "Image" means a page-specific
featured image; every page today falls back to the single site-wide `/og-image.png`, and no
content page anywhere has an inline image. Totals at the end of this section.

### 3.1 Research articles (`src/content/research/*.md`, 9 files)
| Current URL | Title | Published | Reviewed | Words | Category / tags | Image | Status |
|---|---|---|---|---|---|---|---|
| /research/how-the-valuation-node-approaches-research | How The Valuation Node Approaches Research | 2026-07-01 | 2026-07-06 | 298 | Methodology / none | no | published |
| /research/three-years-cash-flow-what-one-year-hides | What Three Years of a Cash Flow Statement Reveals That One Year Hides | 2026-03-19 | 2026-03-19 | 918 | Valuation / cash flow statement, earnings quality, free cash flow, financial analysis | no | published |
| /research/roe-comparison-dupont-why-higher-isnt-better | Comparing Two Companies on ROE, and Why the Higher One Is Not Always Better | 2026-02-11 | 2026-02-11 | 825 | Valuation / ROE, DuPont analysis, financial ratios, leverage, equity analysis | no | published |
| /research/high-pe-what-it-implies-and-when-its-a-trap | What a High P/E Actually Implies, and When It Is a Trap | 2026-01-14 | 2026-01-14 | 999 | Valuation / P/E ratio, valuation, market expectations, equity analysis | no | published |
| /research/five-red-flags-financial-statements | Five Red Flags in a Set of Financial Statements | placeholder | placeholder | 839 | Valuation / red flags, earnings quality, forensic accounting, financial analysis | no | hidden draft |
| /research/profitable-but-out-of-cash | Why a Company Can Be Profitable and Still Run Out of Cash | placeholder | placeholder | 936 | Valuation / cash flow, working capital, earnings quality, financial analysis | no | hidden draft |
| /research/terminal-value-dominates-valuations | How Terminal Value Quietly Dominates Most Valuations | placeholder | placeholder | 829 | Valuation / DCF, terminal value, valuation, discount rate | no | hidden draft |
| /research/what-credit-ratings-measure-and-miss | What a Credit Rating Really Measures, and What It Misses | placeholder | placeholder | 818 | Credit / credit rating, credit analysis, default risk, fixed income | no | hidden draft |
| /research/why-banks-cannot-be-valued-like-normal-companies | Why Banks Cannot Be Valued Like Normal Companies | placeholder | placeholder | 931 | Sector / bank valuation, P/B ratio, financial sector, valuation methods | no | hidden draft |

Front-matter present on all 9: `title, slug, category, author: Gajji Srinath, readingTime, excerpt (23 to 31 words), metaTitle, metaDescription, methodologySummary, ogImage: /og-image.png`. The 8 non-methodology pieces also carry `tags`, `whereIMightBeWrong` (62 to 91 words), `isResearch`. Only the Methodology piece has `keyTakeaways`, `citationFormat`, `canonical`. "placeholder" = `INSERT_HONEST_DATE`, which `generateArticles.js` drops, so drafts have no `publishedAt` at all. Pipeline: `scripts/generateArticles.js` to `src/data/research.generated.ts` (`ResearchArticleData` in `src/data/researchTypes.ts`: slug, title, excerpt, category, tags, metaTitle, metaDescription, canonical, ogImage, publishedAt, updatedAt, readingTime, author, methodologySummary, whereIMightBeWrong, citationFormat, modelDownloadUrl, githubUrl, updateLog, keyTakeaways, content).

### 3.2 Foundations topics (51, `src/pages/Foundations.tsx` tree + `src/data/foundationsContentPart1/2/3.ts`)
Content shape per topic: `readingTime` (string), `lastReviewed` ("July 2025" on all 51, display text, not a date), `prerequisites[]`, `intuition`, `mechanics`, `deepDive` (markdown), `commonMistakes` (3 each), optional `tryItHref`. No publish date, no image, all `published: true`, all prerendered. Category = section label. URL prefix `/learn/foundations/`.

| # | URL (after prefix) | Title | Section | Read | Words | Prereqs | Try it |
|---|---|---|---|---|---|---|---|
| 1 | accounting/reading-an-income-statement | Reading an Income Statement | Accounting | 8 min | 507 | none | no |
| 2 | accounting/reading-a-balance-sheet | Reading a Balance Sheet | Accounting | 9 min | 447 | 1 | no |
| 3 | accounting/reading-a-cash-flow-statement | Reading a Cash Flow Statement | Accounting | 8 min | 480 | 2 | /tools/future-value |
| 4 | accounting/linking-the-three-statements | Linking the Three Statements | Accounting | 10 min | 498 | 3 | no |
| 5 | accounting/ind-as-vs-ifrs-vs-indian-gaap | Ind AS vs IFRS vs Indian GAAP | Accounting | 7 min | 482 | 2 | no |
| 6 | accounting/common-adjustments | Common Adjustments (leases, ESOPs, one-offs) | Accounting | 9 min | 534 | 2 | no |
| 7 | accounting/quality-of-earnings | Quality of Earnings | Accounting | 10 min | 555 | 3 | no |
| 8 | corporate-finance/time-value-of-money | Time Value of Money | Corporate Finance | 8 min | 530 | none | /tools/future-value |
| 9 | corporate-finance/cost-of-capital | Cost of Capital (Debt, Equity, WACC) | Corporate Finance | 11 min | 582 | 2 | /tools/wacc |
| 10 | corporate-finance/capital-structure | Capital Structure | Corporate Finance | 9 min | 536 | 2 | /tools/wacc |
| 11 | corporate-finance/working-capital | Working Capital | Corporate Finance | 8 min | 547 | 2 | no |
| 12 | corporate-finance/capital-budgeting | Capital Budgeting (NPV, IRR, Payback) | Corporate Finance | 9 min | 530 | 2 | /tools/present-value |
| 13 | valuation/dcf-theory-and-mechanics | DCF: Theory and Mechanics | Valuation | 12 min | 594 | 3 | /tools/dcf-sensitivity |
| 14 | valuation/relative-valuation | Relative Valuation (P/E, EV/EBITDA, P/B, EV/Sales) | Valuation | 10 min | 540 | 2 | no |
| 15 | valuation/sum-of-the-parts | Sum-of-the-Parts | Valuation | 8 min | 485 | 2 | no |
| 16 | valuation/sector-specific-valuation | Sector-Specific Valuation (Banks, Insurance, Real Estate) | Valuation | 11 min | 542 | 3 | no |
| 17 | valuation/terminal-value-approaches | Terminal Value Approaches | Valuation | 9 min | 593 | 2 | no |
| 18 | valuation/common-dcf-mistakes | Common DCF Mistakes | Valuation | 8 min | 615 | 3 | no |
| 19 | financial-statement-analysis/profitability-ratios | Profitability Ratios | FSA | 9 min | 506 | 2 | no |
| 20 | financial-statement-analysis/liquidity-ratios | Liquidity Ratios | FSA | 6 min | 543 | 2 | no |
| 21 | financial-statement-analysis/solvency-ratios | Solvency Ratios | FSA | 7 min | 554 | 2 | no |
| 22 | financial-statement-analysis/efficiency-ratios | Efficiency Ratios | FSA | 7 min | 524 | 2 | no |
| 23 | financial-statement-analysis/market-ratios | Market Ratios | FSA | 7 min | 561 | 2 | no |
| 24 | financial-statement-analysis/dupont-decomposition | DuPont Decomposition | FSA | 8 min | 539 | 3 | no |
| 25 | credit-analysis/credit-risk-fundamentals | Credit Risk Fundamentals | Credit Analysis | 9 min | 564 | 2 | no |
| 26 | credit-analysis/reading-crisil-icra-moodys-reports | Reading CRISIL, ICRA, Moody's Reports | Credit Analysis | 8 min | 586 | 2 | no |
| 27 | credit-analysis/altman-z-score | Altman Z-Score and Distress Models | Credit Analysis | 7 min | 531 | 3 | no |
| 28 | credit-analysis/bond-pricing-and-yields | Bond Pricing and Yields | Credit Analysis | 10 min | 556 | 2 | /tools/present-value |
| 29 | credit-analysis/covenants-and-triggers | Covenants and Triggers | Credit Analysis | 7 min | 576 | 2 | no |
| 30 | markets-and-instruments/equities | Equities (NSE, BSE, IPO Process) | Markets and Instruments | 9 min | 596 | 2 | no |
| 31 | markets-and-instruments/debt-markets-and-yield-curves | Debt Markets and Yield Curves | Markets and Instruments | 10 min | 626 | 2 | /tools/inflation-adjusted-returns |
| 32 | markets-and-instruments/derivatives | Derivatives (Futures, Options, Swaps) | Markets and Instruments | 10 min | 609 | 2 | no |
| 33 | markets-and-instruments/mutual-funds-etfs-aifs | Mutual Funds, ETFs, AIFs | Markets and Instruments | 9 min | 613 | 2 | /tools/sip |
| 34 | markets-and-instruments/reits-and-invits | REITs and InvITs | Markets and Instruments | 8 min | 615 | 2 | no |
| 35 | markets-and-instruments/technical-analysis-primer | Technical Analysis Primer | Markets and Instruments | 7 min | 563 | 1 | no |
| 36 | esg-and-sustainable-finance/esg-fundamentals | ESG Fundamentals | ESG | 8 min | 526 | 2 | no |
| 37 | esg-and-sustainable-finance/reporting-frameworks | Reporting Frameworks (BRSR, SASB, ISSB) | ESG | 8 min | 512 | 1 | no |
| 38 | esg-and-sustainable-finance/carbon-accounting | Carbon Accounting | ESG | 8 min | 587 | 2 | no |
| 39 | esg-and-sustainable-finance/green-bonds | Green Bonds and Sustainability-Linked Debt | ESG | 7 min | 595 | 2 | no |
| 40 | esg-and-sustainable-finance/esg-integrated-valuation | ESG-Integrated Valuation | ESG | 9 min | 609 | 3 | no |
| 41 | esg-and-sustainable-finance/climate-risk-and-stranded-assets | Climate Risk and Stranded Assets | ESG | 9 min | 618 | 3 | no |
| 42 | fintech-and-digital-finance/payments-landscape | Payments Landscape (UPI, Cards, Wallets) | Fintech | 9 min | 546 | none | no |
| 43 | fintech-and-digital-finance/digital-lending-models | Digital Lending Models | Fintech | 9 min | 651 | 2 | no |
| 44 | fintech-and-digital-finance/credit-scoring | Credit Scoring (Traditional and Alt-Data) | Fintech | 8 min | 591 | 2 | no |
| 45 | fintech-and-digital-finance/blockchain-and-defi-primer | Blockchain and DeFi Primer | Fintech | 8 min | 612 | 1 | no |
| 46 | fintech-and-digital-finance/cybersecurity-in-financial-systems | Cybersecurity in Financial Systems | Fintech | 7 min | 588 | 2 | no |
| 47 | fintech-and-digital-finance/account-aggregators | Account Aggregators | Fintech | 7 min | 625 | 3 | no |
| 48 | data-and-tools/excel-modeling-conventions | Excel Modeling Conventions | Data and Tools | 8 min | 599 | none | no |
| 49 | data-and-tools/python-for-finance | Python for Finance (pandas, yfinance, numpy) | Data and Tools | 9 min | 520 | 1 | no |
| 50 | data-and-tools/sql-for-finance-data | SQL for Finance Data | Data and Tools | 8 min | 624 | 1 | no |
| 51 | data-and-tools/where-to-find-indian-markets-data | Where to Find Indian Markets Data | Data and Tools | 7 min | 588 | 1 | no |

Totals: 28,650 words, average 562 (min 447, max 651). By section: Accounting 3,503 (7), Corporate Finance 2,725 (5), Valuation 3,369 (6), FSA 3,227 (6), Credit 2,813 (5), Markets 3,622 (6), ESG 3,447 (6), Fintech 3,613 (6), Data and Tools 2,331 (4). 9 of 51 link to a tool; the other 42 render "Interactive exercises coming soon." Per-topic SEO (`FoundationsLeaf.tsx`): title = label, description = first 155 chars of `intuition` via `metaFromMarkdown`, canonical + og:url, `LearningResource` JSON-LD (no dates, no image), `BreadcrumbList`. The 9 section URLs `/learn/foundations/{section}` route to the hub component, are not prerendered and not in the sitemap.

### 3.3 Learn-by-Doing (5 modules, `src/pages/LearnByDoing.tsx`, all `live: true`)
| URL | Title | Steps | Lesson component | Est. words | Meta |
|---|---|---|---|---|---|
| /learn/by-doing/build-a-dcf | Build a DCF, Step by Step | 8 | `components/learn/BuildADcfLesson.tsx` (1,122 lines) | ~2,320 | title, desc, canonical, og:title/desc, LearningResource |
| /learn/by-doing/read-an-income-statement | Read an Income Statement, Line by Line | 13 | `ReadIncomeStatementLesson.tsx` | ~590 | same |
| /learn/by-doing/compute-ratios | Compute Ratios from Raw Statements | 6 | `ComputeRatiosLesson.tsx` | ~640 | same |
| /learn/by-doing/compare-two-companies | Compare Two Companies Side by Side | 6 | `CompareCompaniesLesson.tsx` | ~650 | same |
| /learn/by-doing/spot-the-red-flags | Spot the Red Flags | 3 cases | `SpotRedFlagsLesson.tsx` | ~860 | same |

No dates, no images. ~5,070 lesson words plus ~700 in page wrappers. Catch-all `/learn/by-doing/:slug` renders a 51-word "coming soon" stub.

### 3.4 Glossary (`src/data/definitions.json`, 178 entries, 173 reachable URLs)
Keys on all 178: `id, term, fullName, category, definition, formula, whyItMatters, example, relatedTerms`. Formula non-empty on 152 (26 empty strings). Average definition 17.8 words (3,162 total; 9,926 across all four text fields); 62 definitions under 15 words. `relatedTerms` has 440 links of which 235 name terms that do not exist. No dates, no images.

Per category: Basics of Stock Market 62, Credit and Debt 15, Investment Planning 13, Valuation Ratios 13, Profitability Ratios 11, Regulatory Compliance 10, Macroeconomics 10, Technical Analysis 8, Risk and Portfolio 7, ESG and Governance 6, Taxation 5, Fundamentals 5, Fintech 5, Liquidity Ratios 2, Solvency Ratios 2, Mutual Funds 2, Efficiency Ratios 1, Indices 1.

Slug collisions (second entry unreachable): demat-account (`demat` Regulatory Compliance vs `demat-account` Basics), ltcg (`ltcg` Taxation vs `ltcg-stock` Basics), market-cap (`market-cap` Fundamentals vs `market-cap-2` Basics), book-value (`book-value` vs `book-value-2`), face-value (`face-value` vs `face-value-basics`).

Full per-term table (term, category, definition words, formula present, reachable) is appended as `Appendix A` at write time from a read-only script over `definitions.json`.

### 3.5 Ratio Analysis (`src/data/ratioAnalysis.ts`, 49 entries, 7 groups, all prerendered)
| # | URL (/learn/ratio-analysis/) | Name | Group | Words | Formulas | Caution |
|---|---|---|---|---|---|---|
| 1 | market-capitalisation | Market Capitalisation | size-and-price | 250 | 1 | yes |
| 2 | enterprise-value | Enterprise Value | size-and-price | 287 | 1 | yes |
| 3 | earnings-per-share | Earnings Per Share | size-and-price | 209 | 1 | yes |
| 4 | pe-ratio | PE Ratio | size-and-price | 396 | 1 | yes |
| 5 | price-to-book | Price to Book Ratio | size-and-price | 318 | 2 | yes |
| 6 | peg-ratio | PEG Ratio | size-and-price | 308 | 1 | yes |
| 7 | price-to-cash-flow | Price to Cash Flow Ratio | size-and-price | 225 | 1 | no |
| 8 | price-to-sales | Price to Sales Ratio | size-and-price | 256 | 2 | yes |
| 9 | ev-to-ebitda | EV to EBITDA | size-and-price | 254 | 2 | yes |
| 10 | ev-to-sales | EV to Sales | size-and-price | 147 | 1 | no |
| 11 | earnings-yield | Earnings Yield | size-and-price | 205 | 2 | no |
| 12 | fcf-yield | Free Cash Flow Yield | size-and-price | 185 | 1 | no |
| 13 | dividend-yield | Dividend Yield | size-and-price | 396 | 2 | yes |
| 14 | net-profit-margin | Net Profit Margin | profitability-and-returns | 263 | 2 | yes |
| 15 | return-on-equity | Return on Equity | profitability-and-returns | 395 | 2 | yes |
| 16 | return-on-capital-employed | Return on Capital Employed | profitability-and-returns | 285 | 2 | yes |
| 17 | gross-margin | Gross Margin | profitability-and-returns | 185 | 1 | no |
| 18 | operating-margin | Operating Margin | profitability-and-returns | 174 | 1 | no |
| 19 | ebitda-margin | EBITDA Margin | profitability-and-returns | 248 | 2 | yes |
| 20 | return-on-assets | Return on Assets | profitability-and-returns | 225 | 1 | yes |
| 21 | dividend-payout-ratio | Dividend Payout Ratio | profitability-and-returns | 232 | 2 | no |
| 22 | debt-to-equity | Debt to Equity Ratio | leverage-and-liquidity | 217 | 1 | yes |
| 23 | interest-coverage | Interest Coverage Ratio | leverage-and-liquidity | 187 | 1 | yes |
| 24 | quick-ratio | Quick Ratio | leverage-and-liquidity | 152 | 2 | no |
| 25 | current-ratio | Current Ratio | leverage-and-liquidity | 260 | 1 | yes |
| 26 | net-debt-to-ebitda | Net Debt to EBITDA | leverage-and-liquidity | 264 | 1 | yes |
| 27 | asset-turnover | Asset Turnover | efficiency | 222 | 1 | no |
| 28 | cash-conversion-cycle | Cash Conversion Cycle | efficiency | 243 | 1 | yes |
| 29 | dupont-analysis | DuPont Analysis | efficiency | 199 | 2 | no |
| 30 | working-capital-days | Working Capital Days | efficiency | 249 | 3 | yes |
| 31 | fixed-asset-turnover | Fixed Asset Turnover | efficiency | 192 | 1 | no |
| 32 | cfo-to-pat | CFO to PAT Ratio | cash-flow | 298 | 1 | no |
| 33 | free-cash-flow | Free Cash Flow | cash-flow | 348 | 1 | no |
| 34 | cash-flow-per-share | Cash Flow per Share | cash-flow | 194 | 2 | no |
| 35 | casa-ratio | CASA Ratio | banking | 240 | 1 | yes |
| 36 | cost-of-funds | Cost of Funds | banking | 142 | 1 | no |
| 37 | net-npa | Net NPA Ratio | banking | 186 | 1 | yes |
| 38 | advances-growth | Advances Growth | banking | 135 | 1 | no |
| 39 | capital-adequacy-ratio | Capital Adequacy Ratio | banking | 145 | 1 | no |
| 40 | net-interest-margin | Net Interest Margin | banking | 159 | 2 | no |
| 41 | return-on-assets-bank | Return on Assets (Banks) | banking | 157 | 1 | no |
| 42 | common-size-analysis-banks | Common-Size Analysis (Banks) | banking | 451 | 2 | no |
| 43 | gross-npa | Gross NPA Ratio | banking | 227 | 1 | no |
| 44 | provision-coverage-ratio | Provision Coverage Ratio | banking | 221 | 1 | no |
| 45 | cost-to-income-ratio | Cost to Income Ratio | banking | 218 | 1 | no |
| 46 | credit-deposit-ratio | Credit to Deposit Ratio | banking | 250 | 1 | no |
| 47 | sales-growth | Sales Growth | growth-and-shareholding | 264 | 2 | yes |
| 48 | profit-growth | Profit Growth | growth-and-shareholding | 258 | 2 | yes |
| 49 | promoter-holding | Promoter Holding | growth-and-shareholding | 310 | 2 | yes |

Totals: 11,831 words, average 241. No dates, no images. Entry meta: title, description (= definition), canonical, og:title/desc/url, DefinedTerm + BreadcrumbList.

### 3.6 Tools (13 pages: 12 in `ToolPage.tsx` `TOOL_META` + `DcfSensitivityPage.tsx`)
| URL | Title | Category | Explanatory words | Linked Foundations topic |
|---|---|---|---|---|
| /tools/dcf-sensitivity | DCF Sensitivity Calculator | Valuation | ~330 | 4 links |
| /tools/cagr | CAGR Calculator | Valuation | 63 | market-ratios |
| /tools/wacc | WACC Calculator | Valuation | 161 | cost-of-capital |
| /tools/sip | SIP Calculator | Investment Planning | 100 | time-value-of-money |
| /tools/future-value | Future Value Calculator | Investment Planning | 83 | time-value-of-money |
| /tools/present-value | Present Value Calculator | Investment Planning | 70 | dcf-theory-and-mechanics |
| /tools/compound-interest | Compound Interest Calculator | Investment Planning | 53 | time-value-of-money |
| /tools/rule-of-72 | Rule of 72 | Investment Planning | 70 | time-value-of-money |
| /tools/step-up-sip | Step-Up SIP Calculator | Investment Planning | 156 | time-value-of-money |
| /tools/goal-sip | Goal SIP Calculator | Investment Planning | 142 | time-value-of-money |
| /tools/emi | EMI Calculator | Loans | 217 | cost-of-capital |
| /tools/loan-prepayment | Loan Prepayment Calculator | Loans | 165 | cost-of-capital |
| /tools/inflation-adjusted-returns | Inflation-Adjusted Returns Calculator | Risk | 193 | debt-markets-and-yield-curves |

About 1,800 words in total; five tools have 70 words or fewer. No dates, no images. `WebApplication` + `BreadcrumbList` JSON-LD on 12; none on dcf-sensitivity.

### 3.7 Markets (3 pages)
| URL | Source | Words | Notes |
|---|---|---|---|
| /markets | `Markets.tsx` | ~57 | Hub with 2 cards; claims "all 50 constituents" |
| /markets/nifty50 | Supabase `stocks` table via `contentService.getStocks()`; `src/data/stocks.json` (20 rows, 15 fields, 11 sectors) mirrors the seed | ~0 static | Prerenders heading + spinner; crashes at runtime (8.1); "Snapshot as of" reads a non-existent `last_updated` column |
| /markets/compliance | `src/data/circulars.json` | ~270 | 8 circulars (SEBI 4, NSE 2, BSE 2), dates 2026-01-10 to 2026-01-28, fields id, title, source, category, date, summary, botSummary, pdfUrl, tags |

### 3.8 About (4 pages, no dates, no images, `AUTHOR_PHOTO = null`)
| URL | Title | Words | Notes |
|---|---|---|---|
| /about | About | 48 | Hub, 3 cards, Person JSON-LD; near-stub |
| /about/author | Gajji Srinath | 170 | Bio, LinkedIn, email, "Currently working on"; Person JSON-LD; "SG" placeholder avatar |
| /about/site | About this site | 154 | Mission, 6 principles, disclosure, contact |
| /about/methodology | Methodology | 349 | 6 sections: default DCF, WACC, leases under Ind AS, one-offs, data sources, ESG stance |

### 3.9 Home (`/`, `src/pages/Index.tsx`)
Hero (~30 words, CTAs to newest research and `/learn`); featured = `RESEARCH_ARTICLES[0]`; 3 recent dated articles; 4 hard-coded library cards (DCF theory, Reading an Income Statement, Credit Risk Fundamentals, Build a DCF); author blurb; newsletter. ~120 static words. Organization JSON-LD.

### 3.10 Legacy content not on any public route
`src/data/articles.ts`: 11 personal-finance articles dated 2024 (2,235 words), categories investing, budgeting, credit, retirement, taxes, fundamental-analysis, technical-analysis, with `imageUrl`, `keyTakeaways`, `relatedArticleIds`. Only `/learn/:slug` (broken) and the hidden `/migration` touch them; `Article.tsx`, `Categories.tsx`, `Category.tsx`, `Learn.tsx`, `Stocks.tsx`, `Compliance.tsx`, `Calculators.tsx`, `FundamentalAnalysis.tsx` (~1,200 words of course text), `TechnicalAnalysis.tsx` (~1,300 words) are orphaned. `src/data/quizzes.ts`: 13 quizzes (fallback for `quizService`). Supabase: `articles` (with research columns added 2026-06-24; `citation_format` trigger still points at `thevaluationnode.com`), `definitions`, `stocks` (20 seeded), `hidden_articles`; `supabase/content_expansion.sql` seeds 3 more legacy articles (author "FinBot Team") and 10 definitions. No `circulars` or `categories` DDL in the repo.

Public content today depends on Supabase only for: the `hidden_articles` flag (fails open), the Nifty 50 table, and the broken legacy `/learn/:slug`.

### 3.11 Totals
| Block | Public pages | Words |
|---|---|---|
| Research (published / drafts) | 4 / 5 | 3,040 / 4,353 |
| Foundations | 51 (+1 hub) | 28,650 |
| Learn-by-Doing | 5 (+1 hub) | ~5,070 |
| Glossary | 173 (+1 hub) | 3,162 definitions, 9,926 all fields |
| Ratio Analysis | 49 (+1 hub) | 11,831 |
| Tools | 13 (+1 hub) | ~1,800 |
| Markets | 3 | ~350 |
| About | 4 | 721 |
| Home, Learn hub, Research hub | 3 | ~300 |
| Legacy (unrouted) | 0 | 2,235 + ~2,500 course text |
| **Prerendered total** | **310** | **about 66,000 (62,000 excluding drafts)** |

Sitemap: 315 URLs = 310 + 5 duplicated glossary URLs.

## 4. Layout and component files

### `src/components/layout/`
| File | Purpose |
|---|---|
| `Layout.tsx` | Helmet OG defaults + `Header` + `<main>` + `Footer`; wraps 43 pages |
| `Header.tsx` | Sticky header: logo, 5 nav links, theme toggle, search icon (opens `GlobalSearch` bar), Subscribe anchor, user menu or Sign in, mobile Sheet. Imports an unused `Bell` icon |
| `Footer.tsx` | 3 columns (brand, Navigation, Connect) + disclaimer line with links to `/disclaimer` and `/privacy` (neither route exists) |
| `ScrollToTop.tsx` | Scroll to top on PUSH/REPLACE navigation, not POP |
| `ThemeToggle.tsx` | Sun/Moon toggle using CSS `dark:` classes to avoid hydration mismatch |

### `src/components/content/` (shared content primitives, all live)
`Prose.tsx` (single react-markdown renderer: GFM, router-aware links, heading ids, `slugify`), `Callout.tsx` (note/info/methodology/warning/danger/success), `CollapsibleSection.tsx`, `EmptyState.tsx`, `ReadingProgress.tsx`, `Reveal.tsx` (IntersectionObserver fade-up, prerender-safe), `TableOfContents.tsx` (`tocFromMarkdown`).

### `src/components/research/`
`ContinueReading.tsx`: related-research cards by category/tag overlap, excludes drafts and hidden; used on 6 page types.

### `src/components/learn/`
`BuildADcfLesson.tsx` (1,122 lines, 8-step DCF with recharts and Excel export), `ReadIncomeStatementLesson.tsx`, `ComputeRatiosLesson.tsx`, `CompareCompaniesLesson.tsx` (radar chart quiz), `SpotRedFlagsLesson.tsx`, `RelatedTopics.tsx` (prerequisite graph + same-section links). `DefinitionsGrid.tsx` is a second, legacy glossary UI (Supabase-shaped) used only by the orphaned `Learn.tsx`.

### `src/components/calculators/` and `tools/`
`FormulaCalculators.tsx` (873 lines, 12 calculators with `NumericInput` slider), `tools/DcfSensitivityCalculator.tsx` (654 lines, KaTeX, 5x5 grid, xlsx export).

### `src/components/search/`
`GlobalSearch.tsx`: Cmd-K dialog over `circulars.json`, `stocks.json`, `definitions.json`; navigates to `/compliance/:id`, `/stocks/:id`, `/learn/:id`, `/calculators/:id`, all dead paths; only lists the first 4 items per source.

### `src/components/newsletter/`
`NewsletterSignup.tsx`: POSTs to Buttondown with a client-side `VITE_BUTTONDOWN_API_KEY` (absent from `.env`, so every submit fails with "Newsletter is not configured yet"). 17 importers.

### `src/components/auth/`, `admin/`, `community/`, `chat/`, `quiz/`, `compliance/`, `stocks/`, `articles/`, `gamification/`
| File | Purpose | Reachable from live nav? |
|---|---|---|
| `auth/ProtectedRoute.tsx`, `auth/AdminRoute.tsx` | Identical gate logic (duplicate) | yes (dashboard, settings, admin) |
| `auth/AuthSocial.tsx`, `auth/PhoneLogin.tsx` | Google OAuth button, phone OTP form | unused |
| `admin/AdminLayout.tsx`, `AdminDashboard.tsx`, `ContentManager.tsx`, `ArticleList.tsx`, `ArticleEditor.tsx`, `CommentsManager.tsx`, `EmbeddingManager.tsx` | Admin shell for the legacy Supabase `articles` table (categories investing/budgeting/taxes/retirement/credit), comment moderation, RAG embeddings | `/admin` only |
| `admin/EmbeddingAdmin.tsx` | Second embeddings UI, duplicate of `EmbeddingManager`; rendered inside user `/settings` for every logged-in user, no role check | yes (bug, 8.10) |
| `community/CreatePostDialog.tsx`, `ReportCommentDialog.tsx` | Forum dialogs | `/community` (hidden) |
| `chat/ChatSidebar.tsx` (563 lines), `chat/FloatingChat.tsx` | FinBot RAG chat; FloatingChat is unused | legacy ArticleView + orphan pages |
| `quiz/Quiz.tsx` | Supabase quiz with confetti | legacy ArticleView + orphan pages |
| `compliance/ComplianceFeed.tsx` | Circular cards grid | `/markets/compliance` |
| `stocks/StockScreener.tsx` | Sortable table; requires `stocks`, `onBotAnalysis`, `onViewProfile` props | `/markets/nifty50` (props not passed, crashes) |
| `articles/ArticleCard.tsx`, `articles/CategoryCard.tsx` | Link to `/article/:id` and `/categories/:id`, routes that do not exist | Dashboard bookmarks (404) |
| `gamification/BadgeCard.tsx` | Badge card | unused |
| `NavLink.tsx` (root of components) | forwardRef NavLink wrapper | unused |

### `src/components/ui/` (49 shadcn primitives)
21 are not imported outside `ui/`: alert-dialog, aspect-ratio, breadcrumb, calendar, carousel, chart, collapsible, context-menu, drawer, hover-card, menubar, navigation-menu, pagination, popover, resizable, sidebar (637 lines), skeleton, switch, toggle, toggle-group, use-toast shim.

### `src/lib/`
`articleVisibility.ts` (hidden_articles hooks), `chartTheme.ts`, `dcf.ts` + test, `glossary.ts` (`GLOSSARY`, `findTerm`, `termSlug`), `learnDcfCompanies.ts`, `learnFinancials.ts` (has a `c.pat` type bug), `relatedContent.ts` (section/category maps, `TOOL_DIRECTORY`, `getRelatedTools`, `termSlug`), `seo.ts` (`breadcrumbLd`, `PUBLISHER`, `metaFromMarkdown`), `siteIcons.ts` (central lucide registry), `utils.ts`.

### `src/hooks/`, `src/contexts/`, `src/services/`
`use-mobile.tsx`, `use-toast.ts`, `useAuth.ts` (shim), `useBookmarks.ts`; `AuthContext.tsx` (session + `profiles.role`); services for chat, community, legacy content, gamification (unused), progress, quiz, all Supabase.

### `src/data/`
`definitions.json` (178), `ratioAnalysis.ts` (49), `foundationsContent.ts` + `Part1/2/3.ts` (51 topics), `research.generated.ts` (auto, 9), `researchTypes.ts`, `circulars.json` (8), `stocks.json` (20, not 50), `articles.ts` (684 lines legacy personal-finance articles), `quizzes.ts` (1,005 lines), `learnDcfCompanies`.

### `src/pages/` (48 files)
Routed: About, AboutAuthor, AboutSite, AboutMethodology, AdminLogin, ArticleView, AuthCallback, BuildADcfPage, CompareCompaniesPage, ComputeRatiosPage, Community, Dashboard, DcfSensitivityPage, ForgotPassword, Foundations, FoundationsLeaf, Glossary, GlossaryEntry, Index, LearnByDoing, LearnByDoingModule, LearnIndex, Login, Markets, MarketsCompliance, MarketsNifty50, Migration, NotFound, PostDetail, RatioAnalysis, RatioAnalysisEntry, ReadIncomeStatementPage, Research, ResearchArticle, ResetPassword, Settings, Signup, SpotRedFlagsPage, ToolPage, Tools.
Orphaned (no route, no importer): `Article.tsx`, `Calculators.tsx`, `Categories.tsx`, `Category.tsx`, `Compliance.tsx`, `FundamentalAnalysis.tsx` (622 lines), `Learn.tsx` (280), `Stocks.tsx`, `TechnicalAnalysis.tsx` (792). About 2,300 lines of dead code.

### Scripts
`scripts/generateArticles.js`, `generateSitemap.js`, `generateOgImage.js`, `exportArticles.js`, `runPopulateEmbeddings.js` (hard-codes the anon key and project ref), `createAdmin.js` (absolute `D:\Srinath\...` fallback path). `supabase/functions/chat`, `supabase/functions/generate-embeddings`, `supabase/migrations/*.sql`.

## 5. Navigation (current)

### Header (`src/components/layout/Header.tsx`)
| Item | Href | Notes |
|---|---|---|
| Logo + "The Valuation Node" | `/` | `/logo.png` at 36 px (file is 2.4 MB) |
| Research | `/research` | active on prefix |
| Learn | `/learn` | |
| Tools | `/tools` | |
| Markets | `/markets` | |
| About | `/about` | |
| Theme toggle | n/a | |
| Search icon | opens `GlobalSearch` (Cmd-K) | results link to dead paths |
| Subscribe | `#newsletter` | anchor exists only on `/`, `/learn`, `/learn/ratio-analysis` |
| Signed out: Sign in | `/login` | no Sign up link in header |
| Signed in: user menu | `/dashboard`, `/settings`, Sign out | |
| Mobile Sheet | same 5 links + Subscribe + auth items | hamburger, `lg:hidden` |

### Footer (`src/components/layout/Footer.tsx`)
Brand column (logo, tagline, "© 2026 Gajji Srinath"); Navigation column (Research, Learn, Tools, Markets, About); Connect column (LinkedIn, `mailto:srinath@valuationnode.com`); bottom bar with "Not investment advice" plus **Disclaimer `/disclaimer`** and **Privacy Policy `/privacy`**, both unrouted (soft-404 on all 310 pages).

### Hub pages
- `/` (Index): hero CTAs to latest research and `/learn`; featured article; 3 recent articles; flagship `/learn/foundations/valuation/dcf-theory-and-mechanics`; small cards to `reading-an-income-statement`, `credit-risk-fundamentals`, `/learn/by-doing/build-a-dcf`; `/about`; newsletter.
- `/learn`: 4 cards: Foundations, Learn-by-Doing, Ratio Analysis (dynamic count), Glossary ("170+" hard-coded).
- `/learn/foundations`: 9 sections, 51 topics (sidebar tree).
- `/tools`: 13 tools in 4 groups (Valuation, Investment Planning, Loans, Risk).
- `/markets`: Nifty 50 ("all 50 constituents", actually 20 rows), Compliance.
- `/research`: category pills All/Valuation/Credit/Sector/ESG/Fintech/Methodology; lists 9 articles including 5 undated drafts.
- `/about`: Author, About this site, Methodology.
- `/learn/ratio-analysis`: 7 groups, 49 entries.

### Legacy paths (Navigate redirects in App.tsx, duplicated as Netlify 301s)
`/learn/wiki`, `/learn/basics`, `/learn/fundamental-analysis`, `/learn/technical-analysis`, `/calculators`, `/stocks`, `/compliance`.

## 6. Duplicate, orphaned, unlinked pages

| Type | Items |
|---|---|
| Orphaned page files | `Article.tsx`, `Calculators.tsx`, `Categories.tsx`, `Category.tsx`, `Compliance.tsx`, `FundamentalAnalysis.tsx`, `Learn.tsx`, `Stocks.tsx`, `TechnicalAnalysis.tsx` |
| Routed but unreachable from nav | `/community`, `/community/post/:id`, `/migration` (no auth gate), `/learn/:slug` (ArticleView, broken: reads `id` param but route provides `slug`), `/learn/by-doing/:slug` ("coming soon" placeholder), `/admin-login` (footer-less link from Login page only) |
| Routed but not prerendered and not in sitemap | 9 section hubs `/learn/foundations/:section` (linked from all 51 leaf breadcrumbs and their BreadcrumbList JSON-LD; `Foundations.tsx` ignores the param and canonicals to `/learn/foundations`) |
| Duplicate implementations | Glossary: live `Glossary.tsx`/`GlossaryEntry.tsx` (local JSON) vs legacy `DefinitionsGrid.tsx` + `Learn.tsx` (Supabase). Embeddings admin: `EmbeddingAdmin.tsx` vs `EmbeddingManager.tsx`. Auth gate: `AdminRoute.tsx` vs `ProtectedRoute requireAdmin`. Slug helper copied 3 times (`toSlug` in `Glossary.tsx` and `GlossaryEntry.tsx` vs `termSlug` in `relatedContent.ts`; `Prose.slugify` uses a different regex). Two `Person` JSON-LD nodes on `/about/author` (page-level plus `#person` from `index.html`) |
| Duplicate glossary terms | 5 slug collisions in `definitions.json`: `demat-account` (ids `demat`, `demat-account`), `ltcg` (`ltcg`, `ltcg-stock`), `market-cap` (`market-cap`, `market-cap-2`), `book-value` (`book-value`, `book-value-2`), `face-value` (`face-value`, `face-value-basics`). `findTerm` returns the first, so 5 definitions are unreachable; sitemap lists the 5 URLs twice |
| Unlinked assets | `public/favicon.ico`, `public/icon.svg` (Lovable default), `public/placeholder.svg`; root `images/` folder (untracked `text_logo.png` 2.67 MB, `vn_logo.png` 772 KB, `vn_logo_bg.png`; tracked `images/logo1.png` shows as deleted in the working tree, uncommitted) |
| Unused code | `NavLink.tsx`, `AuthSocial.tsx`, `PhoneLogin.tsx`, `FloatingChat.tsx`, `BadgeCard.tsx`, `gamificationService.ts`, `src/App.css`, 21 shadcn primitives, `data/articles.ts` + `quizzes.ts` (only Migration and orphans), unused deps `embla-carousel-react`, `react-day-picker`, `react-resizable-panels`, `vaul`, `input-otp`, `canvas-confetti` (legacy Quiz only) |

## 7. SEO setup (current)

### 7.1 Head tags by page type
| Page | Title | Description | Canonical | OG | JSON-LD |
|---|---|---|---|---|---|
| Home | hard-coded | hard-coded | yes | title, desc, url + twitter | Organization (no logo, no sameAs) + site graph |
| `/research` | yes | hard-coded | yes | og:title only | none |
| Research article | `metaTitle` or title | `metaDescription` or excerpt | yes | full + `og:type=article`, `article:published_time` (date only) | Article (image = generic og-image on all 4), BreadcrumbList |
| `/learn`, `/learn/foundations`, `/learn/by-doing`, `/learn/glossary`, `/tools`, `/markets`, `/about*` | yes | hard-coded | yes | none page-level | none (About: Person) |
| Foundations leaf | label | first 152 chars of `intuition` | yes | og:url only | LearningResource, BreadcrumbList (level 3 points to a non-prerendered hub) |
| By-doing pages (5) | yes | hard-coded | yes | title, desc, no url | LearningResource (no author, no breadcrumbs) |
| Glossary entry | term | definition trimmed | yes | og:url only | DefinedTerm (no `url`), BreadcrumbList |
| Ratio hub / entry | yes (hub 75 chars, entries 62 to 82 chars) | computed (hub 210 chars) | yes | title, desc, url | ItemList / DefinedTerm, BreadcrumbList |
| Tool pages (12) | label | `TOOL_META.description` | yes | og:url only | WebApplication, BreadcrumbList |
| `/tools/dcf-sensitivity` | yes | hard-coded (164 chars) | yes | title, desc, no url | none (inconsistent with other tools) |
| `/markets/nifty50` | yes | hard-coded | yes | none | none; static HTML is a spinner |
| NotFound | yes | none | none | none | none; `noindex` |
| Dashboard | yes | none | none | none | no `noindex` |
| No `<Helmet>` at all | Login, Signup, Settings, Community, PostDetail, ArticleView, AdminLogin, AuthCallback, ForgotPassword, ResetPassword, Migration | | | | |

Site-wide from `Layout.tsx`: `og:site_name`, `og:type=website`, `og:locale=en_IN`, `og:image` 1200x630 + alt, `twitter:card=summary_large_image`. From `index.html`: `<html lang="en">`, viewport, `meta author`, theme-flash script, two `theme-color` tags, Google Fonts preconnect + render-blocking stylesheet, favicon 32 and 64 PNGs, `apple-touch-icon` = the 2.4 MB `logo.png`, `WebSite` (with `SearchAction` to `/learn/glossary?q=`) + `Person` `@graph`, Umami.

### 7.2 Measured across the 310 prerendered pages
- 310/310 have exactly one `<title>`, one canonical (matching the path), one meta description, one `<h1>`. 0 JSON-LD parse errors. 0 `noindex`.
- 248 pages lack `og:title`, 249 lack `og:description` (glossary, foundations leaves, tools, about, markets, learn hubs). 19 lack `og:url`.
- 61 titles over 60 chars (all 49 ratio entries, 7 foundations, 4 research, ratio hub). Descriptions over 160: ratio hub 210, dcf-sensitivity 164, build-a-dcf 163, read-an-income-statement 161.
- Heading order skips `h1` to `h3` on 18 pages: all 13 `/tools/*` (calculator card titles are `<h3>`), `read-an-income-statement`, `/learn/foundations`, `/learn/glossary`, `/markets/compliance`, `/markets/nifty50`.
- vite-react-ssg injects Helmet tags before `<meta charset>`; charset lands beyond byte 1024 on long-head pages (harmless while Netlify sends the charset header).

### 7.3 Sitemap and robots
- `public/robots.txt`: allow all; disallow admin, dashboard, settings, auth routes, migration, community; sitemap link. Fine.
- `scripts/generateSitemap.js`: 97 hard-coded static routes + research (dated, not hidden) + glossary (all) + ratio slugs (regex from the TS file). Writes `public/sitemap.xml`.
- `sitemap.xml`: 315 URLs, 5 duplicates (the glossary collisions); after dedupe, sitemap and dist match 1:1 (310). `lastmod` is the build date for 311 of 315 URLs (only the 4 research articles carry real dates); per-topic `lastReviewed` in `foundationsContent.ts` is unused. Priorities 1.0/0.9/0.8/0.7/0.6/0.5, changefreq mostly monthly.
- `llms.txt` present and accurate except "170+" glossary wording.

### 7.4 Redirects
- Seven 301s in `netlify.toml` and the same seven as `<Navigate>` in `App.tsx` (double handling).
- **Likely defect:** Netlify processes `public/_redirects` before `netlify.toml`, and `_redirects` contains `/* /index.html 200`, so `/calculators` etc. are served as the home page with HTTP 200 and the 301 never fires; the redirect only happens client-side. Verify with `curl -I https://valuationnode.com/calculators`. Fix is to move the 301 rules into `_redirects` above the catch-all or delete `_redirects`.
- `/learn/fundamental-analysis` 301-targets `/learn/foundations/valuation`, which itself has no static page.

### 7.5 Internal link check (all `href="/..."` in dist, 501 unique targets)
Broken targets: `/disclaimer` and `/privacy` (from all 310 pages via Footer); 9 `/learn/foundations/:section` hubs (from 51 leaves); 5 draft research slugs listed on `/research` (`Research.tsx` filters by hidden but not by `publishedAt`); about 180 glossary "Related terms" chips that slugify a term name with no matching entry (179 of 440 `relatedTerms` strings do not resolve, e.g. `ebitda`, `ebit`, `sebi`, `ipo`, `volatility`). In src: `Signup.tsx` links `/terms` and `/privacy`; orphan files link `/categories` and `/stocks`. All `href` values in `ratioAnalysis.ts` and `relatedContent.ts` resolve.

### 7.6 Images
- Live `<img>` tags: header logo (36x36, alt set), mobile-sheet logo and footer logo (decorative `alt=""`, footer has no width/height), `Index.tsx` featured image (only when `ogImage` differs from the default, so never today), `AboutAuthor.tsx` photo slot (`AUTHOR_PHOTO = null`). No image lacks alt text. No `<picture>`, no WebP/AVIF, no `srcset`. `Prose` has no custom `img` renderer.
- `public/logo.png` is 2,437,256 bytes at 1400x1400 and is loaded on every page, used as `apple-touch-icon`, and as `publisher.logo` in Article JSON-LD. Biggest single performance defect.
- `scripts/generateOgImage.js` produces one site-wide 1200x630 PNG; no per-page OG images. All 9 research files set `ogImage: /og-image.png`, so the home "featured image" branch never renders.
- Fonts: Google Fonts stylesheet is render-blocking on every page.

### 7.7 Structured data gaps
Organization on home has no `logo`, `sameAs`, `@id` and is not linked to the `WebSite`/`Person` graph. `AboutAuthor` Person lacks `sameAs`, `image`, `@id`. Article `image` is generic; `author` Person has no `@id`. Glossary DefinedTerm lacks `url`. By-doing LearningResource lacks `author` and breadcrumbs. Dashboard/Settings/Community/auth pages rely on robots.txt only, no `noindex`.

## 8. Broken or half-finished

### Runtime bugs on live pages
1. `/markets/nifty50` crashes after load: `MarketsNifty50.tsx:52` renders `<StockScreener />` with no props; fetched `stocks` are never passed (`TS2739`). Static HTML shows only a spinner and "Snapshot as of " with no date.
2. Footer `/disclaimer` and `/privacy` links 404 on every page; `Signup.tsx` links `/terms` and `/privacy`.
3. `GlobalSearch` (header and 404 page) navigates to dead paths and only searches the first 4 items of each JSON.
4. `/learn/:slug` (`ArticleView`) always shows "Article Not Found" (`useParams<{ id }>` but the param is `slug`).
5. Header "Subscribe" `#newsletter` anchor exists on only 3 pages.
6. Newsletter never works: `VITE_BUTTONDOWN_API_KEY` is not set, and a Buttondown key in a `VITE_` var would ship to the client anyway.
7. `learnFinancials.ts:111` `c.pat` is not on `FinancialCompany` (latent `NaN`).
8. `/learn/foundations/:section` ignores the param: shows the generic hub, canonical to `/learn/foundations`, not prerendered, not in sitemap; it is the 301 target for `/learn/fundamental-analysis`.
9. 5 glossary definitions unreachable (slug collisions, 6 above).
10. `EmbeddingAdmin` ("RAG System, Populate Embeddings") renders inside user `/settings` for any logged-in user, no role check.
11. `/migration` is routable with no auth gate and can upsert into Supabase.
12. `/research` lists 5 undated drafts publicly (titles, excerpts, client-side links); they render at URLs that return home-page HTML to crawlers.
13. Dashboard bookmarks link to `/article/:id`, which does not exist.

### TypeScript (`tsc --noEmit -p tsconfig.app.json` exits 2)
`Tools.tsx:80,93` (`comingSoon` not on type), `MarketsNifty50.tsx:52`, `learnFinancials.ts:111`, `Compliance.tsx:153` (orphan), `AuthContext.tsx:37` (`profiles.role` missing from generated types), `communityService.ts` x10 (`comment_reports`, `is_hidden`, `status`), `ArticleEditor.tsx`, `ArticleList.tsx`, `AdminDashboard.tsx:34`, `populateEmbeddings.ts` x6 (`get_embedding_stats` RPC). Root cause for most: `src/integrations/supabase/types.ts` is stale against `supabase/migrations/`. The production build passes because Vite does not type-check.

### Lint
`npm run lint` reports 0 errors only because `no-unused-vars` is off. With it on: unused imports in `Header.tsx` (`Bell`), `MarketsNifty50.tsx` (`useState`), `Foundations.tsx` (`useParams`), `GlobalSearch.tsx` (`useRef`), `ArticleView.tsx`, `FloatingChat.tsx`, `Quiz.tsx`, `FormulaCalculators.tsx`, `EmbeddingManager.tsx`, `Community.tsx`, `Learn.tsx`, `Categories.tsx`, `FundamentalAnalysis.tsx`. About 45 `no-explicit-any`, `prefer-const` in `StockScreener.tsx:61`, `no-useless-escape` in `foundationsContentPart3.ts:327`.

### Placeholders and "coming soon"
- `LearnByDoingModule.tsx` "This module is coming soon" fallback (self-canonical soft-404 for unknown slugs).
- `FoundationsLeaf.tsx:105` "Coming as I learn" branch (unreachable, all 51 published); `:189` "Interactive exercises coming soon." shown on 41 of 51 topics (only 10 have `tryItHref`).
- `Index.tsx:163` "Coming soon, first research piece" (unreachable while articles exist).
- `Tools.tsx` and `LearnByDoing.tsx` "Coming soon" branches are dead code.
- `Dashboard.tsx:116` `TODO: Implement reading history tracking`.
- `AboutAuthor.tsx:9` `AUTHOR_PHOTO = null` headshot slot.
- `ChatSidebar.tsx:193` "PDF support coming soon!".
- 5 of 9 research articles are hidden drafts with `publishDate: "INSERT_HONEST_DATE"`.

### Stale claims and comments
"170+ definitions" in `LearnIndex.tsx`, `Glossary.tsx`, `llms.txt` (actual 178, 173 reachable). `App.tsx` comment "prerender all 8 calculator pages" (13). README "all 8 calculators", "Chat repositioned as floating button" (`FloatingChat` unused), security headers "in vercel.json". `Markets.tsx` "all 50 constituents" (20 rows in `stocks.json`, page reads Supabase anyway). `netlify.toml` comment "SPA fallback (handled by _redirects)" while both files define it. Commit messages cite 254 / 261 pages; dist is 310, sitemap 315.

### Security and hygiene notes
`.env` (gitignored) holds `SUPABASE_SERVICE_ROLE_KEY` beside client `VITE_` keys; earlier `.env` contents exist in git history (treated as burned). `scripts/runPopulateEmbeddings.js` hard-codes the anon key and project ref. `scripts/createAdmin.js` has an absolute `D:\Srinath\Fin-bot\...` fallback path. Auth pages have no `<Helmet>` and no `noindex`.

## 9. Working tree at audit time
`main` at `3924d46`, in sync with `origin/main`. Uncommitted: deletion of `images/logo1.png` (tracked file removed on disk, pre-existing), untracked `images/text_logo.png`, `images/vn_logo.png`, `images/vn_logo_bg.png`. None of these are touched by the restructure; the deletion is flagged here under constraint 1 and left for the owner to decide.

## 10. Questions the mapping (Phase 2) will need answered
Listed here for visibility only; nothing is assumed.
1. Tools (13 calculators), Markets (Nifty 50, compliance calendar), and Learn-by-Doing (5 interactive lessons) have no slot in the target navigation. Candidates: The Vault > Model Templates for tools, The Vault > Concept Guides for lessons, News & Trends > Policy & Regulation for the compliance calendar; Nifty 50 has no obvious home.
2. Foundations (51 teaching topics across 9 sections) vs Ratio Analysis (49) vs Glossary (178): the target merges "Formulas and Financial Ratios" and "Glossary and Definitions", but the six Foundations ratio topics are teaching content (Concept Guides) while Ratio Analysis entries are reference (Key Formulas & Ratios). Confirm that split.
3. The 5 hidden research drafts: map them now (as `status: draft`) or leave them out of the plan until published.
4. Legacy Supabase `articles` (personal-finance: investing, budgeting, taxes, retirement, credit) and the orphaned FA/TA course pages: they are not reachable today. Constraint 1 says nothing is deleted; confirm they stay as unrouted files, or get a home.
5. `/about/methodology` maps to Editorial Philosophy; `/contact` does not exist yet (footer has a mailto). Confirm creating it.
6. Community, Dashboard, Settings, Admin, and auth stay as they are (outside the content structure).

## Appendix A: glossary entries (178)

Generated from `src/data/definitions.json`. Slug = lowercase term, non-alphanumerics to hyphens. "Words" is the definition field only.

| Term | Category | Words | Formula | URL |
|---|---|---|---|---|
| Future Value | Investment Planning | 30 | yes | /learn/glossary/future-value |
| Present Value | Investment Planning | 22 | yes | /learn/glossary/present-value |
| SIP | Investment Planning | 19 | yes | /learn/glossary/sip |
| CAGR | Investment Planning | 26 | yes | /learn/glossary/cagr |
| Rule of 72 | Investment Planning | 20 | yes | /learn/glossary/rule-of-72 |
| EMI | Investment Planning | 23 | yes | /learn/glossary/emi |
| Real Return | Investment Planning | 15 | yes | /learn/glossary/real-return |
| Simple Interest | Investment Planning | 17 | yes | /learn/glossary/simple-interest |
| Compound Interest | Investment Planning | 20 | yes | /learn/glossary/compound-interest |
| NPV | Investment Planning | 21 | yes | /learn/glossary/npv |
| EPS | Profitability Ratios | 24 | yes | /learn/glossary/eps |
| ROE | Profitability Ratios | 19 | yes | /learn/glossary/roe |
| ROA | Profitability Ratios | 22 | yes | /learn/glossary/roa |
| ROCE | Profitability Ratios | 22 | yes | /learn/glossary/roce |
| Net Profit Margin | Profitability Ratios | 16 | yes | /learn/glossary/net-profit-margin |
| EBITDA Margin | Profitability Ratios | 13 | yes | /learn/glossary/ebitda-margin |
| P/E Ratio | Valuation Ratios | 26 | yes | /learn/glossary/p-e-ratio |
| P/B Ratio | Valuation Ratios | 22 | yes | /learn/glossary/p-b-ratio |
| PEG Ratio | Valuation Ratios | 14 | yes | /learn/glossary/peg-ratio |
| Dividend Yield | Valuation Ratios | 19 | yes | /learn/glossary/dividend-yield |
| Enterprise Value | Valuation Ratios | 23 | yes | /learn/glossary/enterprise-value |
| EV/EBITDA | Valuation Ratios | 16 | yes | /learn/glossary/ev-ebitda |
| Current Ratio | Liquidity Ratios | 14 | yes | /learn/glossary/current-ratio |
| Quick Ratio | Liquidity Ratios | 18 | yes | /learn/glossary/quick-ratio |
| Debt-to-Equity | Solvency Ratios | 20 | yes | /learn/glossary/debt-to-equity |
| Interest Coverage | Solvency Ratios | 15 | yes | /learn/glossary/interest-coverage |
| Asset Turnover | Efficiency Ratios | 16 | yes | /learn/glossary/asset-turnover |
| RSI | Technical Analysis | 18 | yes | /learn/glossary/rsi |
| MACD | Technical Analysis | 16 | yes | /learn/glossary/macd |
| Bollinger Bands | Technical Analysis | 18 | yes | /learn/glossary/bollinger-bands |
| ATR | Technical Analysis | 16 | yes | /learn/glossary/atr |
| Fibonacci Levels | Technical Analysis | 15 | yes | /learn/glossary/fibonacci-levels |
| OBV | Technical Analysis | 18 | yes | /learn/glossary/obv |
| Stochastic | Technical Analysis | 17 | yes | /learn/glossary/stochastic |
| EMA | Technical Analysis | 23 | yes | /learn/glossary/ema |
| SEBI LODR | Regulatory Compliance | 17 | yes | /learn/glossary/sebi-lodr |
| SEBI PIT | Regulatory Compliance | 17 | yes | /learn/glossary/sebi-pit |
| SEBI SAST | Regulatory Compliance | 17 | yes | /learn/glossary/sebi-sast |
| SEBI ICDR | Regulatory Compliance | 16 | yes | /learn/glossary/sebi-icdr |
| Account Aggregator | Regulatory Compliance | 12 | yes | /learn/glossary/account-aggregator |
| Demat Account | Regulatory Compliance | 17 | yes | /learn/glossary/demat-account |
| MCA Form AOC-4 | Regulatory Compliance | 17 | yes | /learn/glossary/mca-form-aoc-4 |
| MCA Form MGT-7 | Regulatory Compliance | 16 | yes | /learn/glossary/mca-form-mgt-7 |
| T+1 Settlement | Regulatory Compliance | 18 | yes | /learn/glossary/t-1-settlement |
| Circuit Breakers | Regulatory Compliance | 17 | yes | /learn/glossary/circuit-breakers |
| Beta | Risk & Portfolio | 14 | yes | /learn/glossary/beta |
| Sharpe Ratio | Risk & Portfolio | 13 | yes | /learn/glossary/sharpe-ratio |
| Treynor Ratio | Risk & Portfolio | 15 | yes | /learn/glossary/treynor-ratio |
| CAPM | Risk & Portfolio | 17 | yes | /learn/glossary/capm |
| WACC | Risk & Portfolio | 20 | yes | /learn/glossary/wacc |
| Standard Deviation | Risk & Portfolio | 16 | yes | /learn/glossary/standard-deviation |
| Alpha | Risk & Portfolio | 17 | yes | /learn/glossary/alpha |
| STCG | Taxation | 20 | yes | /learn/glossary/stcg |
| LTCG | Taxation | 21 | yes | /learn/glossary/ltcg |
| GST | Taxation | 16 | yes | /learn/glossary/gst |
| Section 80C | Taxation | 19 | yes | /learn/glossary/section-80c |
| STT | Taxation | 19 | yes | /learn/glossary/stt |
| Market Cap | Fundamentals | 18 | yes | /learn/glossary/market-cap |
| Book Value | Fundamentals | 18 | yes | /learn/glossary/book-value |
| NAV | Mutual Funds | 20 | yes | /learn/glossary/nav |
| Expense Ratio | Mutual Funds | 18 | yes | /learn/glossary/expense-ratio |
| Free Float | Fundamentals | 16 | yes | /learn/glossary/free-float |
| Face Value | Fundamentals | 19 | yes | /learn/glossary/face-value |
| Nifty 50 | Indices | 23 | yes | /learn/glossary/nifty-50 |
| LTCG | Basics of Stock Market | 12 | yes | /learn/glossary/ltcg (collision, unreachable) |
| Dividend | Basics of Stock Market | 9 | yes | /learn/glossary/dividend |
| Face Value | Basics of Stock Market | 12 | yes | /learn/glossary/face-value (collision, unreachable) |
| Promoter | Basics of Stock Market | 11 | yes | /learn/glossary/promoter |
| Top Line & Bottom Line | Basics of Stock Market | 11 | yes | /learn/glossary/top-line-bottom-line |
| Share Split | Basics of Stock Market | 14 | yes | /learn/glossary/share-split |
| Bonus Shares | Basics of Stock Market | 11 | yes | /learn/glossary/bonus-shares |
| Price Discovery | Basics of Stock Market | 11 | yes | /learn/glossary/price-discovery |
| Securities Market Types | Basics of Stock Market | 11 | yes | /learn/glossary/securities-market-types |
| DEMAT Account | Basics of Stock Market | 11 | yes | /learn/glossary/demat-account (collision, unreachable) |
| Savings Account | Basics of Stock Market | 8 | yes | /learn/glossary/savings-account |
| Trading Account | Basics of Stock Market | 13 | yes | /learn/glossary/trading-account |
| DEMAT Documents | Basics of Stock Market | 10 | yes | /learn/glossary/demat-documents |
| Contract Note | Basics of Stock Market | 10 | yes | /learn/glossary/contract-note |
| Settlement Date | Basics of Stock Market | 10 | yes | /learn/glossary/settlement-date |
| LTP | Basics of Stock Market | 8 | yes | /learn/glossary/ltp |
| Pre-opening Session | Basics of Stock Market | 11 | yes | /learn/glossary/pre-opening-session |
| AMO | Basics of Stock Market | 10 | yes | /learn/glossary/amo |
| Gap Up | Basics of Stock Market | 9 | yes | /learn/glossary/gap-up |
| Gap Down | Basics of Stock Market | 9 | yes | /learn/glossary/gap-down |
| Announcement Date | Basics of Stock Market | 9 | yes | /learn/glossary/announcement-date |
| Record Date | Basics of Stock Market | 11 | yes | /learn/glossary/record-date |
| Investor Types | Basics of Stock Market | 12 | yes | /learn/glossary/investor-types |
| Depositories | Basics of Stock Market | 12 | yes | /learn/glossary/depositories |
| DP | Basics of Stock Market | 10 | yes | /learn/glossary/dp |
| Corporate Actions | Basics of Stock Market | 9 | yes | /learn/glossary/corporate-actions |
| Volume | Basics of Stock Market | 9 | yes | /learn/glossary/volume |
| Trading System | Basics of Stock Market | 7 | yes | /learn/glossary/trading-system |
| Order Types | Basics of Stock Market | 12 | yes | /learn/glossary/order-types |
| Bullish & Bearish | Basics of Stock Market | 10 | yes | /learn/glossary/bullish-bearish |
| Short Sell | Basics of Stock Market | 11 | yes | /learn/glossary/short-sell |
| Auction | Basics of Stock Market | 13 | yes | /learn/glossary/auction |
| Stop Loss | Basics of Stock Market | 15 | yes | /learn/glossary/stop-loss |
| Circuit Filter | Basics of Stock Market | 11 | yes | /learn/glossary/circuit-filter |
| Trend Analysis | Basics of Stock Market | 8 | yes | /learn/glossary/trend-analysis |
| Market Cap | Basics of Stock Market | 6 | yes | /learn/glossary/market-cap (collision, unreachable) |
| Ring Trading | Basics of Stock Market | 9 | yes | /learn/glossary/ring-trading |
| Block Deal | Basics of Stock Market | 12 | yes | /learn/glossary/block-deal |
| Order Quantity Types | Basics of Stock Market | 9 | yes | /learn/glossary/order-quantity-types |
| Bid-Ask Spread | Basics of Stock Market | 11 | yes | /learn/glossary/bid-ask-spread |
| Indices | Basics of Stock Market | 9 | yes | /learn/glossary/indices |
| Sector Indices | Basics of Stock Market | 4 | yes | /learn/glossary/sector-indices |
| Free Float Mcap | Basics of Stock Market | 10 | yes | /learn/glossary/free-float-mcap |
| Pledging | Basics of Stock Market | 9 | yes | /learn/glossary/pledging |
| Lot Size | Basics of Stock Market | 13 | yes | /learn/glossary/lot-size |
| IPO vs OFS | Basics of Stock Market | 14 | yes | /learn/glossary/ipo-vs-ofs |
| FPO | Basics of Stock Market | 8 | yes | /learn/glossary/fpo |
| Book Value | Basics of Stock Market | 7 | yes | /learn/glossary/book-value (collision, unreachable) |
| Merchant Banker | Basics of Stock Market | 6 | yes | /learn/glossary/merchant-banker |
| Price Band | Basics of Stock Market | 11 | yes | /learn/glossary/price-band |
| Book Building | Basics of Stock Market | 11 | yes | /learn/glossary/book-building |
| Prospectus | Basics of Stock Market | 10 | yes | /learn/glossary/prospectus |
| Primary Market | Basics of Stock Market | 9 | yes | /learn/glossary/primary-market |
| Underwriter | Basics of Stock Market | 9 | yes | /learn/glossary/underwriter |
| IPO Listing | Basics of Stock Market | 8 | yes | /learn/glossary/ipo-listing |
| Price Determination | Basics of Stock Market | 9 | yes | /learn/glossary/price-determination |
| EV/Sales | Valuation Ratios | 23 | yes | /learn/glossary/ev-sales |
| FCF Yield | Valuation Ratios | 31 | yes | /learn/glossary/fcf-yield |
| Earnings Yield | Valuation Ratios | 26 | yes | /learn/glossary/earnings-yield |
| Dividend Payout Ratio | Valuation Ratios | 19 | yes | /learn/glossary/dividend-payout-ratio |
| Terminal Value | Valuation Ratios | 32 | yes | /learn/glossary/terminal-value |
| Margin of Safety | Valuation Ratios | 24 | yes | /learn/glossary/margin-of-safety |
| Book Value per Share | Valuation Ratios | 19 | yes | /learn/glossary/book-value-per-share |
| ROIC | Profitability Ratios | 29 | yes | /learn/glossary/roic |
| NOPAT | Profitability Ratios | 21 | yes | /learn/glossary/nopat |
| Operating Leverage | Profitability Ratios | 27 | yes | /learn/glossary/operating-leverage |
| Gross Margin | Profitability Ratios | 16 | yes | /learn/glossary/gross-margin |
| Operating Margin | Profitability Ratios | 25 | yes | /learn/glossary/operating-margin |
| Yield to Maturity | Credit & Debt | 30 | yes | /learn/glossary/yield-to-maturity |
| Credit Spread | Credit & Debt | 22 | yes | /learn/glossary/credit-spread |
| Credit Rating | Credit & Debt | 32 | no | /learn/glossary/credit-rating |
| DSCR | Credit & Debt | 27 | yes | /learn/glossary/dscr |
| Coupon Rate | Credit & Debt | 27 | yes | /learn/glossary/coupon-rate |
| Duration | Credit & Debt | 22 | yes | /learn/glossary/duration |
| NPA | Credit & Debt | 26 | yes | /learn/glossary/npa |
| Covenant | Credit & Debt | 31 | no | /learn/glossary/covenant |
| Promoter Pledge | Credit & Debt | 17 | yes | /learn/glossary/promoter-pledge |
| Working Capital Cycle | Credit & Debt | 17 | yes | /learn/glossary/working-capital-cycle |
| Bonus Issue | Basics of Stock Market | 23 | no | /learn/glossary/bonus-issue |
| Rights Issue | Basics of Stock Market | 26 | no | /learn/glossary/rights-issue |
| Buyback | Basics of Stock Market | 24 | no | /learn/glossary/buyback |
| Stock Split | Basics of Stock Market | 19 | no | /learn/glossary/stock-split |
| FPI | Basics of Stock Market | 24 | no | /learn/glossary/fpi |
| DII | Basics of Stock Market | 22 | no | /learn/glossary/dii |
| Repo Rate | Macroeconomics | 26 | no | /learn/glossary/repo-rate |
| Reverse Repo Rate | Macroeconomics | 26 | no | /learn/glossary/reverse-repo-rate |
| CPI Inflation | Macroeconomics | 29 | yes | /learn/glossary/cpi-inflation |
| WPI | Macroeconomics | 23 | no | /learn/glossary/wpi |
| GDP Growth | Macroeconomics | 22 | no | /learn/glossary/gdp-growth |
| Fiscal Deficit | Macroeconomics | 21 | yes | /learn/glossary/fiscal-deficit |
| Current Account Deficit | Macroeconomics | 23 | yes | /learn/glossary/current-account-deficit |
| CRR | Macroeconomics | 23 | yes | /learn/glossary/crr |
| SLR | Macroeconomics | 24 | no | /learn/glossary/slr |
| Basis Point | Macroeconomics | 21 | yes | /learn/glossary/basis-point |
| ESG Score | ESG & Governance | 21 | no | /learn/glossary/esg-score |
| BRSR | ESG & Governance | 18 | no | /learn/glossary/brsr |
| Related-Party Transaction | ESG & Governance | 26 | no | /learn/glossary/related-party-transaction |
| Independent Director | ESG & Governance | 24 | no | /learn/glossary/independent-director |
| Promoter Holding | ESG & Governance | 19 | no | /learn/glossary/promoter-holding |
| Greenwashing | ESG & Governance | 13 | no | /learn/glossary/greenwashing |
| UPI | Fintech | 21 | no | /learn/glossary/upi |
| CBDC | Fintech | 25 | no | /learn/glossary/cbdc |
| P2P Lending | Fintech | 22 | no | /learn/glossary/p2p-lending |
| Payment Aggregator | Fintech | 21 | no | /learn/glossary/payment-aggregator |
| KYC | Fintech | 22 | no | /learn/glossary/kyc |
| XIRR | Investment Planning | 31 | yes | /learn/glossary/xirr |
| Asset Allocation | Investment Planning | 27 | no | /learn/glossary/asset-allocation |
| Rebalancing | Investment Planning | 19 | no | /learn/glossary/rebalancing |
| CASA Ratio | Credit & Debt | 41 | yes | /learn/glossary/casa-ratio |
| Cost of Funds | Credit & Debt | 32 | yes | /learn/glossary/cost-of-funds |
| Net Interest Margin | Credit & Debt | 36 | yes | /learn/glossary/net-interest-margin |
| Capital Adequacy Ratio | Credit & Debt | 28 | yes | /learn/glossary/capital-adequacy-ratio |
| Provisions | Credit & Debt | 28 | yes | /learn/glossary/provisions |
| Cash Flow from Operations | Fundamentals | 29 | yes | /learn/glossary/cash-flow-from-operations |
