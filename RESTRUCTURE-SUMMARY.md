# Restructure Summary

Branch `restructure-impl`, cut from `main` at `177a2f3`. Eight commits: audit, plan, and
one per implementation step. Nothing pushed. Companion files: `RESTRUCTURE-AUDIT.md`,
`RESTRUCTURE-PLAN.md`, `SUMMARIES-TO-WRITE.md`, `ALT-TEXT-TODO.md`, `public/_redirects`
(the redirect map).

Constraints held throughout: no article, page, component, or asset deleted; no article or
lesson body text rewritten (research bodies verified byte-identical after the front-matter
edits); every pre-existing URL 301s to its new home; one new dependency (driver.js, named
in the brief).

## Final numbers

| Measure | Before (audit) | After |
|---|---|---|
| Prerendered pages | 310 | 400 |
| Sitemap URLs | 315 (5 duplicates) | 380, no duplicates, drafts and hidden excluded |
| Pages missing og:title / og:description | 248 / 249 | 0 / 0 |
| Pages with a skipped heading level | 18 | 0 |
| Pages without breadcrumbs | most | 0 (home excepted by design) |
| Broken internal link targets | 2 site-wide + ~190 others | 0 |
| Glossary entries reachable | 173 of 178 | 178 of 178 |
| Old URLs verified to redirect to a live page | n/a | 324 of 324 |
| BreadcrumbList JSON-LD | 275 pages | 399 pages |
| Organization schema | home only, no logo | every page, linked to WebSite and Person |
| Draft articles visible to the public | listed on /research | never listed, never prerendered, noindex if opened |

## What moved

| Old | New |
|---|---|
| `/research`, `/research/:slug` | `/analysis`, `/analysis/[sub]/:slug` (4 published under valuation-modeling and op-eds; 5 drafts mapped but hidden) |
| `/markets`, `/markets/nifty50`, `/markets/compliance` | `/news`, `/news/indian-economy/nifty-50`, `/news/policy-regulation/compliance-calendar` |
| `/learn` | `/vault` |
| `/learn/glossary`, `/learn/glossary/:t` | `/vault/glossary`, `/vault/glossary/:t` (five duplicated terms get `-basics` slugs) |
| `/learn/ratio-analysis`, `/learn/ratio-analysis/:r` | `/vault/formulas`, `/vault/formulas/:r` |
| `/learn/foundations`, `/learn/foundations/:section`, `/learn/foundations/:section/:topic` | `/vault/guides`, `/vault/guides/:track` (9 new landings), `/vault/guides/:topic` |
| `/tools`, `/tools/:t`, `/learn/by-doing`, `/learn/by-doing/:l` | `/vault/interactive`, `/vault/interactive/:slug` (13 calculators + 5 lessons, one hub) |
| `/about/methodology` | `/about/philosophy` |
| `/learn/:legacy-article` | `/archive/:slug` (11 articles, noindex) |
| `/calculators`, `/stocks`, `/compliance`, `/learn/wiki`, `/learn/basics` | repointed to the new equivalents |
| `/learn/fundamental-analysis`, `/learn/technical-analysis` | `/vault/guides/fundamental-analysis-course`, `/vault/guides/technical-analysis-course` (the original course text, restored) |
| `/privacy`, `/disclaimer`, `/terms` (were 404) | `/about/privacy`, `/about/disclaimer`, `/about/terms` |

Redirects live in `public/_redirects` above the SPA catch-all (Netlify reads that file
first; the old `netlify.toml` rules were shadowed by it and never fired). The same rules
run client-side through `<LegacyRedirect/>` and `rewriteLegacyPath()`, which `Prose` also
applies to links inside article bodies so the bodies stayed untouched.

## What was added

- **Content model**: `src/lib/taxonomy.ts` (sections, sub-sections, 9 tracks, 40 tags),
  `src/lib/contentModel.ts` (PageMeta schema and resolvers), `src/lib/contentIndex.ts`
  (flat index of every content page), `src/lib/routes.ts` (path builders, legacy rewrite),
  `src/lib/siteRoutes.ts` (single route list for prerender and sitemap),
  `src/data/foundationsMeta.ts` (track, tags, draft summaries for 51 guides).
- **Head**: `src/components/seo/Seo.tsx`, adopted on every public page.
- **Pages**: section and sub-section landings (news, analysis, esg), Vault hub, 9 track
  landings, 2 restored courses, Interactive hub, Contact, Privacy, Disclaimer, Terms,
  Archive index and articles, Topics index and 40 tag archives, Search, Start Here.
