# **Week 2 Instructions for Claude Code**

Save this as `docs/WEEK_2.md` in your repo. Then in Claude Code, say:

Read `docs/WEEK_2.md` and execute it step by step. Confirm completion of each step before moving to the next.

Before pasting the file, a quick note on what Week 2 is and is not.

## **What Week 2 delivers**

Week 1 was structural: rebrand, restructure, scaffolding, auth. Week 2 is the first real interactive feature and the start of substantive content.

By the end of Week 2 you have:

1. **A working DCF Sensitivity Calculator** at `/tools/dcf-sensitivity`, fully functional, ready to embed in Research articles  
2. **Reusable financial widget components** (slider input, sensitivity grid, results table, formula renderer) that future calculators and articles will share  
3. **Three completed Foundations pages** with real content (not just placeholders), written by you, that demonstrate the three-layer template works  
4. **The first Research article** drafted and published in `status: published` form  
5. **Buttondown newsletter live and connected** with confirmed welcome email and article notification email  
6. **Umami analytics live** with custom events firing correctly  
7. **The chatbot re-embedded** with content from the new site structure

Week 2 does **not** include: building the other 4 Learn-by-Doing modules, writing more than 3 Foundations pages, building more calculators beyond DCF, or refactoring the visual design.

## **Time estimate**

Realistically, Week 2 needs 25 to 35 hours of focused work. If you have less than that available, defer the Research article to Week 3 and let Week 2 stop at the calculator \+ Foundations content.

## **Two important upstream dependencies**

Before Claude Code starts Week 2, two things from your side must be done. Without them, Week 2 will stall.

1. **You must pick the company for Research Article \#1.** I will give selection criteria in the prep section below. Decide before paste.  
2. **You must complete the DCF in Excel first.** Claude Code cannot make up your financial assumptions. The Excel model is the source of truth that the web calculator will mirror. Do this before Claude Code builds the calculator.

Both are work you do by hand, not in code.

---

# **Contents of `docs/WEEK_2.md`**

This is Week 2 of building The Valuation Node, a finance research publication with a public learning library, written by Srinath Gajji.

Week 1 delivered the new architecture, authentication rebuild, SEO foundation, and section scaffolding. Week 2 delivers the first interactive financial tool, three substantive Foundations pages, the first published Research article, live newsletter and analytics, and an updated chatbot.

**Critical constraints (same as Week 1):**

* Continue using Supabase. Do not migrate or drop tables.  
* Preserve all existing user data.  
* Prefer simplicity over cleverness.  
* Do not introduce new dependencies without asking.  
* All financial content I provide is the source of truth. Do not invent numbers, ratios, or company-specific data.  
* For any decision not specified, ask me before proceeding.

Execute steps in order. Confirm each step before moving to the next.

## **Step 1: DCF Sensitivity Calculator (`/tools/dcf-sensitivity`)**

This is the flagship interactive tool. It will be:

* A standalone page at `/tools/dcf-sensitivity`  
* A reusable React component (`<DcfSensitivityCalculator />`) that can be embedded inline in Research articles and Foundations pages

### **1.1 Component architecture**

Build the calculator as a self-contained React component with the following props:

interface DcfSensitivityCalculatorProps {  
  // Default values, overridable per embedding  
  defaultRevenueGrowth?: number;       // e.g., 0.12 for 12%  
  defaultOperatingMargin?: number;     // e.g., 0.18  
  defaultTaxRate?: number;             // e.g., 0.25  
  defaultWacc?: number;                // e.g., 0.115  
  defaultTerminalGrowth?: number;      // e.g., 0.04  
  baseRevenue?: number;                // last reported revenue, in crores  
  forecastYears?: number;              // default 5  
  sharesOutstanding?: number;          // in crores  
  netDebt?: number;                    // in crores  
  companyName?: string;                // optional, for display  
  currency?: 'INR' | 'USD';            // default INR  
    
  // Display options  
  showSensitivityGrid?: boolean;       // default true  
  showWaterfallChart?: boolean;        // default true  
  showAssumptionsPanel?: boolean;      // default true  
    
  // Event hooks  
  onValuationChange?: (value: number) \=\> void;  
}

