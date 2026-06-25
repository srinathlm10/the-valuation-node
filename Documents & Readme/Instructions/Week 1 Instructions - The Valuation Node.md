# **Week 1 Instructions for Claude Code**

# **Contents of `docs/WEEK_1.md`**

I am rebranding and restructuring the existing FinBot India site into **The Valuation Node**, a finance research publication with a substantial public learning library, written by Srinath Gajji (MBA candidate at NIT Rourkela).

This is Week 1 of a multi-week restructure. The goal is the new architecture and a clean launchable foundation. Most content writing comes later.

**Critical constraints:**

* Continue using Supabase as the backend. Do not migrate.  
* Do not drop or rename existing Supabase tables. Schema additions are fine; deletions and renames are not.  
* Preserve all existing user data: articles, definitions, stocks, profiles, bookmarks, chat sessions.  
* Authentication has been buggy in the past. Step 17 is a complete auth rebuild. Treat it as the highest-priority step after global rebrand.  
* When restructuring existing content, prefer to leave the original intact with a TODO comment over rewriting it. I will rewrite content myself.  
* For any decision not specified, prefer simplicity over cleverness, and ask before introducing new dependencies.  
* All visual placeholders (logo, photo, OG image) should use clearly labeled placeholders, not random stock images.

Execute the following steps in order.

## **Step 1: Global rebrand from FinBot India to The Valuation Node**

* Replace every public-facing occurrence of "FinBot India" with "The Valuation Node" across components, page titles, meta tags, footer, and copy.  
* Update `index.html` title to: "The Valuation Node — Indian Markets Research and Learning"  
* Update meta description to: "Research and learning on Indian markets, by Srinath Gajji. Original valuations, credit analysis, and a public learning library covering accounting, valuation, credit, markets, ESG, and fintech."  
* Update Open Graph default image, title, description globally.  
* Rename the chat assistant from "FinBot" to "The Valuation Node Assistant" or "Assistant."  
* Update `package.json` name field, README references, and internal references.  
* Search the codebase for "FinBot," "AI-Powered Financial Intelligence," "Decoding Indian Finance," and other old positioning phrases. Update or remove them.

## **Step 2: Top-level navigation**

In `src/components/layout/Header.tsx`, replace the existing nav (Learn dropdown, Tools dropdown, Resources dropdown) with five top-level items in this exact order, left to right:

**Research | Learn | Tools | Markets | About**

Plus a "Subscribe" button on the right (opens newsletter signup modal or links to homepage signup section) and a search icon.

No dropdowns. Each item routes to its section index:

* Research → `/research`  
* Learn → `/learn`  
* Tools → `/tools`  
* Markets → `/markets`  
* About → `/about`

User menu (Dashboard, Settings, Logout) accessible via a profile icon for authenticated users only.

Hide from public navigation:

* Community (route stays in code, unlinked)  
* Compliance, Stocks, Calculators direct links (live under Markets and Tools)  
* Migration page  
* Admin (direct URL only)

## **Step 3: Homepage rebuild (`src/pages/Index.tsx`)**

Replace existing homepage entirely with this structure.

**Hero section:**

* Wordmark "The Valuation Node" (small, top-left or centered)  
* H1: "Research and learning on Indian markets."  
* Subhead: "Original valuation and credit analysis, plus a public learning library, by Srinath Gajji."  
* Primary CTA button: "Read the latest research" → most recent Research article, or `/research` if none  
* Secondary CTA button: "Explore the learning library" → `/learn`

**Featured article section:**

* Pulls the most recent Research article from Supabase  
* Large cover image, category badge, title (H2 link), 2-sentence excerpt, date, reading time, "Read article" link  
* Empty state if no articles: "Coming soon: first research piece"

**Recent research section:**

* Heading: "Recent research"  
* Up to 3 article cards in a row on desktop, stacked on mobile

**Featured learning section:**

* Heading: "From the learning library"  
* One large card linking to a flagship Foundations topic (default: `/learn/foundations/valuation/dcf-theory-and-mechanics`, even if placeholder)  
* Small grid of 3 to 4 other Foundations topics or one Learn-by-Doing teaser  
* "Explore the library →" link to `/learn`

**About \+ Newsletter section:**

* Two-column on desktop, stacked on mobile  
* Left: author photo placeholder, name "Srinath Gajji," one-paragraph bio, "Read more about the site →" link to `/about`  
* Right: `<NewsletterSignup />` component (built in Step 14\)

**Footer:** built in Step 15\.

Remove from homepage: feature tile cards for Compliance/Stocks/Lab/Calculators, calculators preview, compliance feed preview, "Master the Markets" section, live status indicator.

## **Step 4: Research section**

