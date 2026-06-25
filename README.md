# The Valuation Node

Indian markets research and learning by Srinath Gajji.

## About

The Valuation Node is a finance research publication focused on original valuation and credit analysis of Indian companies, plus a public learning library covering accounting, corporate finance, valuation, credit analysis, markets, ESG, and fintech.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui (Radix UI components)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Routing:** React Router v6
- **Data fetching:** TanStack Query
- **SEO:** react-helmet-async
- **Markdown:** react-markdown
- **Hosting:** Netlify (primary) / Vercel (alternative)

## Week 1 Deliverables

- [x] Global rebrand from FinBot India → The Valuation Node
- [x] New top-level navigation: Research | Learn | Tools | Markets | About
- [x] Homepage rebuilt (hero, featured research, learning library teaser, newsletter signup)
- [x] Research section (`/research`, `/research/[slug]`) with full article template
- [x] Learn section: Foundations topic tree, Learn-by-Doing, Glossary with individual entry pages
- [x] Tools section: all 8 calculators moved to `/tools/[name]` with math explainers
- [x] Markets section: Nifty 50 at `/markets/nifty50`, Compliance at `/markets/compliance`
- [x] About section: Author, Site, Methodology pages
- [x] Chat repositioned as floating button (bottom-right)
- [x] Auth rebuild: AuthContext, ProtectedRoute, Login/Signup/AdminLogin, OAuth (Google/GitHub/LinkedIn), ForgotPassword, ResetPassword, AuthCallback, PKCE flow
- [x] SEO: react-helmet-async on all pages, OG/Twitter tags, JSON-LD structured data, robots.txt
- [x] Umami analytics script placeholder in index.html
- [x] Newsletter signup component (Buttondown API, TODO: add API key)
- [x] Footer redesigned (3-column)
- [x] Security headers in vercel.json
- [x] Supabase migrations written (not yet applied — review before applying)
- [x] `docs/ANALYTICS.md` with event documentation
- [x] `docs/AUTH_TESTING.md` with testing checklist and Supabase dashboard settings

## Environment Variables

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

## Running Locally

```bash
npm install
npm run dev
```

## Supabase Migrations (Apply Before Launch)

Review and apply these in order via the Supabase SQL editor:

1. `supabase/migrations/20260625_004_role_column.sql` — adds `role` column to `profiles` (prerequisite for all others)
2. `supabase/migrations/20260624_001_research_article_fields.sql` — adds research columns to `articles`
3. `supabase/migrations/20260624_002_rls_policies.sql` — tightens RLS policies
4. `supabase/migrations/20260624_003_profile_trigger.sql` — creates profile row on signup
5. `supabase/migrations/20260625_005_rls_gamification_community.sql` — RLS for gamification/community tables (skip if those tables don't exist yet)

See `docs/AUTH_TESTING.md` for the full list of Supabase dashboard settings to configure manually.

## TODOs Before Launch

- [ ] Apply Supabase migrations (review first — see above)
- [ ] Configure OAuth providers in Supabase dashboard (Google, GitHub, LinkedIn)
- [ ] Deploy Umami and update script URL/ID in `index.html`
- [ ] Set up Buttondown and update API key in `NewsletterSignup.tsx`
- [ ] Replace placeholder LinkedIn/GitHub/photo URLs in About and author sections
- [ ] Write author bio and mission statement (About pages)
- [ ] Write methodology sections (About/Methodology page)
- [ ] Publish first research article (to test the Research template end-to-end)
- [ ] Add actual OG/Twitter card image at `/public/og-placeholder.png`