The component must work standalone (no props) with reasonable defaults, and customizable when embedded in an article.

### **1.2 UI structure**

The calculator UI has four panels, arranged in a responsive grid (single column on mobile, two columns on tablet, two-by-two on desktop):

**Panel 1: Assumptions (left/top)**

* Six labeled sliders, each with a numeric input field beside it:  
  * Revenue Growth Rate (range \-10% to \+30%, step 0.5%)  
  * Operating Margin (range 0% to 50%, step 0.5%)  
  * Tax Rate (range 0% to 40%, step 1%)  
  * WACC / Discount Rate (range 5% to 25%, step 0.25%)  
  * Terminal Growth Rate (range 0% to 8%, step 0.25%)  
  * Forecast Period (range 3 to 10 years, step 1 year)  
* Each slider shows the current value clearly in % (or years for forecast period)  
* "Reset to defaults" button below the sliders  
* A "Show formulas" toggle that expands to show the formulas being computed

**Panel 2: Year-by-year cash flow table (right/top)**

* A clean table with columns: Year | Revenue | EBIT | NOPAT | Free Cash Flow | Discount Factor | Present Value  
* Rows for each forecast year, plus a row for Terminal Value  
* A total row at the bottom: Enterprise Value  
* All numbers formatted in Indian numbering (lakhs/crores), with currency prefix  
* The table updates live as sliders change

**Panel 3: Sensitivity grid (left/bottom)**

* A 2D sensitivity table: WACC on the X-axis, Terminal Growth on the Y-axis  
* Center cell is the current valuation  
* Five values on each axis, centered on the current slider values, with reasonable steps  
* Cells colored on a heatmap gradient (red for low valuation, green for high)  
* Hover on any cell shows the exact value

**Panel 4: Results summary (right/bottom)**

* Big number: Equity Value per Share (in INR or USD)  
* Beside it: comparison to current market price (if `currentPrice` prop is passed)  
* "Implied upside/downside" as a percentage with arrow icon  
* Below the big number: smaller summary stats:  
  * Enterprise Value (total)  
  * Terminal Value as % of Enterprise Value  
  * Year 5 Revenue (in crores)  
  * Year 5 Free Cash Flow

### **1.3 Financial calculations**

Implement these calculations in a separate utility file (`src/lib/dcf.ts`) so they can be unit tested:

// Pseudocode for clarity, implement properly in TypeScript

function calculateDcf(inputs) {  
  // 1\. Project revenue  
  const revenues \= \[\];  
  let revenue \= inputs.baseRevenue;  
  for (let i \= 1; i \<= inputs.forecastYears; i++) {  
    revenue \= revenue \* (1 \+ inputs.revenueGrowth);  
    revenues.push(revenue);  
  }  
    
  // 2\. Compute EBIT, NOPAT, Free Cash Flow for each year  
  const cashFlows \= revenues.map(rev \=\> {  
    const ebit \= rev \* inputs.operatingMargin;  
    const nopat \= ebit \* (1 \- inputs.taxRate);  
    // For simplicity in v1, treat NOPAT as FCF  
    // Future enhancement: subtract D\&A, CapEx, NWC change  
    return { revenue: rev, ebit, nopat, fcf: nopat };  
  });  
    
  // 3\. Discount each year's FCF to present value  
  const pvCashFlows \= cashFlows.map((cf, i) \=\> {  
    const year \= i \+ 1;  
    const discountFactor \= 1 / Math.pow(1 \+ inputs.wacc, year);  
    return { ...cf, year, discountFactor, pv: cf.fcf \* discountFactor };  
  });  
    
  // 4\. Terminal value (Gordon Growth)  
  const finalYearFcf \= pvCashFlows\[pvCashFlows.length \- 1\].fcf;  
  const terminalFcf \= finalYearFcf \* (1 \+ inputs.terminalGrowth);  
  const terminalValue \= terminalFcf / (inputs.wacc \- inputs.terminalGrowth);  
  const terminalDiscountFactor \= 1 / Math.pow(1 \+ inputs.wacc, inputs.forecastYears);  
  const pvTerminalValue \= terminalValue \* terminalDiscountFactor;  
    
  // 5\. Enterprise value  
  const sumPvCashFlows \= pvCashFlows.reduce((sum, cf) \=\> sum \+ cf.pv, 0);  
  const enterpriseValue \= sumPvCashFlows \+ pvTerminalValue;  
    
  // 6\. Equity value  
  const equityValue \= enterpriseValue \- inputs.netDebt;  
  const equityValuePerShare \= equityValue / inputs.sharesOutstanding;  
    
  return {  
    cashFlows: pvCashFlows,  
    terminalValue,  
    pvTerminalValue,  
    enterpriseValue,  
    equityValue,  
    equityValuePerShare,  
    terminalValuePercent: pvTerminalValue / enterpriseValue,  
  };  
}