Create `src/pages/Research.tsx` (index) and `src/pages/ResearchArticle.tsx` (template).

**Research index (`/research`):**

* Title: "Research"  
* Subtitle: "Original analysis of Indian companies, sectors, and credit. All work is authored, dated, and shows its sources."  
* Category filter bar at top: All | Valuation | Credit | Sector | ESG | Fintech | Methodology  
* Article cards in a grid, newest first, 10 per page  
* Empty state with newsletter signup if no articles

**Research article template (`/research/[slug]`):**

Each article includes, in this order:

1. Title (H1)  
2. Optional dek (italic, one sentence)  
3. Author byline with photo: "By Srinath Gajji, Founder, The Valuation Node"  
4. Publish date and Last updated date  
5. Reading time  
6. Category and subject tags  
7. Methodology box (collapsible, default open): data sources, valuation date, key assumptions, limitations  
8. Main body content (Markdown renderer, current implementation)  
9. Support for embedded React components inline (DCF widgets, sensitivity heatmaps)  
10. "Show the math" reusable toggle component  
11. Glossary popovers on technical terms (hover preview)  
12. Downloadable Excel model link  
13. GitHub link slot  
14. "Where I might be wrong" section, styled distinctly  
15. Citation block with copy-to-clipboard button  
16. Update log  
17. Author card (photo, name, bio, LinkedIn link)  
18. Related articles section (3 cards)  
19. `<NewsletterSignup />` component  
20. Open Graph and Twitter Card meta tags populated from article metadata

**Article schema additions in Supabase:**

Add these columns to the existing `articles` table (do not drop existing columns):

* `methodology_summary` (text, nullable)  
* `model_download_url` (text, nullable)  
* `github_url` (text, nullable)  
* `where_i_might_be_wrong` (text, nullable)  
* `citation_format` (text, auto-generated based on title and publish date)  
* `update_log` (jsonb, default `[]`)  
* `is_research` (boolean, default false) — distinguishes Research articles from other content

Use Supabase migrations. Write the migration SQL and present it to me for review before applying.

Create one placeholder Research article in draft status (do not surface on public index) so the routing can be tested.

## **Step 5: Learn section restructure**

Create `src/pages/Learn.tsx` (index).

**Learn index (`/learn`):**

Hero:

* H1: "Learn"  
* Subtitle: "Finance concepts, from foundations to applied analysis, explained from first principles."

Two introduction paragraphs, exactly as below:

This is a public learning library covering accounting, corporate finance, valuation, credit analysis, markets, ESG, and fintech, with a focus on Indian context. Every page is structured in three layers, an intuitive explanation, the formal mechanics with worked examples on real Indian companies, and an optional deep dive into edge cases and sector-specific adjustments. Pages are dated and revised as the field evolves.

The library is built and maintained by a single author and grows steadily. It is meant to be read in any order, start from a definition in the Glossary, work through a Foundations topic, or jump straight into a Learn-by-Doing exercise. Wherever a concept appears in the original research on this site, it is linked back to the relevant Learn page.

Three large cards below the intro:

1. **Foundations** → `/learn/foundations`  
2. **Learn-by-Doing** → `/learn/by-doing`  
3. **Glossary** → `/learn/glossary`

### **5a. Foundations (`/learn/foundations`)**

Create `src/pages/Foundations.tsx` as the index. Show the full topic tree as a sidebar (collapsible on mobile), with each leaf marked Published or "Coming as I learn" (greyed out).

Migrate existing content:

* Existing Fundamental Analysis content → split appropriately under `/learn/foundations/valuation/` and `/learn/foundations/financial-statement-analysis/`  
* Existing Technical Analysis content → `/learn/foundations/markets-and-instruments/technical-analysis-primer`

Mark migrated pages as Published. Mark all other leaves as placeholders.

**Full topic tree to create (placeholder pages allowed):**

