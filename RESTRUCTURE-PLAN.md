# Restructure Plan: The Valuation Node

Phase 2 deliverable. Maps every existing page to the target taxonomy. No code has been
written. Conventions: **Section** and **Sub-section** are exclusive and structural;
**Tags** are cross-cutting (list in section 7, 40 tags). "Flag" marks a decision that did
not fit cleanly and needs a yes/no from the owner before Phase 3 uses it.

Decisions already confirmed by the owner (2026-09-16): keep dark mode; keep both glossary
duplicates with distinct slugs; aggregate empty sections by tag and hide empty
sub-sections from menus; orphan shells stay unrouted, their unique content gets URLs.

## 1. Target structure

### Navigation
`[Logo] | News & Trends | Insights & Analysis | ESG & Sustainability | The Vault | About | [Search]`

| Section | Landing | Sub-sections (slug) |
|---|---|---|
| News & Trends | `/news` | Global Markets (`global-markets`), Indian Economy (`indian-economy`), Corporate Updates (`corporate-updates`), Policy & Regulation (`policy-regulation`), Technology & AI (`technology-ai`) |
| Insights & Analysis | `/analysis` | Company Analysis (`company-analysis`), Industry Analysis (`industry-analysis`), Valuation & Financial Modeling (`valuation-modeling`), Business Strategy (`business-strategy`), Case Studies (`case-studies`), Op-Eds (`op-eds`) |
| ESG & Sustainability | `/esg` | Green Finance (`green-finance`), Corporate Governance (`corporate-governance`), Impact Investing (`impact-investing`), ESG Ratings & Frameworks (`esg-ratings-frameworks`) |
| The Vault | `/vault` | Financial Glossary (`/vault/glossary`), Key Formulas & Ratios (`/vault/formulas`), Concept Guides (`/vault/guides`), Model Templates & Interactive (`/vault/interactive`) |
| About | `/about` | About the Site (`/about/site`), About the Author (`/about/author`), Editorial Philosophy (`/about/philosophy`), Contact (`/about/contact`), Privacy (`/about/privacy`), Disclaimer (`/about/disclaimer`) |
| Archive (footer only, not in main nav) | `/archive` | Legacy personal-finance articles (`/archive/[slug]`) |
| Tags | `/tags` | `/tags/[tag]` |

### URL scheme
`/news/[sub]/[slug]`, `/analysis/[sub]/[slug]`, `/esg/[sub]/[slug]`, `/vault/glossary/[term]`, `/vault/formulas/[name]`, `/vault/guides/[slug]`, `/vault/interactive/[slug]`, `/tags/[tag]`, `/about/[slug]`, `/archive/[slug]`. Section and sub-section landings sit at `/news`, `/news/[sub]`, etc.

### Content counts after mapping
| Destination | Pages | Source |
|---|---|---|
| Insights & Analysis | 4 published + 5 drafts (hidden) | research `.md` |
| News & Trends | 2 | Nifty 50, Compliance calendar |
| ESG & Sustainability | 0 own pages; landing aggregates the `esg` tag (6 guides + ESG-tagged items) | tag aggregation |
| Vault: Glossary | 178 (all reachable after slug fix) | `definitions.json` |
| Vault: Formulas & Ratios | 49 | `ratioAnalysis.ts` |
| Vault: Concept Guides | 51 Foundations + 2 legacy courses + 9 track landings | `foundationsContent*.ts`, `FundamentalAnalysis.tsx`, `TechnicalAnalysis.tsx` |
| Vault: Interactive | 13 calculators + 5 lessons | `ToolPage.tsx`, `DcfSensitivityPage.tsx`, by-doing pages |
| About | 7 (3 existing, methodology renamed, 3 new stubs) + hub | About pages |
| Archive | 11 | `articles.ts` (+ any Supabase-only legacy rows via fallback) |
| Tags | up to 40 archives | computed |

## 2. News & Trends

| Old URL | New URL | Sub-section | Tags | Notes |
|---|---|---|---|---|
| `/markets` | `/news` (301) | landing | | Markets hub folds into the News landing |
| `/markets/nifty50` | `/news/indian-economy/nifty-50` | Indian Economy | indian-markets, equities, macroeconomics | Page crash fixed in Phase 3 (pass `stocks` to `StockScreener`); data stays Supabase with `stocks.json` as fallback |
| `/markets/compliance` | `/news/policy-regulation/compliance-calendar` | Policy & Regulation | regulation, indian-markets | 8 circulars from `circulars.json` |
| `/stocks` (legacy 301) | `/news/indian-economy/nifty-50` | | | repointed |
| `/compliance` (legacy 301) | `/news/policy-regulation/compliance-calendar` | | | repointed |

Global Markets, Corporate Updates, Technology & AI have no content today: routes exist, landings are `noindex` and hidden from the dropdown until they have at least one item (owner decision). **Flag N1:** the six Fintech Foundations topics would fit Technology & AI by subject, but the rule "teaching content goes in the Vault" keeps them as Concept Guides tagged `fintech`; the Technology & AI landing will aggregate that tag. Confirm.

## 3. Insights & Analysis

| Old URL | New URL | Sub-section | Tags | Status |
|---|---|---|---|---|
| `/research` | `/analysis` (301) | landing | | category pills become sub-section filters |
| `/research/how-the-valuation-node-approaches-research` | `/analysis/op-eds/how-the-valuation-node-approaches-research` | Op-Eds | methodology, valuation | published. **Flag A1:** this is really editorial policy; alternative is to 301 it to `/about/philosophy` and merge nothing (page kept as an article there). Proposed: Op-Eds, keeps it an Article with its date and schema |
| `/research/three-years-cash-flow-what-one-year-hides` | `/analysis/valuation-modeling/three-years-cash-flow-what-one-year-hides` | Valuation & Financial Modeling | cash-flow, earnings-quality, financial-statements | published |
| `/research/roe-comparison-dupont-why-higher-isnt-better` | `/analysis/valuation-modeling/roe-comparison-dupont-why-higher-isnt-better` | Valuation & Financial Modeling | ratios, profitability, leverage | published. **Flag A2:** Case Studies is a defensible alternative (it compares two companies); proposed V&FM because the companies are illustrative, not named |
| `/research/high-pe-what-it-implies-and-when-its-a-trap` | `/analysis/valuation-modeling/high-pe-what-it-implies-and-when-its-a-trap` | Valuation & Financial Modeling | valuation, relative-valuation, equities | published |
| `/research/five-red-flags-financial-statements` | `/analysis/valuation-modeling/five-red-flags-financial-statements` | Valuation & Financial Modeling | red-flags, earnings-quality, financial-statements | draft, hidden |
| `/research/profitable-but-out-of-cash` | `/analysis/valuation-modeling/profitable-but-out-of-cash` | Valuation & Financial Modeling | cash-flow, liquidity, earnings-quality | draft, hidden |
| `/research/terminal-value-dominates-valuations` | `/analysis/valuation-modeling/terminal-value-dominates-valuations` | Valuation & Financial Modeling | dcf, valuation, cost-of-capital | draft, hidden |
| `/research/what-credit-ratings-measure-and-miss` | `/analysis/op-eds/what-credit-ratings-measure-and-miss` | Op-Eds | credit-risk, bonds | draft, hidden. **Flag A3:** no Credit sub-section exists; Op-Eds proposed because it argues a position. Alternative: Industry Analysis |
| `/research/why-banks-cannot-be-valued-like-normal-companies` | `/analysis/industry-analysis/why-banks-cannot-be-valued-like-normal-companies` | Industry Analysis | banking, valuation, ratios | draft, hidden |