Add a unit test file (`src/lib/dcf.test.ts`) with at least 5 test cases covering:

* Standard case  
* Zero growth (WACC \= terminal growth edge case, should not divide by zero, return NaN or error)  
* Negative growth  
* Very high WACC  
* Very long forecast period

### **1.4 Sensitivity grid calculation**

For the sensitivity grid:

* X-axis (WACC): 5 values centered on current WACC, step 0.5%  
* Y-axis (Terminal Growth): 5 values centered on current terminal growth, step 0.5%  
* For each of the 25 combinations, run the DCF calculation  
* Memoize results so changing other sliders does not re-run all 25 calculations unnecessarily  
* Use `useMemo` with appropriate dependencies

### **1.5 Visual polish**

* Use shadcn-ui Slider, Input, Card, Table components for consistency with the existing site  
* Charts: use Recharts (already in your stack) for the sensitivity heatmap and any waterfall chart  
* Math formulas: render with KaTeX (added in Week 1\)  
* Color palette: stick to the accent color defined in Week 1 (deep teal or muted blue)  
* Numbers in Indian format (e.g., ₹1,23,456 crores, not ₹123,456,000)  
* Currency display: `₹` for INR, `$` for USD  
* Loading state: skeleton screens while calculations resolve (should be instant, but defensive)

### **1.6 Page-level wrapper (`/tools/dcf-sensitivity`)**

The standalone tool page contains:

* H1: "DCF Sensitivity Calculator"  
* Subtitle: "Adjust assumptions and see how a company's valuation changes."  
* "How to use this" 2-paragraph explainer above the calculator  
* The `<DcfSensitivityCalculator />` component, with sensible defaults (e.g., pre-populated with sample Indian company numbers, or a "Pick a company" dropdown of 5 to 10 curated companies if Supabase has stock data)  
* "What the math is doing" expandable section below the calculator, with formulas and explanations rendered with KaTeX  
* "See it used in" section linking to the Research article (built in Step 4\)  
* "Learn the concept" link to `/learn/foundations/valuation/dcf-theory-and-mechanics`  
* "Download as Excel" button that exports the current model state (use SheetJS / xlsx library, already in your stack)

### **1.7 Analytics events**

Fire these Umami events from the calculator:

* `Tool Used` with prop `tool_name: 'DCF Sensitivity'` (fires once per session on first interaction)  
* `DCF Model Downloaded` (when Excel export is clicked)  
* `Sensitivity Grid Explored` (fires when user hovers/clicks cells, debounced)

## **Step 2: Three Foundations pages with real content**

I will provide three drafts as Markdown text. Your job is to render them properly within the Foundations page template built in Week 1, with all expected elements (Prerequisites, Intuition/Mechanics/Deep Dive, Common Mistakes, See It Applied, etc.).

The three pages, listed below. I will provide content separately as I write each. Until I do, leave the page placeholders intact.

1. **`/learn/foundations/accounting/reading-an-income-statement`** — I will write the content. Renders as Foundation page.  
2. **`/learn/foundations/valuation/dcf-theory-and-mechanics`** — I will write the content. The Mechanics section must embed the `<DcfSensitivityCalculator />` component built in Step 1\. The Deep Dive must include a "Build a DCF on Asian Paints" worked example with real numbers from FY24 (or whichever fiscal year I specify).  
3. **`/learn/foundations/corporate-finance/cost-of-capital-debt-equity-wacc`** — I will write the content. Embed a WACC calculator if simple enough, otherwise link to a placeholder for a future WACC tool.