Foundations  
├── Accounting  
│   ├── Reading an Income Statement  
│   ├── Reading a Balance Sheet  
│   ├── Reading a Cash Flow Statement  
│   ├── Linking the Three Statements  
│   ├── Ind AS vs IFRS vs Indian GAAP  
│   ├── Common Adjustments (leases, ESOPs, one-offs)  
│   └── Quality of Earnings  
├── Corporate Finance  
│   ├── Time Value of Money  
│   ├── Cost of Capital (Debt, Equity, WACC)  
│   ├── Capital Structure  
│   ├── Working Capital  
│   └── Capital Budgeting (NPV, IRR, Payback)  
├── Valuation  
│   ├── DCF: Theory and Mechanics  
│   ├── Relative Valuation (P/E, EV/EBITDA, P/B, EV/Sales)  
│   ├── Sum-of-the-Parts  
│   ├── Sector-Specific Valuation (Banks, Insurance, Real Estate)  
│   ├── Terminal Value Approaches  
│   └── Common DCF Mistakes  
├── Financial Statement Analysis  
│   ├── Profitability Ratios  
│   ├── Liquidity Ratios  
│   ├── Solvency Ratios  
│   ├── Efficiency Ratios  
│   ├── Market Ratios  
│   └── DuPont Decomposition  
├── Credit Analysis  
│   ├── Credit Risk Fundamentals  
│   ├── Reading CRISIL, ICRA, Moody's Reports  
│   ├── Altman Z-Score and Distress Models  
│   ├── Bond Pricing and Yields  
│   └── Covenants and Triggers  
├── Markets and Instruments  
│   ├── Equities (NSE, BSE, IPO Process)  
│   ├── Debt Markets and Yield Curves  
│   ├── Derivatives (Futures, Options, Swaps)  
│   ├── Mutual Funds, ETFs, AIFs  
│   ├── REITs and InvITs  
│   └── Technical Analysis Primer  
├── ESG and Sustainable Finance  
│   ├── ESG Fundamentals  
│   ├── Reporting Frameworks (BRSR, SASB, ISSB)  
│   ├── Carbon Accounting  
│   ├── Green Bonds and Sustainability-Linked Debt  
│   ├── ESG-Integrated Valuation  
│   └── Climate Risk and Stranded Assets  
├── Fintech and Digital Finance  
│   ├── Payments Landscape (UPI, Cards, Wallets)  
│   ├── Digital Lending Models  
│   ├── Credit Scoring (Traditional and Alt-Data)  
│   ├── Blockchain and DeFi Primer  
│   ├── Cybersecurity in Financial Systems  
│   └── Account Aggregators  
└── Data and Tools for Finance  
    ├── Excel Modeling Conventions  
    ├── Python for Finance (pandas, yfinance, numpy)  
    ├── SQL for Finance Data  
    └── Where to Find Indian Markets Data

**Foundation page template (each leaf page):**

Structure in this order:

1. Title (H1)  
2. Optional subtitle (one sentence)  
3. **Prerequisites box** at top: "Before reading this, you should be comfortable with: \[list with links to other Foundations pages\]"  
4. Estimated reading time and last reviewed date  
5. **Intuition** section (always visible) — 2 to 3 paragraphs, plain English, real Indian-context example  
6. **Mechanics** section (always visible) — formal explanation, formulas rendered with KaTeX or MathJax, worked example with real Indian company numbers and explicit reporting period  
7. **Deep Dive** section (collapsible, "Show advanced details") — edge cases, sector-specific adjustments, Indian-context nuances  
8. **Common Mistakes** box — three ways analysts get this wrong, one paragraph each  
9. **See it applied** section — cross-links to Research articles using this concept (empty for now: "Applications will be linked here as research is published")  
10. **Try it yourself** link to relevant Tool or Learn-by-Doing module  
11. Optional 5-question quiz at the bottom (no badges, no points, no gating)  
12. Update log  
13. `<NewsletterSignup />` component

Most Foundation pages will be empty placeholders with this structure visible. Migrated content stays in place with a TODO comment if the three-layer template requires content rewriting.

**Add KaTeX or MathJax** for math formula rendering. Choose KaTeX (lighter, faster). Add it as a dependency.

### **5b. Learn-by-Doing (`/learn/by-doing`)**

Create `src/pages/LearnByDoing.tsx` as index.

* H1: "Learn-by-Doing"  
* Subtitle: "Interactive lessons that teach finance through actual practice with real company data."

Five module cards, all marked "Coming soon" for Week 1:

1. Build a DCF, Step by Step (8 steps, \~30 min)  
2. Read an Income Statement, Line by Line (\~20 min)  
3. Compute Ratios from Raw Statements (\~25 min)  
4. Compare Two Companies Side by Side (\~15 min)  
5. Spot the Red Flags (\~30 min)

Each card has: icon, title, one-line description, estimated completion time, status.

Create placeholder pages at `/learn/by-doing/[slug]` with "Coming soon" message, brief description, and newsletter signup.

### **5c. Glossary (`/learn/glossary`)**

Restructure existing 500+ definitions:

* Move existing Wiki/definitions to `/learn/glossary` as index page  
* Index page has: search bar at top, A-Z jump links, category filter  
* List all entries alphabetically with one-line excerpts

**Create individual entry pages at `/learn/glossary/[term-slug]`:**

Each entry page contains:

* Term name and full name (H1)  
* Concise definition (1 to 2 paragraphs)  
* Formula if applicable, properly formatted with KaTeX  
* "Why it matters" section (1 paragraph)  
* Real-world Indian example with actual numbers  
* Related terms (linked)  
* "See it applied" → cross-links to Research articles and Foundations pages (empty for now)  
* "Calculate it" → link to relevant Tool if exists  
* Last reviewed date

Auto-generate slug from term name. Maintain backwards-compatible URL redirects from the old `/learn` Wiki tab to `/learn/glossary` so any existing links continue to work.

## **Step 6: Tools section restructure**

Create `src/pages/Tools.tsx` as index for `/tools`.

Group existing calculators into sections: Valuation, Investment Planning, Loans, Risk.

Move each of the 8 existing calculators to its own page at `/tools/[name]`:

* `/tools/sip`  
* `/tools/future-value`  
* `/tools/present-value`  
* `/tools/cagr`  
* `/tools/compound-interest`  
* `/tools/rule-of-72`  
* `/tools/emi`  
* `/tools/inflation-adjusted-returns`

Each calculator page contains:

* Calculator UI at the top  
* "How to use this" 2-paragraph explainer  
* "What the math is doing" expandable section with formula and worked example  
* "See it used in" → links to Research articles where it appears  
* "Learn the concept" → link to relevant Foundations page

Add a placeholder card on the Tools index for "DCF Sensitivity Calculator" at `/tools/dcf-sensitivity` with "Coming soon" message (to be built in Week 2).

## **Step 7: Markets section restructure**

Create `src/pages/Markets.tsx` as index for `/markets`.

Two subpages:

* Move `/stocks` content to `/markets/nifty50`. Add banner at top: "Snapshot as of \[last\_updated\_date\]. Updated monthly."  
* Move `/compliance` content to `/markets/compliance`. Add banner at top: "Updated monthly. For real-time updates, see SEBI and exchange websites directly."

Retain all existing functionality: filters, search, stock screener, circular feed.

Each stock detail page cross-links to any Research article covering that company.

## **Step 8: About section**

Create `src/pages/About.tsx` as index, with three subpages.

**`/about/author`:**

* Photo placeholder (clearly labeled as placeholder)  
* Name: Srinath Gajji  
* Title: "Founder and Editor, The Valuation Node | MBA Candidate, NIT Rourkela"  
* Bio section: TODO placeholder with comment "Author bio, 400-600 words. Srinath to fill."  
* Links: LinkedIn (placeholder URL), GitHub (placeholder URL), Email srinath@thevaluationnode.com, Resume PDF (placeholder)  
* "Currently working on" section with 2 to 3 bullet placeholders

**`/about/site`:**

* Two-paragraph mission statement (TODO placeholder)  
* Editorial principles, verbatim:  
  1. I cite my sources.  
  2. I show my math.  
  3. I name what I do not know.  
  4. I do not give investment advice.  
  5. I write to learn, and to teach.  
  6. No sponsored content.  
* Disclosure section: "This is not investment advice. Any opinions are personal. No paid promotions."

**`/about/methodology`:**

* Note at top: "This page documents how I approach financial analysis. It is updated as my methodology evolves."  
* Section headings with TODO placeholders:  
  * Default DCF approach  
  * WACC methodology  
  * Treatment of operating leases under Ind AS  
  * Treatment of one-offs and non-recurring items  
  * Data sources for Indian markets  
  * Stance on ESG integration

## **Step 9: Chat repositioning**

* Remove the existing prominent chat sidebar placement  
* Add a floating chat button in the bottom-right corner of every page, persistent across navigation  
* Button opens the existing chat sidebar  
* Update welcome message: "Hi, I am the assistant for The Valuation Node. I can answer questions about the analyses, definitions, and methodology on this site. I do not provide investment advice."  
* Hide voice input/output controls by default; expose them in a settings menu inside the chat sidebar  
* Continue using context-specific welcome prompts when chat is opened from specific pages (article, glossary entry, etc.)  
* Chat sessions tied to authenticated users persist in Supabase (existing behavior)  
* Anonymous users get session-only chat (clears on page refresh)

## **Step 10: Hide cut features from public navigation**

* Remove public links to Community, Migration, gamification badges, streaks, quiz badges  
* Keep underlying routes and components in the codebase for future reactivation  
* On `/dashboard`:  
  * Keep welcome section and bookmarked articles  
  * Add a "Reading History" section showing recently viewed articles  
  * Remove badges section, streak counter, recommended articles by difficulty  
  * Keep user profile section  
* On article pages: remove "Mark as Read" toggle and reading progress bar. Keep bookmarking.

## **Step 11: SEO foundation**