Drafts keep `status: draft`: not prerendered, not in the sitemap, not listed on `/analysis` (fixes the audit's public draft listing), still openable by the admin. Company Analysis, Business Strategy, Case Studies have no content: hidden sub-sections until used. The research front-matter `category` field (Valuation, Credit, Sector, Methodology) is retained as data but no longer drives navigation.

## 4. The Vault

### 4.1 Vault landing
`/learn` 301 to `/vault`. Landing shows the four Vault areas with counts and a glossary search box.

### 4.2 Key Formulas & Ratios (49)
`/learn/ratio-analysis` 301 to `/vault/formulas`; every entry `/learn/ratio-analysis/[slug]` 301 to `/vault/formulas/[slug]` (slugs unchanged, one splat rule). Sub-section: Key Formulas & Ratios. The seven groups stay as on-page grouping. Tags by group:

| Group | Entries | Tags |
|---|---|---|
| Size and Price Metrics | market-capitalisation, enterprise-value, earnings-per-share, pe-ratio, price-to-book, peg-ratio, price-to-cash-flow, price-to-sales, ev-to-ebitda, ev-to-sales, earnings-yield, fcf-yield, dividend-yield | ratios, valuation, relative-valuation |
| Profitability and Return | net-profit-margin, return-on-equity, return-on-capital-employed, gross-margin, operating-margin, ebitda-margin, return-on-assets, dividend-payout-ratio | ratios, profitability |
| Leverage and Liquidity | debt-to-equity, interest-coverage, quick-ratio, current-ratio, net-debt-to-ebitda | ratios, leverage, liquidity |
| Efficiency | asset-turnover, cash-conversion-cycle, dupont-analysis, working-capital-days, fixed-asset-turnover | ratios, efficiency |
| Cash Flow Checks | cfo-to-pat, free-cash-flow, cash-flow-per-share | ratios, cash-flow, earnings-quality |
| Banking | casa-ratio, cost-of-funds, net-npa, advances-growth, capital-adequacy-ratio, net-interest-margin, return-on-assets-bank, common-size-analysis-banks, gross-npa, provision-coverage-ratio, cost-to-income-ratio, credit-deposit-ratio | ratios, banking |
| Growth and Shareholding | sales-growth, profit-growth, promoter-holding | ratios, growth, equities |

### 4.3 Concept Guides (51 Foundations + 2 legacy courses + 9 track landings)
`/learn/foundations` 301 to `/vault/guides`. Every topic `/learn/foundations/[section]/[topic]` 301 to `/vault/guides/[topic]` (one placeholder rule; all 51 topic slugs are unique). The nine Foundations sections become **tracks**, kept as a field and as landing pages `/vault/guides/[track]` (prerendered, fixing the audit's nine unprerendered hubs); `/learn/foundations/[section]` 301 to `/vault/guides/[section]`. **Flag V1:** track landings share the `/vault/guides/` namespace with topic slugs; the nine track slugs are reserved and no topic uses them. Alternative is `/vault/guides?track=…`. Proposed: real pages, for SEO.

| Track (old section) | New landing | Topics (old `/learn/foundations/[section]/[topic]` to `/vault/guides/[topic]`) | Tags |
|---|---|---|---|
| Accounting | `/vault/guides/accounting` | reading-an-income-statement, reading-a-balance-sheet, reading-a-cash-flow-statement, linking-the-three-statements, ind-as-vs-ifrs-vs-indian-gaap, common-adjustments, quality-of-earnings | financial-statements (+ cash-flow on 3; earnings-quality on 6, 7) |
| Corporate Finance | `/vault/guides/corporate-finance` | time-value-of-money, cost-of-capital, capital-structure, working-capital, capital-budgeting | cost-of-capital, leverage (capital-structure), liquidity (working-capital), valuation (capital-budgeting) |
| Valuation | `/vault/guides/valuation` | dcf-theory-and-mechanics, relative-valuation, sum-of-the-parts, sector-specific-valuation, terminal-value-approaches, common-dcf-mistakes | valuation, dcf (4), relative-valuation (2), banking (sector-specific) |
| Financial Statement Analysis | `/vault/guides/financial-statement-analysis` | profitability-ratios, liquidity-ratios, solvency-ratios, efficiency-ratios, market-ratios, dupont-decomposition | ratios + profitability / liquidity / leverage / efficiency / relative-valuation respectively |
| Credit Analysis | `/vault/guides/credit-analysis` | credit-risk-fundamentals, reading-crisil-icra-moodys-reports, altman-z-score, bond-pricing-and-yields, covenants-and-triggers | credit-risk (all), bonds (bond-pricing), red-flags (altman) |
| Markets and Instruments | `/vault/guides/markets-and-instruments` | equities, debt-markets-and-yield-curves, derivatives, mutual-funds-etfs-aifs, reits-and-invits, technical-analysis-primer | equities, bonds, derivatives, funds-and-etfs, technical-analysis, indian-markets |
| ESG and Sustainable Finance | `/vault/guides/esg-and-sustainable-finance` | esg-fundamentals, reporting-frameworks, carbon-accounting, green-bonds, esg-integrated-valuation, climate-risk-and-stranded-assets | esg (all), esg-reporting (reporting-frameworks, carbon-accounting), green-finance (green-bonds), climate-risk (climate-risk, carbon-accounting), valuation (esg-integrated-valuation) |
| Fintech and Digital Finance | `/vault/guides/fintech-and-digital-finance` | payments-landscape, digital-lending-models, credit-scoring, blockchain-and-defi-primer, cybersecurity-in-financial-systems, account-aggregators | fintech (all), payments, digital-lending (2), credit-risk (credit-scoring), blockchain, cybersecurity |
| Data and Tools | `/vault/guides/data-and-tools` | excel-modeling-conventions, python-for-finance, sql-for-finance-data, where-to-find-indian-markets-data | data-and-tools (all), excel, python, sql, indian-markets |

The ESG landing `/esg` and its four sub-section pages aggregate by tag: `green-finance` lists Green Bonds; `esg-ratings-frameworks` lists ESG Fundamentals, Reporting Frameworks, Carbon Accounting, Climate Risk; `impact-investing` lists ESG-Integrated Valuation; `corporate-governance` has nothing yet (hidden). **Flag V2:** the tag-to-sub-section mapping for ESG is a proposal; confirm which guides surface under which ESG sub-section.

Legacy course text (orphans with unique words, integrated per owner decision):

| Source file | New URL | Track | Tags | Notes |
|---|---|---|---|---|
| `src/pages/FundamentalAnalysis.tsx` (`FundamentalAnalysisContent`, ~1,200 words) | `/vault/guides/fundamental-analysis-course` | Financial Statement Analysis | financial-statements, ratios, valuation, red-flags | Rendered by the guide template with the "Ask AI" callbacks removed (no chat sidebar); body text unchanged |
| `src/pages/TechnicalAnalysis.tsx` (`TechnicalAnalysisContent`, ~1,300 words) | `/vault/guides/technical-analysis-course` | Markets and Instruments | technical-analysis, equities | same |

**Flag V3:** the existing 301s `/learn/fundamental-analysis` (to `/learn/foundations/valuation`) and `/learn/technical-analysis` (to the primer) would be repointed to these two restored courses, which were the original pages at those URLs. Confirm, or keep them pointing at the Foundations topics.

### 4.4 Financial Glossary (178)
`/learn/glossary` 301 to `/vault/glossary` (with `?q=` preserved; the `WebSite.SearchAction` target updates). Every term `/learn/glossary/[slug]` 301 to `/vault/glossary/[slug]`, slug unchanged, except the five collisions where the second entry (all in category "Basics of Stock Market") gets a `-basics` suffix and each pair cross-links:

| Term | Entry 1 (id, category) keeps | Entry 2 (id, category) becomes |
|---|---|---|
| Market Cap | `/vault/glossary/market-cap` (`market-cap`, Fundamentals) | `/vault/glossary/market-cap-basics` (`market-cap-2`) |
| Book Value | `/vault/glossary/book-value` (`book-value`, Fundamentals) | `/vault/glossary/book-value-basics` (`book-value-2`) |
| Face Value | `/vault/glossary/face-value` (`face-value`, Fundamentals) | `/vault/glossary/face-value-basics` (`face-value-basics`) |
| Demat Account | `/vault/glossary/demat-account` (`demat`, Regulatory Compliance) | `/vault/glossary/demat-account-basics` (`demat-account`) |
| LTCG | `/vault/glossary/ltcg` (`ltcg`, Taxation) | `/vault/glossary/ltcg-basics` (`ltcg-stock`) |

Slugs will be stored explicitly on each entry (new `slug` field) instead of derived from the term, so this cannot recur. The 235 unresolved `relatedTerms` strings will be validated at build: matches link, non-matches render as plain text (no dead links). Glossary category to tags:

| Category (count) | Tags |
|---|---|
| Basics of Stock Market (62) | equities, indian-markets |
| Credit & Debt (15) | credit-risk, bonds |
| Investment Planning (13) | personal-finance |
| Valuation Ratios (13) | ratios, valuation |
| Profitability Ratios (11) | ratios, profitability |
| Regulatory Compliance (10) | regulation |
| Macroeconomics (10) | macroeconomics |
| Technical Analysis (8) | technical-analysis |
| Risk & Portfolio (7) | personal-finance, equities |
| ESG & Governance (6) | esg, corporate-governance |
| Taxation (5) | taxation |
| Fundamentals (5) | financial-statements |
| Fintech (5) | fintech |
| Liquidity Ratios (2) | ratios, liquidity |
| Solvency Ratios (2) | ratios, leverage |
| Mutual Funds (2) | funds-and-etfs |
| Efficiency Ratios (1) | ratios, efficiency |
| Indices (1) | indian-markets |

Full per-term list: Appendix A (178 rows).

### 4.5 Model Templates & Interactive (13 calculators + 5 lessons)
`/tools` and `/learn/by-doing` both 301 to `/vault/interactive` (one hub, two groups: Calculators, Interactive Lessons). Entries keep their slugs.

| Old URL | New URL | Kind | Tags |
|---|---|---|---|
| `/tools/dcf-sensitivity` | `/vault/interactive/dcf-sensitivity` | calculator | dcf, valuation |
| `/tools/cagr` | `/vault/interactive/cagr` | calculator | growth, personal-finance |
| `/tools/wacc` | `/vault/interactive/wacc` | calculator | cost-of-capital, dcf |
| `/tools/sip` | `/vault/interactive/sip` | calculator | personal-finance, funds-and-etfs |
| `/tools/future-value` | `/vault/interactive/future-value` | calculator | personal-finance |
| `/tools/present-value` | `/vault/interactive/present-value` | calculator | dcf, personal-finance |
| `/tools/compound-interest` | `/vault/interactive/compound-interest` | calculator | personal-finance |
| `/tools/rule-of-72` | `/vault/interactive/rule-of-72` | calculator | personal-finance |
| `/tools/step-up-sip` | `/vault/interactive/step-up-sip` | calculator | personal-finance, funds-and-etfs |
| `/tools/goal-sip` | `/vault/interactive/goal-sip` | calculator | personal-finance, funds-and-etfs |
| `/tools/emi` | `/vault/interactive/emi` | calculator | personal-finance |
| `/tools/loan-prepayment` | `/vault/interactive/loan-prepayment` | calculator | personal-finance |
| `/tools/inflation-adjusted-returns` | `/vault/interactive/inflation-adjusted-returns` | calculator | personal-finance, macroeconomics |
| `/learn/by-doing/build-a-dcf` | `/vault/interactive/build-a-dcf` | lesson | dcf, valuation |
| `/learn/by-doing/read-an-income-statement` | `/vault/interactive/read-an-income-statement` | lesson | financial-statements |
| `/learn/by-doing/compute-ratios` | `/vault/interactive/compute-ratios` | lesson | ratios, financial-statements |
| `/learn/by-doing/compare-two-companies` | `/vault/interactive/compare-two-companies` | lesson | ratios, equities |
| `/learn/by-doing/spot-the-red-flags` | `/vault/interactive/spot-the-red-flags` | lesson | red-flags, earnings-quality |
| `/calculators` (legacy 301) | `/vault/interactive` | | repointed |
| `/learn/by-doing/[unknown]` | 404 | | the "coming soon" catch-all is retired; unknown slugs 404 with `noindex` |

## 5. About

| Old URL | New URL | Notes |
|---|---|---|
| `/about` | `/about` | hub, unchanged URL |
| `/about/site` | `/about/site` | About the Site |
| `/about/author` | `/about/author` | About the Author |
| `/about/methodology` | `/about/philosophy` (301) | Editorial Philosophy; body text unchanged |
| (none) | `/about/contact` | new: email, LinkedIn, response-time note; the footer's mailto becomes a link here |
| `/privacy` (footer, 404 today) | `/about/privacy` (301 from `/privacy`) | new stub: what is collected (Umami analytics, newsletter email, Supabase auth), no ads, contact |
| `/disclaimer` (footer, 404 today) | `/about/disclaimer` (301 from `/disclaimer`) | new stub: not investment advice, no SEBI registration claim, sources and errors |
| `/terms` (Signup page, 404 today) | **Flag AB1:** propose `/about/terms` stub (301 from `/terms`) so the Sign-up page's "Terms" link is honest; otherwise point it at `/about/disclaimer` | |

## 6. Archive (legacy personal-finance articles, 11)

`/archive` index plus `/archive/[slug]`, sourced from `src/data/articles.ts` (no Supabase needed); the page keeps the legacy `Quiz` and bookmark features that already exist for these articles. Legacy `/learn/[slug]` 301 to `/archive/[slug]` for the 11 slugs; the `/learn/:slug` catch-all route redirects any other slug to `/archive/:slug`, which falls back to a Supabase lookup for rows that exist only in the database (the 3 seed articles `understanding-ipos`, `stock-market-taxes`, `mutual-funds-vs-equity`, if present).

| Old URL (`/learn/…`) | New URL (`/archive/…`) | Legacy category | Tags |
|---|---|---|---|
| compound-interest-basics | compound-interest-basics | investing | personal-finance |
| index-funds-101 | index-funds-101 | investing | personal-finance, funds-and-etfs |
| building-emergency-fund | building-emergency-fund | budgeting | personal-finance |
| 50-30-20-budgeting | 50-30-20-budgeting | budgeting | personal-finance |
| credit-score-explained | credit-score-explained | credit | personal-finance, credit-risk |
| retirement-planning-basics | retirement-planning-basics | retirement | personal-finance |
| tax-deductions-guide | tax-deductions-guide | taxes | personal-finance, taxation |
| debt-payoff-strategies | debt-payoff-strategies | credit | personal-finance |
| stock-market-myths | stock-market-myths | investing | equities, personal-finance |
| pe-ratio-explained | pe-ratio-explained | fundamental-analysis | ratios, valuation |
| technical-analysis-basics | technical-analysis-basics | technical-analysis | technical-analysis |

**Flag AR1:** indexing. These are beginner, non-India-specific pieces from 2024. Proposed: reachable, linked from the footer, but `noindex` and excluded from the sitemap so they do not dilute the site's Indian-markets focus. Alternative: index them at low sitemap priority.

## 7. Tags (40)

Proposed list, applied by the rules in sections 2 to 6 (no auto-generation, one archive page per tag that has at least one item; tags with zero items get no page):

valuation, dcf, relative-valuation, cost-of-capital, financial-statements, cash-flow, earnings-quality, red-flags, ratios, profitability, leverage, liquidity, efficiency, growth, banking, credit-risk, bonds, equities, derivatives, funds-and-etfs, technical-analysis, esg, green-finance, corporate-governance, climate-risk, esg-reporting, fintech, payments, digital-lending, blockchain, cybersecurity, data-and-tools, excel, python, sql, personal-finance, taxation, regulation, macroeconomics, indian-markets, methodology.

(41 listed; `methodology` applies to one article and can be dropped to stay at 40. **Flag T1.**) Existing research `tags` front-matter is kept as data; the display tags are normalised to this list (e.g. "P/E ratio" to `relative-valuation`, "forensic accounting" to `red-flags`).

## 8. Pages outside the taxonomy (unchanged URLs)

`/login`, `/signup`, `/admin-login`, `/auth/callback`, `/forgot-password`, `/reset-password`, `/dashboard`, `/settings`, `/admin/*`, `/community`, `/community/post/:id`, `/migration`, `*` (404). Not in nav, `noindex` added where missing. **Flag O1:** `/migration` has no auth gate; proposed to wrap it in `AdminRoute` during Phase 3 Step 2 (bug fix, no content change). `Dashboard` bookmark cards will link to `/archive/[slug]` instead of the dead `/article/[id]`.

Orphan shells kept as files, unrouted (owner decision): `Article.tsx`, `Calculators.tsx`, `Categories.tsx`, `Category.tsx`, `Compliance.tsx`, `Learn.tsx`, `Stocks.tsx`. Unused components (`NavLink`, `AuthSocial`, `PhoneLogin`, `FloatingChat`, `BadgeCard`, `DefinitionsGrid`) kept as files.

## 9. New pages introduced

`/news`, `/analysis`, `/esg` (+ sub-section landings), `/vault`, `/vault/guides/[track]` x9, `/vault/interactive` (merged hub), `/about/philosophy` (renamed), `/about/contact`, `/about/privacy`, `/about/disclaimer` (+ `/about/terms` if AB1 approved), `/archive` (+11), `/tags` and `/tags/[tag]`, `/vault/guides/fundamental-analysis-course`, `/vault/guides/technical-analysis-course`. The home page is rebuilt to the prototype's 70/30 layout in Phase 3 Step 4 (hero lead story, news grid, sidebar with Latest, tag cloud, newsletter).

## 10. Redirect map (Netlify `_redirects`, 301s above the SPA catch-all)

Order matters: specific rules before splats, splats before `/learn/:slug`, catch-all last.

```
# Research
/research                                                   /analysis                                                        301
/research/how-the-valuation-node-approaches-research        /analysis/op-eds/how-the-valuation-node-approaches-research      301
/research/three-years-cash-flow-what-one-year-hides         /analysis/valuation-modeling/three-years-cash-flow-what-one-year-hides 301
/research/roe-comparison-dupont-why-higher-isnt-better      /analysis/valuation-modeling/roe-comparison-dupont-why-higher-isnt-better 301
/research/high-pe-what-it-implies-and-when-its-a-trap       /analysis/valuation-modeling/high-pe-what-it-implies-and-when-its-a-trap 301
/research/five-red-flags-financial-statements               /analysis/valuation-modeling/five-red-flags-financial-statements 301
/research/profitable-but-out-of-cash                        /analysis/valuation-modeling/profitable-but-out-of-cash          301
/research/terminal-value-dominates-valuations               /analysis/valuation-modeling/terminal-value-dominates-valuations 301
/research/what-credit-ratings-measure-and-miss              /analysis/op-eds/what-credit-ratings-measure-and-miss            301
/research/why-banks-cannot-be-valued-like-normal-companies  /analysis/industry-analysis/why-banks-cannot-be-valued-like-normal-companies 301
# Markets
/markets                 /news                                              301
/markets/nifty50         /news/indian-economy/nifty-50                      301
/markets/compliance      /news/policy-regulation/compliance-calendar        301
/stocks                  /news/indian-economy/nifty-50                      301
/compliance              /news/policy-regulation/compliance-calendar        301
# Vault: glossary (5 collisions first, then splat)
/learn/glossary          /vault/glossary                                    301
/learn/glossary/*        /vault/glossary/:splat                             301
# Vault: formulas
/learn/ratio-analysis    /vault/formulas                                    301
/learn/ratio-analysis/*  /vault/formulas/:splat                             301
# Vault: guides
/learn/foundations                    /vault/guides                         301
/learn/foundations/:section           /vault/guides/:section                301
/learn/foundations/:section/:topic    /vault/guides/:topic                  301
/learn/fundamental-analysis           /vault/guides/fundamental-analysis-course   301   (Flag V3)
/learn/technical-analysis             /vault/guides/technical-analysis-course     301   (Flag V3)
/learn/basics                         /vault/guides                         301
/learn/wiki                           /vault/glossary                       301
# Vault: interactive
/tools                   /vault/interactive                                 301
/tools/*                 /vault/interactive/:splat                          301
/learn/by-doing          /vault/interactive                                 301
/learn/by-doing/*        /vault/interactive/:splat                          301
/calculators             /vault/interactive                                 301
# Learn hub and legacy articles (after all /learn/... rules above)
/learn                   /vault                                             301
/learn/*                 /archive/:splat                                    301
# About
/about/methodology       /about/philosophy                                  301
/privacy                 /about/privacy                                     301
/disclaimer              /about/disclaimer                                  301
/terms                   /about/terms                                       301   (Flag AB1)
# Zoho verification (existing) then SPA fallback, last
/zohoverify/verifyforzoho.html  /zohoverify/verifyforzoho.html  200!
/*                       /index.html                                        200
```

The five glossary collision slugs need no redirect: the first entry keeps the old slug and the second entry never had a reachable URL. `netlify.toml` keeps only headers; its seven duplicate redirect rules move here so there is one source of truth. The same map is mirrored as `<Navigate>` routes in `App.tsx` for client-side navigation and for any host that ignores `_redirects`.

## 11. Content model (for Phase 3 Step 1, shown here so the mapping and schema agree)

Every page resolves to this shape (research via front-matter; Foundations, ratios, tools, lessons, glossary, archive via a `meta` block on their data records; hubs via a static registry):

`title, slug, section, subsection, tags[], summary (15 to 25 words), publishDate, updatedDate, featuredImage, imageAlt, readingTime, author, status (published | draft | archived)`.

Where `summary` does not exist it is drafted and listed in `SUMMARIES-TO-WRITE.md` marked NEEDS REVIEW (research excerpts and glossary definitions already qualify; Foundations, ratios, tools, lessons need drafts). `og:title` and `og:description` fall back to `title` and `summary` on every page (fixes the 248-page gap). Foundations `lastReviewed: "July 2025"` becomes `updatedDate: 2025-07-01` (**Flag C1:** confirm the day, or supply real dates).

## 12. Open flags summary

| Flag | Decision needed |
|---|---|
| N1 | Fintech guides stay in the Vault, Technology & AI aggregates the `fintech` tag |
| A1 | "How TVN approaches research": Op-Eds (proposed) or About/Editorial Philosophy |
| A2 | ROE/DuPont piece: Valuation & Financial Modeling (proposed) or Case Studies |
| A3 | Credit ratings draft: Op-Eds (proposed) or Industry Analysis |
| V1 | Track landings at `/vault/guides/[track]` (proposed) or `?track=` query |
| V2 | ESG sub-section to guide mapping as listed in 4.3 |
| V3 | Repoint `/learn/fundamental-analysis` and `/learn/technical-analysis` to the restored courses |
| AB1 | Create `/about/terms` stub |
| AR1 | Archive pages `noindex` and out of sitemap (proposed) or indexed low priority |
| T1 | Drop `methodology` to keep exactly 40 tags |
| O1 | Gate `/migration` behind `AdminRoute` |
| C1 | Foundations `updatedDate` = 2025-07-01 |

## Appendix A: glossary mapping (178 entries)

Generated from `src/data/definitions.json`. Old URL is the term's current slug; the five
second entries of duplicated terms have never been reachable and receive a `-basics` slug.
Tags follow the category table in 4.4.

| Term | Category | Old URL | New URL | Tags |
|---|---|---|---|---|
| Future Value | Investment Planning | /learn/glossary/future-value | /vault/glossary/future-value | personal-finance |
| Present Value | Investment Planning | /learn/glossary/present-value | /vault/glossary/present-value | personal-finance |
| SIP | Investment Planning | /learn/glossary/sip | /vault/glossary/sip | personal-finance |
| CAGR | Investment Planning | /learn/glossary/cagr | /vault/glossary/cagr | personal-finance |
| Rule of 72 | Investment Planning | /learn/glossary/rule-of-72 | /vault/glossary/rule-of-72 | personal-finance |
| EMI | Investment Planning | /learn/glossary/emi | /vault/glossary/emi | personal-finance |
| Real Return | Investment Planning | /learn/glossary/real-return | /vault/glossary/real-return | personal-finance |
| Simple Interest | Investment Planning | /learn/glossary/simple-interest | /vault/glossary/simple-interest | personal-finance |
| Compound Interest | Investment Planning | /learn/glossary/compound-interest | /vault/glossary/compound-interest | personal-finance |
| NPV | Investment Planning | /learn/glossary/npv | /vault/glossary/npv | personal-finance |
| EPS | Profitability Ratios | /learn/glossary/eps | /vault/glossary/eps | ratios, profitability |
| ROE | Profitability Ratios | /learn/glossary/roe | /vault/glossary/roe | ratios, profitability |
| ROA | Profitability Ratios | /learn/glossary/roa | /vault/glossary/roa | ratios, profitability |
| ROCE | Profitability Ratios | /learn/glossary/roce | /vault/glossary/roce | ratios, profitability |
| Net Profit Margin | Profitability Ratios | /learn/glossary/net-profit-margin | /vault/glossary/net-profit-margin | ratios, profitability |
| EBITDA Margin | Profitability Ratios | /learn/glossary/ebitda-margin | /vault/glossary/ebitda-margin | ratios, profitability |
| P/E Ratio | Valuation Ratios | /learn/glossary/p-e-ratio | /vault/glossary/p-e-ratio | ratios, valuation |
| P/B Ratio | Valuation Ratios | /learn/glossary/p-b-ratio | /vault/glossary/p-b-ratio | ratios, valuation |
| PEG Ratio | Valuation Ratios | /learn/glossary/peg-ratio | /vault/glossary/peg-ratio | ratios, valuation |
| Dividend Yield | Valuation Ratios | /learn/glossary/dividend-yield | /vault/glossary/dividend-yield | ratios, valuation |
| Enterprise Value | Valuation Ratios | /learn/glossary/enterprise-value | /vault/glossary/enterprise-value | ratios, valuation |
| EV/EBITDA | Valuation Ratios | /learn/glossary/ev-ebitda | /vault/glossary/ev-ebitda | ratios, valuation |
| Current Ratio | Liquidity Ratios | /learn/glossary/current-ratio | /vault/glossary/current-ratio | ratios, liquidity |
| Quick Ratio | Liquidity Ratios | /learn/glossary/quick-ratio | /vault/glossary/quick-ratio | ratios, liquidity |
| Debt-to-Equity | Solvency Ratios | /learn/glossary/debt-to-equity | /vault/glossary/debt-to-equity | ratios, leverage |
| Interest Coverage | Solvency Ratios | /learn/glossary/interest-coverage | /vault/glossary/interest-coverage | ratios, leverage |
| Asset Turnover | Efficiency Ratios | /learn/glossary/asset-turnover | /vault/glossary/asset-turnover | ratios, efficiency |
| RSI | Technical Analysis | /learn/glossary/rsi | /vault/glossary/rsi | technical-analysis |
| MACD | Technical Analysis | /learn/glossary/macd | /vault/glossary/macd | technical-analysis |
| Bollinger Bands | Technical Analysis | /learn/glossary/bollinger-bands | /vault/glossary/bollinger-bands | technical-analysis |
| ATR | Technical Analysis | /learn/glossary/atr | /vault/glossary/atr | technical-analysis |
| Fibonacci Levels | Technical Analysis | /learn/glossary/fibonacci-levels | /vault/glossary/fibonacci-levels | technical-analysis |
| OBV | Technical Analysis | /learn/glossary/obv | /vault/glossary/obv | technical-analysis |
| Stochastic | Technical Analysis | /learn/glossary/stochastic | /vault/glossary/stochastic | technical-analysis |
| EMA | Technical Analysis | /learn/glossary/ema | /vault/glossary/ema | technical-analysis |
| SEBI LODR | Regulatory Compliance | /learn/glossary/sebi-lodr | /vault/glossary/sebi-lodr | regulation |
| SEBI PIT | Regulatory Compliance | /learn/glossary/sebi-pit | /vault/glossary/sebi-pit | regulation |
| SEBI SAST | Regulatory Compliance | /learn/glossary/sebi-sast | /vault/glossary/sebi-sast | regulation |
| SEBI ICDR | Regulatory Compliance | /learn/glossary/sebi-icdr | /vault/glossary/sebi-icdr | regulation |
| Account Aggregator | Regulatory Compliance | /learn/glossary/account-aggregator | /vault/glossary/account-aggregator | regulation |
| Demat Account | Regulatory Compliance | /learn/glossary/demat-account | /vault/glossary/demat-account | regulation |
| MCA Form AOC-4 | Regulatory Compliance | /learn/glossary/mca-form-aoc-4 | /vault/glossary/mca-form-aoc-4 | regulation |
| MCA Form MGT-7 | Regulatory Compliance | /learn/glossary/mca-form-mgt-7 | /vault/glossary/mca-form-mgt-7 | regulation |
| T+1 Settlement | Regulatory Compliance | /learn/glossary/t-1-settlement | /vault/glossary/t-1-settlement | regulation |
| Circuit Breakers | Regulatory Compliance | /learn/glossary/circuit-breakers | /vault/glossary/circuit-breakers | regulation |
| Beta | Risk & Portfolio | /learn/glossary/beta | /vault/glossary/beta | personal-finance, equities |
| Sharpe Ratio | Risk & Portfolio | /learn/glossary/sharpe-ratio | /vault/glossary/sharpe-ratio | personal-finance, equities |
| Treynor Ratio | Risk & Portfolio | /learn/glossary/treynor-ratio | /vault/glossary/treynor-ratio | personal-finance, equities |
| CAPM | Risk & Portfolio | /learn/glossary/capm | /vault/glossary/capm | personal-finance, equities |
| WACC | Risk & Portfolio | /learn/glossary/wacc | /vault/glossary/wacc | personal-finance, equities |
| Standard Deviation | Risk & Portfolio | /learn/glossary/standard-deviation | /vault/glossary/standard-deviation | personal-finance, equities |
| Alpha | Risk & Portfolio | /learn/glossary/alpha | /vault/glossary/alpha | personal-finance, equities |
| STCG | Taxation | /learn/glossary/stcg | /vault/glossary/stcg | taxation |
| LTCG | Taxation | /learn/glossary/ltcg | /vault/glossary/ltcg | taxation |
| GST | Taxation | /learn/glossary/gst | /vault/glossary/gst | taxation |
| Section 80C | Taxation | /learn/glossary/section-80c | /vault/glossary/section-80c | taxation |
| STT | Taxation | /learn/glossary/stt | /vault/glossary/stt | taxation |
| Market Cap | Fundamentals | /learn/glossary/market-cap | /vault/glossary/market-cap | financial-statements |
| Book Value | Fundamentals | /learn/glossary/book-value | /vault/glossary/book-value | financial-statements |
| NAV | Mutual Funds | /learn/glossary/nav | /vault/glossary/nav | funds-and-etfs |
| Expense Ratio | Mutual Funds | /learn/glossary/expense-ratio | /vault/glossary/expense-ratio | funds-and-etfs |
| Free Float | Fundamentals | /learn/glossary/free-float | /vault/glossary/free-float | financial-statements |
| Face Value | Fundamentals | /learn/glossary/face-value | /vault/glossary/face-value | financial-statements |
| Nifty 50 | Indices | /learn/glossary/nifty-50 | /vault/glossary/nifty-50 | indian-markets |
| LTCG | Basics of Stock Market | (unreachable today) | /vault/glossary/ltcg-basics (collision, new slug) | equities, indian-markets |
| Dividend | Basics of Stock Market | /learn/glossary/dividend | /vault/glossary/dividend | equities, indian-markets |
| Face Value | Basics of Stock Market | (unreachable today) | /vault/glossary/face-value-basics (collision, new slug) | equities, indian-markets |
| Promoter | Basics of Stock Market | /learn/glossary/promoter | /vault/glossary/promoter | equities, indian-markets |
| Top Line & Bottom Line | Basics of Stock Market | /learn/glossary/top-line-bottom-line | /vault/glossary/top-line-bottom-line | equities, indian-markets |
| Share Split | Basics of Stock Market | /learn/glossary/share-split | /vault/glossary/share-split | equities, indian-markets |
| Bonus Shares | Basics of Stock Market | /learn/glossary/bonus-shares | /vault/glossary/bonus-shares | equities, indian-markets |
| Price Discovery | Basics of Stock Market | /learn/glossary/price-discovery | /vault/glossary/price-discovery | equities, indian-markets |
| Securities Market Types | Basics of Stock Market | /learn/glossary/securities-market-types | /vault/glossary/securities-market-types | equities, indian-markets |
| DEMAT Account | Basics of Stock Market | (unreachable today) | /vault/glossary/demat-account-basics (collision, new slug) | equities, indian-markets |
| Savings Account | Basics of Stock Market | /learn/glossary/savings-account | /vault/glossary/savings-account | equities, indian-markets |
| Trading Account | Basics of Stock Market | /learn/glossary/trading-account | /vault/glossary/trading-account | equities, indian-markets |
| DEMAT Documents | Basics of Stock Market | /learn/glossary/demat-documents | /vault/glossary/demat-documents | equities, indian-markets |
| Contract Note | Basics of Stock Market | /learn/glossary/contract-note | /vault/glossary/contract-note | equities, indian-markets |
| Settlement Date | Basics of Stock Market | /learn/glossary/settlement-date | /vault/glossary/settlement-date | equities, indian-markets |
| LTP | Basics of Stock Market | /learn/glossary/ltp | /vault/glossary/ltp | equities, indian-markets |
| Pre-opening Session | Basics of Stock Market | /learn/glossary/pre-opening-session | /vault/glossary/pre-opening-session | equities, indian-markets |
| AMO | Basics of Stock Market | /learn/glossary/amo | /vault/glossary/amo | equities, indian-markets |
| Gap Up | Basics of Stock Market | /learn/glossary/gap-up | /vault/glossary/gap-up | equities, indian-markets |
| Gap Down | Basics of Stock Market | /learn/glossary/gap-down | /vault/glossary/gap-down | equities, indian-markets |
| Announcement Date | Basics of Stock Market | /learn/glossary/announcement-date | /vault/glossary/announcement-date | equities, indian-markets |
| Record Date | Basics of Stock Market | /learn/glossary/record-date | /vault/glossary/record-date | equities, indian-markets |
| Investor Types | Basics of Stock Market | /learn/glossary/investor-types | /vault/glossary/investor-types | equities, indian-markets |
| Depositories | Basics of Stock Market | /learn/glossary/depositories | /vault/glossary/depositories | equities, indian-markets |
| DP | Basics of Stock Market | /learn/glossary/dp | /vault/glossary/dp | equities, indian-markets |
| Corporate Actions | Basics of Stock Market | /learn/glossary/corporate-actions | /vault/glossary/corporate-actions | equities, indian-markets |
| Volume | Basics of Stock Market | /learn/glossary/volume | /vault/glossary/volume | equities, indian-markets |
| Trading System | Basics of Stock Market | /learn/glossary/trading-system | /vault/glossary/trading-system | equities, indian-markets |
| Order Types | Basics of Stock Market | /learn/glossary/order-types | /vault/glossary/order-types | equities, indian-markets |
| Bullish & Bearish | Basics of Stock Market | /learn/glossary/bullish-bearish | /vault/glossary/bullish-bearish | equities, indian-markets |
| Short Sell | Basics of Stock Market | /learn/glossary/short-sell | /vault/glossary/short-sell | equities, indian-markets |
| Auction | Basics of Stock Market | /learn/glossary/auction | /vault/glossary/auction | equities, indian-markets |
| Stop Loss | Basics of Stock Market | /learn/glossary/stop-loss | /vault/glossary/stop-loss | equities, indian-markets |
| Circuit Filter | Basics of Stock Market | /learn/glossary/circuit-filter | /vault/glossary/circuit-filter | equities, indian-markets |
| Trend Analysis | Basics of Stock Market | /learn/glossary/trend-analysis | /vault/glossary/trend-analysis | equities, indian-markets |
| Market Cap | Basics of Stock Market | (unreachable today) | /vault/glossary/market-cap-basics (collision, new slug) | equities, indian-markets |
| Ring Trading | Basics of Stock Market | /learn/glossary/ring-trading | /vault/glossary/ring-trading | equities, indian-markets |
| Block Deal | Basics of Stock Market | /learn/glossary/block-deal | /vault/glossary/block-deal | equities, indian-markets |
| Order Quantity Types | Basics of Stock Market | /learn/glossary/order-quantity-types | /vault/glossary/order-quantity-types | equities, indian-markets |
| Bid-Ask Spread | Basics of Stock Market | /learn/glossary/bid-ask-spread | /vault/glossary/bid-ask-spread | equities, indian-markets |
| Indices | Basics of Stock Market | /learn/glossary/indices | /vault/glossary/indices | equities, indian-markets |
| Sector Indices | Basics of Stock Market | /learn/glossary/sector-indices | /vault/glossary/sector-indices | equities, indian-markets |
| Free Float Mcap | Basics of Stock Market | /learn/glossary/free-float-mcap | /vault/glossary/free-float-mcap | equities, indian-markets |
| Pledging | Basics of Stock Market | /learn/glossary/pledging | /vault/glossary/pledging | equities, indian-markets |
| Lot Size | Basics of Stock Market | /learn/glossary/lot-size | /vault/glossary/lot-size | equities, indian-markets |
| IPO vs OFS | Basics of Stock Market | /learn/glossary/ipo-vs-ofs | /vault/glossary/ipo-vs-ofs | equities, indian-markets |
| FPO | Basics of Stock Market | /learn/glossary/fpo | /vault/glossary/fpo | equities, indian-markets |
| Book Value | Basics of Stock Market | (unreachable today) | /vault/glossary/book-value-basics (collision, new slug) | equities, indian-markets |
| Merchant Banker | Basics of Stock Market | /learn/glossary/merchant-banker | /vault/glossary/merchant-banker | equities, indian-markets |
| Price Band | Basics of Stock Market | /learn/glossary/price-band | /vault/glossary/price-band | equities, indian-markets |
| Book Building | Basics of Stock Market | /learn/glossary/book-building | /vault/glossary/book-building | equities, indian-markets |
| Prospectus | Basics of Stock Market | /learn/glossary/prospectus | /vault/glossary/prospectus | equities, indian-markets |
| Primary Market | Basics of Stock Market | /learn/glossary/primary-market | /vault/glossary/primary-market | equities, indian-markets |
| Underwriter | Basics of Stock Market | /learn/glossary/underwriter | /vault/glossary/underwriter | equities, indian-markets |
| IPO Listing | Basics of Stock Market | /learn/glossary/ipo-listing | /vault/glossary/ipo-listing | equities, indian-markets |
| Price Determination | Basics of Stock Market | /learn/glossary/price-determination | /vault/glossary/price-determination | equities, indian-markets |
| EV/Sales | Valuation Ratios | /learn/glossary/ev-sales | /vault/glossary/ev-sales | ratios, valuation |
| FCF Yield | Valuation Ratios | /learn/glossary/fcf-yield | /vault/glossary/fcf-yield | ratios, valuation |
| Earnings Yield | Valuation Ratios | /learn/glossary/earnings-yield | /vault/glossary/earnings-yield | ratios, valuation |
| Dividend Payout Ratio | Valuation Ratios | /learn/glossary/dividend-payout-ratio | /vault/glossary/dividend-payout-ratio | ratios, valuation |
| Terminal Value | Valuation Ratios | /learn/glossary/terminal-value | /vault/glossary/terminal-value | ratios, valuation |
| Margin of Safety | Valuation Ratios | /learn/glossary/margin-of-safety | /vault/glossary/margin-of-safety | ratios, valuation |
| Book Value per Share | Valuation Ratios | /learn/glossary/book-value-per-share | /vault/glossary/book-value-per-share | ratios, valuation |
| ROIC | Profitability Ratios | /learn/glossary/roic | /vault/glossary/roic | ratios, profitability |
| NOPAT | Profitability Ratios | /learn/glossary/nopat | /vault/glossary/nopat | ratios, profitability |
| Operating Leverage | Profitability Ratios | /learn/glossary/operating-leverage | /vault/glossary/operating-leverage | ratios, profitability |
| Gross Margin | Profitability Ratios | /learn/glossary/gross-margin | /vault/glossary/gross-margin | ratios, profitability |
| Operating Margin | Profitability Ratios | /learn/glossary/operating-margin | /vault/glossary/operating-margin | ratios, profitability |
| Yield to Maturity | Credit & Debt | /learn/glossary/yield-to-maturity | /vault/glossary/yield-to-maturity | credit-risk, bonds |
| Credit Spread | Credit & Debt | /learn/glossary/credit-spread | /vault/glossary/credit-spread | credit-risk, bonds |
| Credit Rating | Credit & Debt | /learn/glossary/credit-rating | /vault/glossary/credit-rating | credit-risk, bonds |
| DSCR | Credit & Debt | /learn/glossary/dscr | /vault/glossary/dscr | credit-risk, bonds |
| Coupon Rate | Credit & Debt | /learn/glossary/coupon-rate | /vault/glossary/coupon-rate | credit-risk, bonds |
| Duration | Credit & Debt | /learn/glossary/duration | /vault/glossary/duration | credit-risk, bonds |
| NPA | Credit & Debt | /learn/glossary/npa | /vault/glossary/npa | credit-risk, bonds |
| Covenant | Credit & Debt | /learn/glossary/covenant | /vault/glossary/covenant | credit-risk, bonds |
| Promoter Pledge | Credit & Debt | /learn/glossary/promoter-pledge | /vault/glossary/promoter-pledge | credit-risk, bonds |
| Working Capital Cycle | Credit & Debt | /learn/glossary/working-capital-cycle | /vault/glossary/working-capital-cycle | credit-risk, bonds |
| Bonus Issue | Basics of Stock Market | /learn/glossary/bonus-issue | /vault/glossary/bonus-issue | equities, indian-markets |
| Rights Issue | Basics of Stock Market | /learn/glossary/rights-issue | /vault/glossary/rights-issue | equities, indian-markets |
| Buyback | Basics of Stock Market | /learn/glossary/buyback | /vault/glossary/buyback | equities, indian-markets |
| Stock Split | Basics of Stock Market | /learn/glossary/stock-split | /vault/glossary/stock-split | equities, indian-markets |
| FPI | Basics of Stock Market | /learn/glossary/fpi | /vault/glossary/fpi | equities, indian-markets |
| DII | Basics of Stock Market | /learn/glossary/dii | /vault/glossary/dii | equities, indian-markets |
| Repo Rate | Macroeconomics | /learn/glossary/repo-rate | /vault/glossary/repo-rate | macroeconomics |
| Reverse Repo Rate | Macroeconomics | /learn/glossary/reverse-repo-rate | /vault/glossary/reverse-repo-rate | macroeconomics |
| CPI Inflation | Macroeconomics | /learn/glossary/cpi-inflation | /vault/glossary/cpi-inflation | macroeconomics |
| WPI | Macroeconomics | /learn/glossary/wpi | /vault/glossary/wpi | macroeconomics |
| GDP Growth | Macroeconomics | /learn/glossary/gdp-growth | /vault/glossary/gdp-growth | macroeconomics |
| Fiscal Deficit | Macroeconomics | /learn/glossary/fiscal-deficit | /vault/glossary/fiscal-deficit | macroeconomics |
| Current Account Deficit | Macroeconomics | /learn/glossary/current-account-deficit | /vault/glossary/current-account-deficit | macroeconomics |
| CRR | Macroeconomics | /learn/glossary/crr | /vault/glossary/crr | macroeconomics |
| SLR | Macroeconomics | /learn/glossary/slr | /vault/glossary/slr | macroeconomics |
| Basis Point | Macroeconomics | /learn/glossary/basis-point | /vault/glossary/basis-point | macroeconomics |
| ESG Score | ESG & Governance | /learn/glossary/esg-score | /vault/glossary/esg-score | esg, corporate-governance |
| BRSR | ESG & Governance | /learn/glossary/brsr | /vault/glossary/brsr | esg, corporate-governance |
| Related-Party Transaction | ESG & Governance | /learn/glossary/related-party-transaction | /vault/glossary/related-party-transaction | esg, corporate-governance |
| Independent Director | ESG & Governance | /learn/glossary/independent-director | /vault/glossary/independent-director | esg, corporate-governance |
| Promoter Holding | ESG & Governance | /learn/glossary/promoter-holding | /vault/glossary/promoter-holding | esg, corporate-governance |
| Greenwashing | ESG & Governance | /learn/glossary/greenwashing | /vault/glossary/greenwashing | esg, corporate-governance |
| UPI | Fintech | /learn/glossary/upi | /vault/glossary/upi | fintech |
| CBDC | Fintech | /learn/glossary/cbdc | /vault/glossary/cbdc | fintech |
| P2P Lending | Fintech | /learn/glossary/p2p-lending | /vault/glossary/p2p-lending | fintech |
| Payment Aggregator | Fintech | /learn/glossary/payment-aggregator | /vault/glossary/payment-aggregator | fintech |
| KYC | Fintech | /learn/glossary/kyc | /vault/glossary/kyc | fintech |
| XIRR | Investment Planning | /learn/glossary/xirr | /vault/glossary/xirr | personal-finance |
| Asset Allocation | Investment Planning | /learn/glossary/asset-allocation | /vault/glossary/asset-allocation | personal-finance |
| Rebalancing | Investment Planning | /learn/glossary/rebalancing | /vault/glossary/rebalancing | personal-finance |
| CASA Ratio | Credit & Debt | /learn/glossary/casa-ratio | /vault/glossary/casa-ratio | credit-risk, bonds |
| Cost of Funds | Credit & Debt | /learn/glossary/cost-of-funds | /vault/glossary/cost-of-funds | credit-risk, bonds |
| Net Interest Margin | Credit & Debt | /learn/glossary/net-interest-margin | /vault/glossary/net-interest-margin | credit-risk, bonds |
| Capital Adequacy Ratio | Credit & Debt | /learn/glossary/capital-adequacy-ratio | /vault/glossary/capital-adequacy-ratio | credit-risk, bonds |
| Provisions | Credit & Debt | /learn/glossary/provisions | /vault/glossary/provisions | credit-risk, bonds |
| Cash Flow from Operations | Fundamentals | /learn/glossary/cash-flow-from-operations | /vault/glossary/cash-flow-from-operations | financial-statements |