For each page:

* Render Markdown content inside the three-layer template  
* Render math with KaTeX  
* All "See it applied" sections should link to the Research article built in Step 4 once it is published  
* Update the Foundations index page sidebar to mark these three leaves as Published (not "Coming as I learn")  
* Add `lastReviewed` date metadata for each  
* Generate JSON-LD `LearningResource` schema for SEO  
* Ensure the embedded calculator inside the DCF page works correctly with no console errors

## **Step 3: Buttondown integration**

Buttondown account setup is on me. You implement the integration.

### **3.1 Environment variables**

Add to `.env` and the production environment:

* `VITE_BUTTONDOWN_API_KEY` (the Buttondown API key)  
* `VITE_BUTTONDOWN_USERNAME` (the Buttondown username/slug)

### **3.2 Newsletter signup component**

Update the `<NewsletterSignup />` component built in Week 1 to POST to Buttondown's API:

POST https://api.buttondown.email/v1/subscribers  
Headers:  
  Authorization: Token \<api\_key\>  
  Content-Type: application/json  
Body:  
  { "email": "...", "metadata": { "name": "...", "source": "..." } }

Pass `source` based on which page the signup came from:

* `home`  
* `article:<slug>`  
* `foundations:<slug>`  
* `learn-by-doing:<slug>`  
* `about`

On success:

* Show thank-you message  
* Fire `Newsletter Signup` Umami event with prop `source`

On error:

* "This email is already subscribed" → friendly message: "You're already on the list. Thank you."  
* Other errors → "Something went wrong. Please try again."

### **3.3 Welcome email and broadcast template**

I will write the welcome email content in Buttondown. You do not need to write copy.

But add a "Recent issues" or "Newsletter archive" link at the bottom of every signup form that points to your Buttondown public page (`https://buttondown.email/thevaluationnode`).

## **Step 4: First Research article**

This is the marquee deliverable of Week 2\. The article topic and content come from me. Your job is to render it correctly in the article template.

I will provide:

* Title and dek  
* Category (one of: Valuation, Credit, Sector, ESG, Fintech, Methodology)  
* Subject tags  
* Cover image (or use a clean placeholder)  
* Markdown body with embedded `<DcfSensitivityCalculator />` component(s) inline  
* Methodology summary  
* Where I might be wrong section  
* Downloadable Excel model URL (I will provide the file separately, upload to Supabase Storage under `models/`)  
* Citation format

For the article:

* Insert into Supabase `articles` table with `is_research: true` and `status: 'published'`  
* Verify all article template elements (built in Week 1\) render correctly:  
  * Methodology box (collapsible, default open)  
  * Inline calculator widget  
  * Glossary popovers on technical terms (link to glossary entries, hover shows definition)  
  * "Show the math" toggles  
  * Downloadable model link  
  * "Where I might be wrong" section styled distinctly  
  * Citation block with copy-to-clipboard  
  * Author card  
  * Related articles section (empty for now or show 3 Foundation pages)  
  * Newsletter signup  
* Generate proper Open Graph image with article title, author, and site name (use a template, can be auto-generated)  
* Add `Article` JSON-LD schema  
* Verify the article appears on:  
  * `/research` index (first card, most recent)  
  * Homepage featured article slot  
  * Homepage recent articles row  
* Update the Foundations pages built in Step 2 to add cross-links in their "See it applied" sections, pointing to this article

## **Step 5: Umami analytics verification**

Confirm everything from Week 1 is firing correctly, plus the new events from Step 1 and Step 4\.

Replace placeholder `YOUR_UMAMI_URL` and `YOUR_WEBSITE_ID` in `index.html` with the actual values (I will provide).

Test in production:

* Pageviews logging  
* `Newsletter Signup` fires from each signup location  
* `Article Read Complete` fires on 90% scroll of the published Research article  
* `Foundations Page Read Complete` fires on 90% scroll of any Foundations page  
* `Tool Used` fires from the DCF calculator  
* `Glossary Term Viewed` fires when a glossary entry page is opened  
* `Model Download` fires when the Research article's Excel link is clicked