* Install `react-helmet-async` for per-page meta management  
* Add unique `<title>` and `<meta description>` to every public page  
* Add Open Graph tags (og:title, og:description, og:image, og:url, og:type) to every page  
* Add Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)  
* Add canonical URLs to every page  
* Generate XML sitemap at `/sitemap.xml` via build-time script, listing all public pages  
* Create `/robots.txt` with `User-agent: *`, `Allow: /`, sitemap link  
* Add JSON-LD structured data:  
  * `Article` schema on Research articles  
  * `Article` or `LearningResource` schema on Foundation pages  
  * `DefinedTerm` schema on Glossary entries  
  * `Person` schema on `/about/author`  
  * `Organization` schema on homepage  
  * `BreadcrumbList` schema on nested pages  
* All images have descriptive `alt` text  
* Semantic HTML (`<article>`, `<aside>`, `<nav>`, `<main>`, `<header>`, `<footer>`)  
* All URLs clean, lowercase, hyphen-separated  
* 404 page with search bar and links to top sections

## **Step 12: Analytics integration with Umami**

Add Umami tracking script to `index.html` with placeholder values:  
 \<\!-- TODO: Replace YOUR\_UMAMI\_URL and YOUR\_WEBSITE\_ID after Umami is deployed \--\>\<script async defer  src="https://YOUR\_UMAMI\_URL/script.js"  data-website-id="YOUR\_WEBSITE\_ID"\>\</script\>

*   
* Standard pageviews tracked automatically  
* Custom events via `umami.track('Event Name', { ...props })`:  
  * `Newsletter Signup`  
  * `Model Download` (prop: `article_slug`)  
  * `Article Read Complete` (90% scroll on Research article)  
  * `Foundations Page Read Complete` (90% scroll)  
  * `Tool Used` (prop: `tool_name`)  
  * `Glossary Term Viewed` (prop: `term_slug`)  
  * `Learn-by-Doing Module Started` and `Module Completed`  
* Document all events in `docs/ANALYTICS.md`

## **Step 13: Footer redesign**

Replace existing footer with a clean three-column layout:

* **Column 1:** Wordmark "The Valuation Node," one-line description ("Indian markets research and learning"), copyright "© 2026 Srinath Gajji"  
* **Column 2:** Navigation links — Research, Learn, Tools, Markets, About  
* **Column 3:** External links — LinkedIn, X (Twitter), GitHub, Email srinath@thevaluationnode.com

Below columns, thin line, then: "Disclaimer | Privacy Policy" (link to placeholder pages).

No "Made with love" or generic startup footer copy.

## **Step 14: Newsletter signup component**

Create a reusable `<NewsletterSignup />` component:

* Email input field (required)  
* Optional name field  
* "Subscribe" button  
* Microcopy: "Roughly one email per month. No spam, no upsells."  
* On submit, POST to Buttondown API. Use placeholder endpoint with TODO comment for Buttondown setup.  
* On success: thank-you message  
* On error: friendly error message  
* Trigger `Newsletter Signup` Umami event on success

Place the component on:

* Homepage (About \+ Newsletter section)  
* Every Research article (before author card)  
* Every Foundation page (at the bottom)  
* Learn index page  
* Learn-by-Doing placeholder pages  
* About author page  
* Methodology page

---

## **Step 17: Authentication system rebuild (CRITICAL)**

This is the most important and most thorough step. The previous auth had bugs. Build the authentication system from scratch following best practices.

### **17.1 Audit the current auth**

Before making changes, document what exists:

* List all files that import from `@supabase/supabase-js` or `@supabase/auth-helpers-react`  
* List all components that check auth state (`useAuth` calls, `user` checks)  
* List all protected routes  
* List all known bugs by reviewing the existing `Login.tsx`, `Signup.tsx`, `AdminLogin.tsx`  
* Present the audit to me before proceeding to 17.2

### **17.2 Supabase Auth configuration (security-first)**

In the Supabase dashboard (or via migration), confirm or configure these settings. Output a checklist for me to verify manually:

* **Email confirmation:** Enabled (users must verify email before full access)  
* **Password requirements:** Minimum 8 characters, must contain at least one number and one letter  
* **Email rate limiting:** Enabled with default thresholds  
* **JWT expiry:** 1 hour for access tokens  
* **Refresh token rotation:** Enabled  
* **Refresh token reuse interval:** 10 seconds (mitigates replay attacks)  
* **Session timeout:** 7 days inactivity  
* **OAuth providers:** Google, GitHub, LinkedIn (configure redirect URLs for production domain `thevaluationnode.com` and localhost for development)  
* **Site URL:** Set to production domain  
* **Redirect URLs:** Add both production and localhost variants

### **17.3 Row Level Security (RLS) policies**

Audit existing RLS policies on all tables. Tighten as follows:

**Public read access** (no auth required):

* `articles` (only `status = 'published'`)  
* `definitions`  
* `stocks`  
* `circulars`  
* `quizzes`, `questions`  
* `badges`

**Authenticated-only read:**

* `profiles` (only own profile)  
* `user_progress` (only own)  
* `user_quiz_attempts` (only own)  
* `user_badges` (only own)  
* `chat_sessions`, `chat_messages` (only own)  
* `posts`, `comments`, `post_likes` (currently hidden from nav, but RLS still matters)

**Authenticated-only write:**

* All user-data tables: only the owning user can insert/update/delete their own rows  
* `bookmarks`: only owner can add/remove

**Admin-only:**

* All write access to `articles`, `definitions`, `stocks`, `circulars`, `quizzes`, `badges` (only `role = 'admin'` profiles)

Write the RLS migration SQL and present it to me for review before applying. RLS errors are the most common cause of "it works in dev but fails in prod" issues.

### **17.4 Rebuild the Login page (`src/pages/Login.tsx`)**

Replace existing implementation. Structure:

**UI:**

* Center-aligned card on the page, max-width 400px  
* Wordmark at top: "The Valuation Node"  
* Heading: "Welcome back"  
* Subheading: "Sign in to your account"  
* OAuth buttons at the top, prominently:  
  * "Continue with Google"  
  * "Continue with GitHub"  
  * "Continue with LinkedIn"  
* Divider: "or sign in with email"  
* Form:  
  * Email field (validated as email format on blur)  
  * Password field (with show/hide toggle)  
  * "Forgot password?" link below password field, right-aligned  
  * "Remember me" checkbox (optional)  
  * "Sign in" button (full-width, prominent)  
* Footer text: "Don't have an account? Sign up" with link to `/signup`  
* Small "Admin? Sign in here" link at the very bottom, low-emphasis, to `/admin-login`

**Behavior:**

* Client-side validation before submit (email format, password not empty)  
* Submit calls `supabase.auth.signInWithPassword({ email, password })`  
* On success: redirect to the user's intended destination (preserved in URL query string `?next=`) or `/dashboard`  
* On error: display the specific error from Supabase (e.g., "Invalid login credentials", "Email not confirmed") in a non-jarring error banner above the form  
* Disable the submit button while the request is in flight  
* Show a loading spinner inside the button during submission  
* For OAuth: call `supabase.auth.signInWithOAuth({ provider, options: { redirectTo:` ${origin}/auth/callback `} })`

**Security:**

* No password visible in plain text in any state, logs, or URL params  
* No auto-fill of passwords from URL params  
* All Supabase responses checked for `error` before assuming success  
* After successful login, refresh the auth context immediately

### **17.5 Rebuild the Signup page (`src/pages/Signup.tsx`)**

Similar structure to Login. Differences:

**UI:**

* Heading: "Create your account"  
* Subheading: "Get personalized features and bookmarks"  
* OAuth buttons same as login  
* Form:  
  * Display name field  
  * Email field  
  * Password field with show/hide toggle  
  * Live password strength indicator (3 levels: weak, fair, strong)  
  * Password requirements visible: "At least 8 characters, with one letter and one number"  
  * Terms checkbox: "I agree to the \[Terms of Service\] and \[Privacy Policy\]" (both link to placeholder pages)  
  * "Create account" button  
* Footer: "Already have an account? Sign in"

**Behavior:**

* Client-side validation: email format, password meets requirements, display name not empty, terms checked  
* Submit calls `supabase.auth.signUp({ email, password, options: { data: { display_name: name } } })`  
* On success: show a confirmation screen with message "Check your email to confirm your account. Click the link in the email we just sent you."  
* Show a "Resend confirmation email" button on the confirmation screen (with 60-second rate limit)  
* After email confirmation, user is redirected to `/auth/callback` then to `/dashboard`  
* A row in `profiles` table is auto-created via Supabase trigger upon signup (verify the trigger exists, or create it)

**Profile creation trigger:**

Ensure a Postgres trigger exists that creates a row in `profiles` whenever a new auth user is created. If not, create this migration:

\-- Trigger to create profile on signup  
CREATE OR REPLACE FUNCTION public.handle\_new\_user()  
RETURNS TRIGGER AS $$  
BEGIN  
  INSERT INTO public.profiles (id, display\_name, role, created\_at)  
  VALUES (  
    NEW.id,  
    NEW.raw\_user\_meta\_data-\>\>'display\_name',  
    'user',  
    NOW()  
  );  
  RETURN NEW;  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on\_auth\_user\_created ON auth.users;  
