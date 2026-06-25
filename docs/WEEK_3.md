# Week 3 Instructions — The Valuation Node

Written by Srinath Gajji.

Weeks 1 and 2 delivered the architecture, auth rebuild, the DCF calculator, three Foundations pages, the first Research article, newsletter, and analytics. Week 3 delivers the first interactive Learn-by-Doing module, the second Research article, three more Foundations pages, and a comprehensive internal linking pass.

**Critical constraints (unchanged):**
- Continue using Supabase. Do not migrate or drop tables.
- Preserve all existing user data.
- All financial content I provide is the source of truth. Do not invent numbers.
- Prefer simplicity over cleverness.
- Do not introduce new dependencies without asking.
- For any decision not specified, ask me before proceeding.

Execute steps in order. Confirm each step before moving on.

---

## Step 1: Learn-by-Doing Module 1 — "Build a DCF, Step by Step"

Route: `/learn/by-doing/build-a-dcf`

**Status: COMPLETE (Week 3 Day 1)**

Files created:
- `src/lib/learnDcfCompanies.ts` — 7 curated Indian companies with approximate FY24 figures
- `src/components/learn/BuildADcfLesson.tsx` — 8-step stepper component
- `src/pages/BuildADcfPage.tsx` — page wrapper with SEO

Files modified:
- `src/App.tsx` — added specific route before dynamic `:slug` route
- `src/pages/LearnByDoing.tsx` — marked module as live with link

Decisions made:
- Supabase persistence skipped for v1 (session-only state)
- FCF = NOPAT approximation (no CapEx slider in v1)
- Company data: 7 Indian companies (Asian Paints, Pidilite, Marico, Polycab, Britannia, Titan, Page Industries) with approximate FY24 figures labelled as educational/illustrative

---

## Step 2: Render Research Article #2

**Status: BLOCKED — awaiting content from Srinath**

Required from Srinath:
- Article title, dek, category, tags
- Markdown body
- Methodology summary
- Where-I-might-be-wrong section
- Excel model file
- Citation string
- Cover image

---

## Step 3: Render three more Foundations pages

**Status: BLOCKED — awaiting content from Srinath**

Suggested pages:
- `/learn/foundations/accounting/reading-a-balance-sheet`
- `/learn/foundations/accounting/reading-a-cash-flow-statement`
- `/learn/foundations/financial-statement-analysis/profitability-ratios`

---

## Step 4: Refinements from Week 2 feedback

**Status: BLOCKED — awaiting feedback list from Srinath**

---

## Step 5: Sitewide internal linking pass

**Status: PENDING — can start once content steps are done**

---

## Step 6: SEO and performance check

**Status: PENDING**

---

## Step 7: Re-embed new content for the chatbot

**Status: PENDING — awaiting Article #2 and Foundations pages**

---

## Step 8: Final checklist

- [x] "Build a DCF" Learn-by-Doing module works end to end at `/learn/by-doing/build-a-dcf`
- [x] Module is responsive on mobile (side panel hidden, sticky bar shown)
- [x] Module reuses the Week 2 DCF logic (`src/lib/dcf.ts`), no duplicated calculation code
- [x] Excel export works from the module
- [ ] Research Article #2 published (blocked)
- [ ] Three new Foundations pages (blocked)
- [ ] Week 2 feedback refinements (blocked)
- [ ] Internal linking pass (pending)
- [ ] Sitemap regenerated (pending — will do after content steps)
- [ ] Lighthouse scores (pending)
- [ ] Chatbot re-embedded (pending)
- [x] Umami events wiring complete