Document any events that are not firing, with diagnostic steps.

## **Step 6: Chatbot content re-embedding**

The chatbot was built on the old content structure. Now that articles, foundations, and glossary are restructured, the embeddings need to be regenerated.

### **6.1 Audit current embeddings**

* Check the existing `embeddings` table or pgvector setup  
* Identify what content is currently embedded and what is missing  
* List orphaned embeddings (referencing deleted/moved content) and stale embeddings (content has been updated)

### **6.2 Re-embed all current content**

* Re-run embedding generation on:  
  * All published Research articles (just the one for now)  
  * All Foundations pages with real content (the 3 from Step 2\)  
  * All Glossary entries (500+)  
  * The Methodology page  
  * The About pages  
* Use OpenAI's `text-embedding-3-small` model (cheaper, sufficient quality) or whatever model the existing system uses  
* Store embeddings in Supabase with pgvector  
* Reference each embedding to its source URL so the chatbot can cite

### **6.3 Update chatbot prompt**

Update the chat system prompt so the assistant:

* Grounds answers in the site content (RAG)  
* Cites sources when answering ("Per our Foundations page on DCF…", or "In our Asian Paints analysis…")  
* Refuses to provide investment advice  
* Has a clear fallback when the user asks something not covered: "This is not yet covered on the site. You might find general information by \[external resource\], or sign up for the newsletter to be notified when it is added."

### **6.4 Embedding refresh trigger**

For future content updates, add a manual "Refresh embeddings" button in the admin panel under `/admin/embeddings` (already exists from before). When new Research articles or Foundations pages are published, the admin can click to regenerate embeddings for the new/updated content.

Document this workflow in `docs/CONTENT_WORKFLOW.md`.

## **Step 7: Sitewide bug sweep**

Before declaring Week 2 done:

* Walk every navigation item on desktop and mobile  
* Test the auth flows (signup, login, OAuth, forgot password, signout)  
* Click every CTA on the homepage  
* Open and interact with the DCF calculator on `/tools/dcf-sensitivity`  
* Open the embedded calculator inside the DCF Foundations page  
* Open the Research article, scroll to the bottom, click the downloadable model  
* Sign up for the newsletter from three different pages  
* Open the chatbot, ask three questions, verify it cites sources from the new content  
* Check Umami dashboard to confirm pageviews and custom events are arriving  
* Run Lighthouse audit on the homepage, one Research article page, one Foundations page. Score should be:  
  * Performance: 85+  
  * Accessibility: 95+  
  * Best Practices: 95+  
  * SEO: 100

Fix any issues found before completing Week 2\.

## **Step 8: Final checklist**

Confirm before declaring Week 2 done:

* \[ \] DCF Sensitivity Calculator works at `/tools/dcf-sensitivity`  
* \[ \] DCF calculator embeds correctly inline in Foundations and Articles pages  
* \[ \] DCF calculations unit tested with at least 5 test cases passing  
* \[ \] Three Foundations pages have real content rendered correctly with the three-layer template  
* \[ \] First Research article is published and visible on `/research` and homepage  
* \[ \] Article includes working inline DCF calculator  
* \[ \] Article includes downloadable Excel model from Supabase Storage  
* \[ \] Buttondown newsletter integration confirmed working from all signup locations  
* \[ \] Umami analytics confirmed firing in production for all events  
* \[ \] Chatbot has re-embedded all current content and cites sources correctly  
* \[ \] Lighthouse scores acceptable  
* \[ \] All sitewide bug sweep items pass

Output a summary of:

* Files added, modified, deleted  
* Supabase migrations applied  
* New environment variables required  
* TODOs requiring my input  
* Any decisions I should review before Week 3

---

End of Week 2 instructions.

# **What you do in parallel, by hand**

These are the human dependencies for Week 2\. None require code.

## **Before Week 2 starts**