- **Layout components** from the prototype: StickyNav (`Header.tsx`), SearchOverlay,
  ArticleCard, ContentList, Sidebar, Breadcrumbs, Footer; NewsletterSignup sidebar variant.
- **Design tokens**: prototype palette and fonts mapped onto the existing token system,
  with a derived dark theme (toggle kept).
- **Site tour**: driver.js, four steps, first visit only, bottom sheet on mobile.
- **Glossary**: explicit slugs, six new banking and cash-flow terms from the earlier
  session retained, related-term chips only link to terms that exist, duplicate pairs
  cross-link.
- **Nifty 50 page**: renders the 20 local rows in static HTML and swaps in Supabase rows
  on load; row click opens a fundamentals profile dialog.

## Bugs fixed (from the audit)

1. `_redirects` catch-all defeating every 301 in `netlify.toml`.
2. `/markets/nifty50` runtime crash (`StockScreener` rendered with no props).
3. Footer Privacy and Disclaimer links to non-existent pages on every page; Sign-up Terms link.
4. Header search navigating to dead `/compliance/:id`, `/stocks/:id`, `/learn/:id`, `/calculators/:id`.
5. Five research drafts listed publicly on `/research` and reachable without noindex.
6. Nine Foundations section hubs routable but never prerendered, canonicalising to the hub.
7. Five glossary entries unreachable behind slug collisions; sitemap listing them twice.
8. About 180 glossary "related term" links to terms that do not exist.
9. 248 pages without `og:title` / `og:description`; 19 without `og:url`.
10. Skipped heading levels on 18 pages; Newsletter `h3` after `h1`.
11. Dashboard bookmarks linking to `/article/:id`.
12. `/migration` routable with no auth gate (now admin-only).
13. Pages with no `<title>` or `noindex` (auth, settings, community, legacy article view).
14. Render-blocking Inter and Source Serif 4 font CSS (replaced by the prototype's system stack plus Merriweather).
15. `/learn/:slug` legacy article route reading the wrong param.

## Unresolved or needs the owner

1. **Verify the 301s on the live host** after deploy: `curl -I https://valuationnode.com/calculators`
   should return `301` with `Location: /vault/interactive`. If Netlify ever changes
   `_redirects` precedence, `netlify.toml` no longer carries a copy.
2. **Site tour runtime**: verified by build and static anchors only; no browser was
   available here. Check first-visit firing, Escape, overlay click, focus return, and the
   mobile bottom sheet once deployed.
3. **51 draft summaries** in `SUMMARIES-TO-WRITE.md` need a human rewrite (six truncated).
4. **Newsletter** still needs `VITE_BUTTONDOWN_API_KEY`; a Buttondown key in a `VITE_`
   variable ships to the browser, so a serverless proxy is the right fix.
5. **Formula pages**: the brief asked for a variable table; formulas are stored as single
   strings, so the page shows formula, worked example, interpretation, limitations, and
   related formulas without a variable table. Adding `variables: [{symbol, meaning}]` to
   `ratioAnalysis.ts` would complete it.
6. **Empty sub-sections** (Global Markets, Corporate Updates, Company Analysis, Business
   Strategy, Case Studies, Corporate Governance; Industry Analysis has only a draft) are
   routed, noindex, and hidden from menus until they have content.
7. **Archive** is noindex and out of the sitemap (owner decision AR1); 11 articles from
   `articles.ts`, plus a Supabase fallback for the 3 seed rows that exist only in the database.
8. **Legacy course "Ask AI" buttons** now open a glossary search for the topic; the chat
   sidebar is not part of the public site.
9. **Pre-existing TypeScript errors** in Supabase-typed files (`types.ts` is stale against
   the migrations) are unchanged; the production build does not type-check.
10. **Orphan shells kept as files, unrouted** (owner decision): `Article.tsx`, `Calculators.tsx`,
    `Categories.tsx`, `Category.tsx`, `Compliance.tsx`, `Learn.tsx`, `Stocks.tsx`,
    `ArticleView.tsx`, `LearnByDoing.tsx`, `LearnByDoingModule.tsx`, `Markets.tsx`, plus the
    unused components listed in the audit. Nothing was deleted.
11. **Images**: no content images exist to lazy-load or convert to WebP; see `ALT-TEXT-TODO.md`
    for the two visible gaps (article featured images, author photo).
12. **Prototype deviations, deliberate**: the hero image box is 16:9 (brief) rather than the
    prototype's fixed 350 px; the footer is navy (palette) where the prototype had none;
    dark mode is a derived theme the prototype does not define.