CREATE TRIGGER on\_auth\_user\_created  
  AFTER INSERT ON auth.users  
  FOR EACH ROW EXECUTE FUNCTION public.handle\_new\_user();

### **17.6 Create OAuth callback handler (`src/pages/AuthCallback.tsx`)**

Route: `/auth/callback`

This page handles the redirect from OAuth providers and email confirmation links:

* Reads the session from `supabase.auth.getSession()`  
* If session exists, redirects to `next` query param or `/dashboard`  
* If error in query params, redirects to `/login` with error message  
* Shows a loading state while resolving ("Signing you in...")  
* Logs any unexpected errors to console (and Umami event `Auth Error` for debugging)

### **17.7 Rebuild the Admin Login page (`src/pages/AdminLogin.tsx`)**

Similar to Login but:

* Heading: "Administrator Sign-in"  
* No OAuth options (email/password only, to reduce attack surface)  
* No "Sign up" link  
* After successful login, query `profiles` table for the user's role  
* If `role !== 'admin'`, immediately sign out and show error: "This account does not have administrator access."  
* If `role === 'admin'`, redirect to `/admin`  
* Add CAPTCHA on this form (optional, only if Supabase Auth's built-in rate limiting is insufficient)

### **17.8 Forgot Password flow**

Create `src/pages/ForgotPassword.tsx` at route `/forgot-password`:

* Email input field  
* "Send reset link" button  
* Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo:` ${origin}/reset-password `})`  
* Success message: "If an account exists for that email, a reset link has been sent."  
* Do NOT reveal whether the email exists (security best practice)

Create `src/pages/ResetPassword.tsx` at route `/reset-password`:

* Page is accessed via the link in the reset email  
* Reads the recovery token from URL  
* Shows: new password field, confirm password field, "Update password" button  
* Calls `supabase.auth.updateUser({ password: newPassword })`  
* On success: redirect to `/login` with message "Password updated. Please sign in."

### **17.9 Centralized Auth Context (`src/contexts/AuthContext.tsx`)**

Refactor the existing `useAuth` hook (if buggy) into a clean implementation:

// Pseudocode structure  
const AuthContext \= createContext\<{  
  user: User | null;  
  profile: Profile | null;  
  loading: boolean;  
  signOut: () \=\> Promise\<void\>;  
}\>(...)

export const AuthProvider \= ({ children }) \=\> {  
  const \[user, setUser\] \= useState\<User | null\>(null);  
  const \[profile, setProfile\] \= useState\<Profile | null\>(null);  
  const \[loading, setLoading\] \= useState(true);

  useEffect(() \=\> {  
    // 1\. Get initial session  
    supabase.auth.getSession().then(({ data: { session } }) \=\> {  
      setUser(session?.user ?? null);  
      // Fetch profile if user exists  
      if (session?.user) fetchProfile(session.user.id);  
      setLoading(false);  
    });

    // 2\. Listen for auth changes  
    const { data: { subscription } } \= supabase.auth.onAuthStateChange(  
      async (event, session) \=\> {  
        setUser(session?.user ?? null);  
        if (session?.user) {  
          await fetchProfile(session.user.id);  
        } else {  
          setProfile(null);  
        }  
      }  
    );

    return () \=\> subscription.unsubscribe();  
  }, \[\]);

  // ... fetchProfile, signOut implementations  
};

Key bug fixes to verify:

* Avoid race conditions between `getSession()` and `onAuthStateChange`  
* Always set `loading: false` even if profile fetch fails  
* Handle the case where the user exists in auth but has no profile row (rare but possible)  
* Clear profile state on sign out

### **17.10 Protected Route component**

Create `src/components/auth/ProtectedRoute.tsx`:

// Pseudocode  
const ProtectedRoute \= ({ children, requireAdmin \= false }) \=\> {  
  const { user, profile, loading } \= useAuth();  
  const location \= useLocation();

  if (loading) return \<LoadingSpinner /\>;

  if (\!user) {  
    return \<Navigate to={\`/login?next=${location.pathname}\`} replace /\>;  
  }

  if (requireAdmin && profile?.role \!== 'admin') {  
    return \<Navigate to="/" replace /\>;  
  }

  return children;  
};

Use it on:

* `/dashboard` (requireAdmin: false)  
* `/settings` (requireAdmin: false)  
* `/admin/*` (requireAdmin: true)

### **17.11 Sign-out flow**

In the user menu (profile icon dropdown):

* "Sign out" button  
* Calls `supabase.auth.signOut()`  
* On success, redirect to `/`  
* Clear any local state (chat sessions, bookmarks cache, etc.)  
* Show a brief toast: "You have been signed out."

### **17.12 Session persistence and security headers**

In `src/lib/supabase.ts` (or wherever the Supabase client is initialized):

import { createClient } from '@supabase/supabase-js';

export const supabase \= createClient(  
  import.meta.env.VITE\_SUPABASE\_URL,  
  import.meta.env.VITE\_SUPABASE\_ANON\_KEY,  
  {  
    auth: {  
      persistSession: true,  
      autoRefreshToken: true,  
      detectSessionInUrl: true,  
      flowType: 'pkce', // Use PKCE flow for OAuth (more secure)  
      storage: localStorage, // default, but explicit is good  
    },  
  }  
);

Add a `vercel.json` or equivalent to set security headers:

{  
  "headers": \[  
    {  
      "source": "/(.\*)",  
      "headers": \[  
        { "key": "X-Content-Type-Options", "value": "nosniff" },  
        { "key": "X-Frame-Options", "value": "DENY" },  
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },  
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }  
      \]  
    }  
  \]  
}

### **17.13 Auth testing checklist**

Before declaring auth done, manually test all flows:

* \[ \] Sign up with email/password → receives confirmation email → confirms → can log in  
* \[ \] Sign up with Google → creates profile row → lands on dashboard  
* \[ \] Sign up with GitHub → creates profile row → lands on dashboard  
* \[ \] Sign up with LinkedIn → creates profile row → lands on dashboard  
* \[ \] Sign in with email/password → lands on dashboard  
* \[ \] Sign in with wrong password → clear error message, no redirect  
* \[ \] Sign in with unconfirmed email → "Email not confirmed" error message  
* \[ \] Forgot password → email arrives → link works → password updated → can log in with new password  
* \[ \] Sign out → cleared session → cannot access /dashboard without re-login  
* \[ \] Access /dashboard while signed out → redirects to /login with `next` param  
* \[ \] After login from /login?next=/dashboard → lands on /dashboard  
* \[ \] Non-admin user tries /admin/\* → redirected to home  
* \[ \] Admin user accesses /admin → loads admin panel  
* \[ \] Session persists across page refresh  
* \[ \] Session persists across browser restart (if "remember me" or default)  
* \[ \] OAuth callback handles errors gracefully (e.g., user denies permission)  
* \[ \] RLS prevents user A from reading user B's bookmarks or chat history (test with two accounts)

Document all test results in `docs/AUTH_TESTING.md`.

### **17.14 Auth-related TODOs to flag to me**

After the auth rebuild, output a list of:

* Any Supabase dashboard settings that need to be configured manually  
* Any OAuth provider settings (callback URLs, client IDs) that need updating  
* Any environment variables that need to be set in production  
* Any RLS policies that were tightened in ways that might break existing functionality

## **Step 18: Cleanup and final checklist**

* Search the codebase for "FinBot," "FinBot India," "AI-Powered Financial Intelligence," and update or remove  
* Remove gamification badge displays from any user-facing surface  
* Remove streak counters  
* Remove "Mark as Read" UI  
* Keep all underlying Supabase tables intact (do not drop any)  
* Update `README.md` with new site name, brief description, tech stack, Week 1 deliverables

### **Final deliverables checklist**

Before declaring Week 1 done, confirm:

* \[ \] All pages render without errors on desktop and mobile  
* \[ \] All routes resolve correctly  
* \[ \] No references to "FinBot" remain in the public UI  
* \[ \] SEO meta tags present on every public page  
* \[ \] Umami tracking script in place (TODO for URL/ID replacement)  
* \[ \] Newsletter signup component works (TODO for Buttondown setup if needed)  
* \[ \] Sitemap.xml generates with all public pages  
* \[ \] robots.txt is in place  
* \[ \] Floating chat button works on every page  
* \[ \] Cut features no longer appear in public navigation  
* \[ \] All new article schema fields exist in Supabase (verified via Supabase dashboard)  
* \[ \] Migrated Foundation pages render in their new locations  
* \[ \] All 500+ Glossary entries have their own URLs  
* \[ \] All 8 calculators have their own pages  
* \[ \] **Auth rebuild complete:** all auth flows tested per Step 17.13 checklist  
* \[ \] **RLS policies updated:** verified per Step 17.3  
* \[ \] Security headers added (Step 17.12)  
* \[ \] PKCE flow enabled for OAuth (Step 17.12)  
* \[ \] `docs/AUTH_TESTING.md` created with test results  
* \[ \] `docs/ANALYTICS.md` created with event documentation  
* \[ \] Existing user data preserved (no orphaned auth users, no missing profiles)

Provide a written summary of:

* Changes made  
* Files added, modified, deleted  
* Migrations applied  
* Any blockers encountered  
* TODOs requiring my input (especially Supabase dashboard settings, OAuth callback URLs, environment variables)