1. **Decide on the Research Article \#1 company.** Selection criteria:

   * **Indian-listed and well-covered.** You need clean financial statements and public commentary to cross-check your work.  
   * **Sector with a clean business model.** Avoid banks, insurance, and conglomerates for the first DCF. They have sector-specific valuation nuances. Stick to FMCG, paints, building materials, capital goods, IT services.  
   * **A company you find genuinely interesting.** You will spend 15 to 25 hours on this article. Pick something you actually want to think about.  
   * **Recent results available.** Q3 FY25 or Q4 FY25 results should be out by now (June 2026).  
2. My shortlist, in order of recommended difficulty (easiest first):

   * **Asian Paints** — clean financials, simple model, strong moat, well-covered. Best for first DCF.  
   * **Pidilite Industries** — adhesives, strong fundamentals, moderate complexity.  
   * **Polycab India** — wires and cables, growth story, slightly more cyclical.  
   * **Marico** — FMCG, simple, well-understood.  
   * **Berger Paints** — alternative to Asian Paints.  
3. **My recommendation: Asian Paints.** Pick by Sunday before Week 2 starts. Once picked, do not switch mid-week.

4. **Build the DCF in Excel.** Before Claude Code builds the calculator and before you write the article, do the full DCF model in Excel:

   * 5-year explicit forecast period  
   * Revenue projections from historical CAGR plus your view  
   * Operating margin assumptions  
   * Tax rate, WACC, terminal growth  
   * Sensitivity table on WACC vs terminal growth  
   * All assumptions clearly labeled  
   * Final equity value per share  
   * Comparison to current market price  
   * This is the source of truth. The web calculator should produce the same numbers (within rounding) when fed your assumptions.  
5. **Write the Research article draft (Markdown).** Structure:

   * Title and dek  
   * Methodology summary (80 to 150 words)  
   * Body, around 2000 to 3000 words, with the following sections (suggested but not mandatory):  
     * The thesis in two paragraphs  
     * The business in 200 words (what the company does, why it matters)  
     * Recent financials snapshot  
     * Forecast assumptions and reasoning  
     * DCF results (with inline calculator embedded)  
     * Sensitivity analysis  
     * Comparison to current valuation  
     * What could go wrong  
     * Conclusion  
   * "Where I might be wrong" section (100 to 200 words, voluntary but mandatory by your editorial principle)  
   * Citation block  
   * List of subject tags  
6. **Write the three Foundations pages.** Each one is 1500 to 3000 words at maturity.

   * `Reading an Income Statement` (start here, easiest)  
   * `DCF Theory and Mechanics` (longest, but you are writing this concurrently with the Research article, so much of the thinking transfers)  
   * `Cost of Capital — Debt, Equity, WACC` (the math-heaviest, save for last)  
7. Use your DCF model and Research article as the working material. Many concepts will appear in both, just framed differently.

## **During Week 2**

5. **Sign up for Buttondown.** Configure:

   * Sender name and email  
   * Welcome email content (you write)  
   * First broadcast email template (announcing the launch and the first article)  
   * Connect to your domain email for the "from" address  
6. **Configure Umami in production.** Get the instance URL and Website ID. Paste into Claude Code for replacement in `index.html`.

7. **Cover image for the Research article.** A clean, professional image. Options:

   * A high-quality stock photo from Unsplash (free, no attribution required) of relevant theme (paint cans for Asian Paints, etc.)  
   * A custom-made graphic in Figma showing a teaser chart from your analysis  
   * A clean text-based cover with the title and your byline  
8. Avoid AI-generated images that look fake.

## **After Week 2**

When Week 2 is done, do this final check:

* Read your own published Research article on the live site. Read it on mobile and desktop. Is the math clear? Is the DCF calculator embedded where it makes sense? Does the article hold together?  
* Sign up for your own newsletter and confirm you receive the welcome email.  
* Send the live link to two seniors or mentors. Ask them for honest feedback. Take the feedback seriously but do not panic-edit; sit with it for 48 hours before changing anything.  
* Update your LinkedIn headline if not done: "MBA Candidate @ NIT Rourkela | Founder & Editor, The Valuation Node | Indian markets research"  
* Write a short LinkedIn post announcing the article (not the site, just the article). One paragraph on why you wrote it, one paragraph on the key takeaway, link to the article. Post it.