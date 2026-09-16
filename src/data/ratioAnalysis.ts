// Ratio Analysis reference: one entry per ratio with a plain definition, the
// formula on its own labelled line, how to read the number, a worked Indian
// example, and where the ratio misleads. Source of truth for figures is the
// author's fundamental-analysis notes; do not invent or "update" company
// numbers here. Markdown is allowed in `reading`, `example`, and `caution`.
//
// Pages: /vault/formulas (hub) and /vault/formulas/:slug (entry).
// The sitemap generator reads the `slug:` lines of this file directly.

export type RatioGroupId =
  | "size-and-price"
  | "profitability-and-returns"
  | "leverage-and-liquidity"
  | "efficiency"
  | "cash-flow"
  | "banking"
  | "growth-and-shareholding";

export interface RatioGroup {
  id: RatioGroupId;
  label: string;
  /** One sentence shown under the group heading on the hub. */
  description: string;
}

export interface RatioFormula {
  label: string;
  expression: string;
}

export interface RatioEntry {
  slug: string;
  name: string;
  fullName?: string;
  group: RatioGroupId;
  /** One or two plain sentences. Doubles as the meta description. */
  definition: string;
  formulas: RatioFormula[];
  /** Compact benchmark shown on the hub card and the entry header. */
  benchmark?: string;
  /** Markdown: how to read the number and what good looks like. */
  reading: string;
  /** Markdown: a worked example with Indian company figures. */
  example: string;
  /** Markdown: where the ratio misleads. */
  caution?: string;
  /** Slugs of other entries in this file. */
  relatedRatios?: string[];
  /** Glossary term names (as they appear in definitions.json). */
  glossary?: string[];
  /** Deeper Foundations, Learn-by-Doing, research, or tool pages. */
  goDeeper?: { label: string; href: string }[];
}

export const RATIO_GROUPS: RatioGroup[] = [
  {
    id: "size-and-price",
    label: "Size and Price Metrics",
    description:
      "What the market is charging for the company, and what you actually get for that price.",
  },
  {
    id: "profitability-and-returns",
    label: "Profitability and Return Ratios",
    description:
      "How much profit the business keeps from each rupee of sales, and how hard it makes its capital work.",
  },
  {
    id: "leverage-and-liquidity",
    label: "Leverage and Liquidity Ratios",
    description:
      "Whether the company can carry its debt through a bad year and pay its short-term bills on time.",
  },
  {
    id: "efficiency",
    label: "Efficiency Ratios",
    description:
      "How quickly assets turn into sales and how quickly sales turn back into cash.",
  },
  {
    id: "cash-flow",
    label: "Cash Flow Checks",
    description:
      "The tests that separate booked profit from money that actually arrived.",
  },
  {
    id: "banking",
    label: "Banking Ratios",
    description:
      "Banks are analysed with a different ratio set. Debt to equity, cash cycle, and asset turnover do not apply.",
  },
  {
    id: "growth-and-shareholding",
    label: "Growth and Shareholding",
    description:
      "Whether the business is actually getting bigger, and whether the people who know it best are buying or selling.",
  },
];

export const RATIOS: RatioEntry[] = [
  // ── Size and price ──────────────────────────────────────────────────────
  {
    slug: "market-capitalisation",
    name: "Market Capitalisation",
    fullName: "Market Cap",
    group: "size-and-price",
    definition:
      "Market capitalisation is the total market value of all of a company's shares. It is the money you would need to buy 100 percent of the company at today's share price.",
    formulas: [{ label: "Market Cap", expression: "Market Cap = Share Price × Number of Shares" }],
    benchmark: "A size gauge, not a valuation verdict",
    reading: `Market cap has two uses. The first is obvious: it tells you how big the company is, which decides whether it sits in the large cap, mid cap, or small cap bucket.

The second use is the intuitive filter. Ask yourself: "If I had this much money, would I buy this whole business?" Then compare what the same sum buys elsewhere. Your money is limited, so you are always choosing between companies, and often between industries. Comparing what roughly ₹5 lakh crore buys in soaps, in banking, and in IT services trains the capital allocation instinct that every later ratio depends on.`,
    example: `HUL at roughly ₹2,190 per share with about 216 crore shares has a market cap of around ₹4.7 lakh crore. For approximately the same ₹5 lakh crore you could instead own HDFC Bank, or Infosys with a little change left over. HUL sells soap, ketchup, and noodles. HDFC Bank is one of India's best-run lenders. Infosys sells software services. Asking which of the three you would rather own outright, for the same money, is the first valuation question, before any ratio is computed.`,
    caution: `Market cap ignores debt and cash. A company with a tiny market cap can still cost a fortune to own once you inherit its borrowings. That is why the next entry, enterprise value, exists.`,
    relatedRatios: ["enterprise-value", "pe-ratio", "price-to-book"],
    glossary: ["Market Cap", "Free Float"],
    goDeeper: [
      { label: "Equities (Foundations)", href: "/vault/guides/equities" },
      { label: "Relative valuation (Foundations)", href: "/vault/guides/relative-valuation" },
    ],
  },
  {
    slug: "enterprise-value",
    name: "Enterprise Value",
    fullName: "EV",
    group: "size-and-price",
    definition:
      "Enterprise value is the true cost of acquiring the whole business. It adds the debt you would inherit to the market cap and subtracts the cash you would gain.",
    formulas: [{ label: "Enterprise Value", expression: "EV = Market Cap + Total Debt − Cash and Cash Equivalents" }],
    benchmark: "Low, zero, or negative EV is a prompt to investigate, not a buy signal",
    reading: `Think of buying a shop priced at ₹100. It has ₹20 of cash in the till and owes ₹10 to a friend. Your real cost is ₹100 − ₹20 + ₹10 = ₹90. That ₹90 is the enterprise value.

EV does two jobs. It prevents blunders, because a cheap-looking market cap can hide a mountain of debt. And it surfaces genuine bargains, because a company holding more cash than its market cap has a negative EV: you pay for the shop and get the till for free. Always check the consolidated figures. On research platforms, toggling between standalone and consolidated can flip EV dramatically, in one case from about −₹2,000 crore to about +₹1,200 crore.`,
    example: `Adlabs Entertainment, which owned the Imagica park on the Mumbai-Pune highway, had a market cap of only about ₹22 crore. That looks absurdly cheap for a huge amusement park. But the company carried over ₹1,000 crore of debt, so its enterprise value was around ₹1,000 to ₹1,100 crore. The real cost of owning the park was about ₹1,100 crore, not ₹22 crore.

The reverse case: a company with a market cap of ₹2,800 crore, cash of ₹5,000 crore, and zero debt. You pay ₹2,800 crore and own ₹5,000 crore of cash. EV is negative ₹2,200 crore. The shop cost you minus ₹20.`,
    caution: `Never buy just because EV is low, zero, or negative. Find out why it is that way. Cash-rich companies sometimes have a reason the market does not trust them, and a low EV is only interesting once every other check passes.`,
    relatedRatios: ["market-capitalisation", "debt-to-equity", "free-cash-flow"],
    glossary: ["Enterprise Value", "EV/Sales"],
    goDeeper: [
      { label: "Capital structure (Foundations)", href: "/vault/guides/capital-structure" },
      { label: "Relative valuation (Foundations)", href: "/vault/guides/relative-valuation" },
    ],
  },
  {
    slug: "earnings-per-share",
    name: "Earnings Per Share",
    fullName: "EPS",
    group: "size-and-price",
    definition:
      "Earnings per share is the slice of net profit that belongs to each share. It is the building block for the PE and PEG ratios.",
    formulas: [{ label: "EPS", expression: "EPS = Net Profit ÷ Number of Shares" }],
    benchmark: "Track the growth over 1, 3, and 5 years rather than the level",
    reading: `Picture a shop that earns ₹100 a year and has four equal partners. Each partner's share of the profit is ₹25. That is EPS with four shares.

On its own, the EPS number tells you little, because a company can have any number of shares. What matters is how EPS has grown over one, three, and five years, and how the share price compares with it. Use consolidated EPS, and use the adjusted figure after bonus issues or splits so that years remain comparable.`,
    example: `HUL's EPS is approximately ₹28. In the profit and loss statement the arithmetic is the same at any scale: a company with 100 shares and ₹650 of total profit reports an EPS of ₹6.5.`,
    caution: `EPS is booked profit, not cash received. Compare it with cash flow per share. HUL once reported EPS of ₹27.94 against cash flow per share of ₹26.46, a gap of about ₹1.50 that appeared in only one year and most likely reflected delayed collections. A gap that persists for years is a different story, and the CFO to PAT check below is built to catch it.`,
    relatedRatios: ["pe-ratio", "peg-ratio", "price-to-cash-flow", "cfo-to-pat"],
    glossary: ["EPS"],
    goDeeper: [
      { label: "Reading an income statement (Foundations)", href: "/vault/guides/reading-an-income-statement" },
      { label: "Read an income statement line by line (Learn-by-Doing)", href: "/vault/interactive/read-an-income-statement" },
    ],
  },
  {
    slug: "pe-ratio",
    name: "PE Ratio",
    fullName: "Price to Earnings Ratio",
    group: "size-and-price",
    definition:
      "The PE ratio tells you how many years of current earnings you are paying for a share. It is the most used, and most misused, valuation ratio.",
    formulas: [{ label: "PE", expression: "PE = Share Price ÷ EPS" }],
    benchmark: "Judge against the company's own history and its profit growth, not a fixed number",
    reading: `The self-check question is simple: would you buy a shop for ₹70 that earns you ₹1 a year? A PE of zero means the company is loss-making, because there are no earnings to divide by. PE also changes every day, because the price does, so it is a reading, not a fixed characteristic.

Using PE properly takes three steps.

1. **Compare the current PE with the company's own history.** Look at the 6 month, 1 year, 3 year, and 5 year plus charts. A PE at the top of its own range is the first sign of "expensive".
2. **Do not stop there. Set the PE history against the profit growth history.** A higher PE is justified when the company is now growing profit faster than it used to.
3. **Look for the ideal setup.** Profit growth accelerating from the 5 year average to the 3 year average to the latest year, while the PE is falling. A company that once traded at 50 times earnings with 10 percent growth, and now delivers 20 percent growth at 30 to 40 times, is the attractive combination.`,
    example: `HUL at ₹2,190 with EPS of about ₹28 trades at a PE of roughly 70. Its history: around 27 in 2013, around 40 in 2015 and 2017, rising from 2018 to about 70 now, the highest in eight years. First impression: expensive. But profit growth has been 15 percent over one year, 13 percent averaged over three, and 9 to 10 percent over five. Performance has improved, which partly explains why the market awards a higher multiple.

Colgate India shows the filtering logic. Current PE around 39 against a historical band of roughly 40 to 50. Profit growth of 15 percent over one year, 10 percent over three, 7 percent over five, so performance is improving. Cheaper than its own history and getting better, with no obvious reason for the de-rating. That raises interest and earns deeper research.`,
    caution: `This is a filter to decide which companies deserve your time. It is not a buy signal and not a recommendation. Also check which statement you are looking at: switching from standalone to consolidated can move a PE from 21 to 15 for the same company.`,
    relatedRatios: ["earnings-per-share", "peg-ratio", "price-to-book", "price-to-cash-flow"],
    glossary: ["P/E Ratio"],
    goDeeper: [
      { label: "Market ratios (Foundations)", href: "/vault/guides/market-ratios" },
      { label: "High PE: what it implies and when it is a trap (Research)", href: "/analysis/valuation-modeling/high-pe-what-it-implies-and-when-its-a-trap" },
    ],
  },
  {
    slug: "price-to-book",
    name: "Price to Book Ratio",
    fullName: "P/B Ratio",
    group: "size-and-price",
    definition:
      "The price to book ratio compares the share price with the book value per share, the accounting net worth that backs each share.",
    formulas: [
      { label: "Book Value per Share", expression: "Book Value per Share = (Share Capital + Reserves) ÷ Number of Shares" },
      { label: "P/B", expression: "P/B = Share Price ÷ Book Value per Share" },
    ],
    benchmark: "Useful for banks and asset-heavy industries, meaningless for IT and brand-led businesses",
    reading: `Book value is what each shareholder would theoretically receive if the company sold everything and shut down today. An empty shop worth ₹100 with two equal shareholders has a book value of ₹50 per share.

P/B works where capital genuinely sits in hard assets: cement, power, infrastructure, steel. It works especially well for banks and financial companies, because their assets are loans, and book value captures a lending business almost exactly. It also works for commodity businesses with weak brand influence. One cement brand does not sell at ₹300 and another at ₹600; the gap is about ₹10 a bag, so the plant earns the money, not the brand.

P/B fails for IT and services companies. Their business is 5,000 developers and salespeople in an office, and salaries are an expense, never an asset, so book value is structurally low. It also fails for brand and IP driven companies, because brand does not appear on the balance sheet. Only touch-and-feel assets do.`,
    example: `Tata Steel with a book value of ₹593 per share and a share price of ₹277 trades at a P/B of 0.47, which looks cheap. InfoEdge, which runs Naukri, 99acres, and Jeevansathi, trades at about 10 times book (price ₹2,000, book value ₹200), which looks expensive. Neither reading means much without the industry context above.

Among banks, where P/B is the right tool, HDFC Bank has traded at about 4 times book, Kotak Mahindra at about 6, ICICI at about 2, and Axis at about 3. That gives a sense of relative expensiveness. It does not make the cheapest one a buy.`,
    caution: `Liquidation almost never realises book value. Selling plant, machinery, and vehicles fetches lower prices and takes a very long time. Treat book value as a conceptual anchor, not a real payout.`,
    relatedRatios: ["pe-ratio", "return-on-equity", "return-on-assets-bank"],
    glossary: ["P/B Ratio", "Book Value per Share"],
    goDeeper: [
      { label: "Reading a balance sheet (Foundations)", href: "/vault/guides/reading-a-balance-sheet" },
      { label: "Sector-specific valuation (Foundations)", href: "/vault/guides/sector-specific-valuation" },
    ],
  },
  {
    slug: "peg-ratio",
    name: "PEG Ratio",
    fullName: "Price/Earnings to Growth Ratio",
    group: "size-and-price",
    definition:
      "The PEG ratio adjusts the PE ratio for profit growth. It asks whether the multiple you are paying is justified by how fast earnings are growing.",
    formulas: [{ label: "PEG", expression: "PEG = PE ÷ Profit Growth Rate (%)" }],
    benchmark: "Around or below 1 is fair, above 1 signals expensive",
    reading: `The rule of thumb: PE should not exceed the profit growth rate. Use the three year or five year average growth in the denominator, not a single year.

When the three year and five year answers disagree, look at the latest one year growth to decide which window deserves more weight. If growth is accelerating and last year was strong, weight the three year figure, because it reflects the recent trend. If last year's growth matches the five year average, weight the five year figure, because the long-term rate is being maintained.

Use PEG only for companies with stable, consistently growing earnings: FMCG, some pharma, some IT. It breaks on cyclical or erratic earners.`,
    example: `Godrej Consumer: PE of 33 (price ₹597, EPS ₹18). Profit growth of 75 percent over one year, 34 percent over three, 25 percent over five. On the three year figure, 33 ÷ 34 is just under 1, fairly valued or slightly cheap. On the five year figure, 33 ÷ 25 is about 1.3, slightly expensive. Growth is accelerating, so the three year window gets more weight. Either way, 1 and 1.3 are close, so the verdict is fairly valued.

Bajaj Consumer: PE of 9. Profit growth of 4.5 percent over one year, 4 percent over three, 8 percent over five. On the three year figure, 9 ÷ 4.5 is 2, expensive. On the five year figure it looks fair. Last year's 4.5 percent matches the three year average, so the three year window wins, and the stock reads as expensive despite its single-digit PE.`,
    caution: `PEG is deliberately over-simplified. Never trust it alone. Valuation should be done through two, three, or four different methods and combined into one judgement.`,
    relatedRatios: ["pe-ratio", "earnings-per-share"],
    glossary: ["PEG Ratio"],
    goDeeper: [
      { label: "CAGR calculator", href: "/vault/interactive/cagr" },
      { label: "Relative valuation (Foundations)", href: "/vault/guides/relative-valuation" },
    ],
  },
  {
    slug: "price-to-cash-flow",
    name: "Price to Cash Flow Ratio",
    fullName: "P/CF Ratio",
    group: "size-and-price",
    definition:
      "The price to cash flow ratio compares the share price with operating cash flow per share. It uses money actually received instead of booked profit.",
    formulas: [{ label: "P/CF", expression: "P/CF = Share Price ÷ Operating Cash Flow per Share" }],
    benchmark: "Judge it against peers and against what you get for the multiple",
    reading: `Earnings can be booked on sales where the payment never arrives, because the buyer went bankrupt or was dishonest. Cash flow reflects money that actually came in. So P/CF sometimes tells the truth when PE flatters.

There is no universal "good" P/CF. Compare peers, and compare what each multiple buys you. Open each company's investor presentation to list its brands, then ask whether you would rather pay one multiple for one brand basket or a slightly higher multiple for a richer one. If a company does not mention a brand in its presentation, it is probably not a meaningful revenue contributor. Companies always highlight what drives their sales.`,
    example: `Bajaj Consumer at ₹138 with EPS of ₹15 trades at a PE of 9. But its P/CF is 11, which implies cash flow per share of about ₹12.5 (138 ÷ 11). Of the ₹15 of reported earnings per share, only about ₹12.5 arrives as cash.

Is 11 times cash flow acceptable? At that multiple you get Bajaj Almond Drops and No Marks. Jyothy Labs at about 12 times cash flow gives you Ujala, Maxo, Exo, Henko, Pril, and Margo. Which basket you would rather own for the money is the real question.`,
    relatedRatios: ["pe-ratio", "cfo-to-pat", "free-cash-flow"],
    glossary: ["FCF Yield"],
    goDeeper: [
      { label: "Reading a cash flow statement (Foundations)", href: "/vault/guides/reading-a-cash-flow-statement" },
    ],
  },
  {
    slug: "price-to-sales",
    name: "Price to Sales Ratio",
    fullName: "P/S Ratio",
    group: "size-and-price",
    definition:
      "The price to sales ratio compares a company's market cap with its annual revenue. It is the multiple you fall back on when there are no earnings to divide by.",
    formulas: [
      { label: "P/S", expression: "P/S = Market Cap ÷ Annual Sales" },
      { label: "Per share form", expression: "P/S = Share Price ÷ Sales per Share" },
    ],
    benchmark: "Only meaningful against peers with similar margins; read it with net margin",
    reading: `Sales are harder to manipulate than profit and they exist even when the company is loss-making, so P/S survives where PE breaks. That is its whole appeal, and its whole weakness: a rupee of sales is worth very different amounts in different businesses. A company keeping 20 percent of every sale as profit deserves a far higher P/S than one keeping 2 percent.

Use it in three situations: young or loss-making companies where PE is zero, cyclical companies at the bottom of the cycle when earnings have collapsed, and as a cross-check when earnings look unusually inflated. Always pair it with net profit margin, because P/S divided by net margin is just the PE ratio in disguise.`,
    example: `An illustration rather than a real company: two firms each with ₹1,000 crore of sales and a ₹2,000 crore market cap trade at the same P/S of 2. If one earns a 20 percent net margin, its profit is ₹200 crore and its PE is 10. If the other earns 2 percent, its profit is ₹20 crore and its PE is 100. Same P/S, wildly different valuations. The margin decides which one is cheap.`,
    caution: `Consolidated sales include subsidiaries; standalone sales do not. Tata Motors' standalone sales of about ₹70,000 crore against consolidated sales of about ₹3 lakh crore would give two completely different P/S readings for the same stock.`,
    relatedRatios: ["pe-ratio", "net-profit-margin", "ev-to-sales"],
    glossary: ["Market Cap", "Net Profit Margin"],
    goDeeper: [
      { label: "Relative valuation (Foundations)", href: "/vault/guides/relative-valuation" },
    ],
  },
  {
    slug: "ev-to-ebitda",
    name: "EV to EBITDA",
    fullName: "Enterprise Value to EBITDA",
    group: "size-and-price",
    definition:
      "EV to EBITDA compares the total cost of acquiring a business, debt included, with its operating earnings before interest, tax, depreciation, and amortisation.",
    formulas: [
      { label: "EV/EBITDA", expression: "EV/EBITDA = Enterprise Value ÷ EBITDA" },
      { label: "EBITDA", expression: "EBITDA = Operating Profit + Depreciation + Amortisation" },
    ],
    benchmark: "Compare within the sector; capital-light businesses command higher multiples",
    reading: `PE compares the price of the equity with profit after interest and tax. EV/EBITDA compares the price of the whole business, debt and all, with profit before financing and accounting charges. That makes it the fairer multiple when comparing a debt-heavy company with a debt-free one, or companies with very different depreciation policies, or companies in different tax situations.

It is the standard multiple for acquisitions, for capital-intensive sectors such as cement, steel, telecom, and power, and for comparing companies across countries. A lower multiple is cheaper, but only against peers with similar growth and capital needs.`,
    example: `Illustration: a company has a market cap of ₹5,000 crore, debt of ₹2,000 crore, and cash of ₹500 crore, so its enterprise value is ₹6,500 crore. Its operating profit is ₹600 crore and depreciation ₹200 crore, so EBITDA is ₹800 crore. EV/EBITDA is about 8.1 times. A debt-free peer with the same market cap and the same EBITDA would trade at about 6.3 times, because its EV is only ₹5,000 crore. PE alone would have hidden that the first company is the more expensive one.`,
    caution: `EBITDA ignores the capital expenditure needed to keep the business running. For a business that must reinvest everything it earns, EBITDA flatters badly. Airtel generates cash but has to spend more than it earns maintaining its network, which is why free cash flow, not EBITDA, tells its real story.`,
    relatedRatios: ["enterprise-value", "pe-ratio", "ev-to-sales", "free-cash-flow"],
    glossary: ["EV/EBITDA", "Enterprise Value", "EBITDA Margin"],
    goDeeper: [
      { label: "Relative valuation (Foundations)", href: "/vault/guides/relative-valuation" },
      { label: "Sector-specific valuation (Foundations)", href: "/vault/guides/sector-specific-valuation" },
    ],
  },
  {
    slug: "ev-to-sales",
    name: "EV to Sales",
    fullName: "Enterprise Value to Sales",
    group: "size-and-price",
    definition:
      "EV to sales compares the total cost of acquiring a business with its annual revenue. It is the price to sales ratio corrected for debt and cash.",
    formulas: [{ label: "EV/Sales", expression: "EV/Sales = Enterprise Value ÷ Annual Sales" }],
    benchmark: "A peer-comparison multiple for loss-making or early-stage companies",
    reading: `Price to sales uses market cap, which ignores the balance sheet. EV to sales uses enterprise value, so a company that has borrowed heavily to generate its revenue is charged for that debt. Use it where PE and EV/EBITDA both break, typically companies that are not yet profitable, and always alongside the margin the business could earn at maturity.`,
    example: `Illustration: two companies each report ₹1,000 crore of sales and a ₹3,000 crore market cap. One has no debt, so EV/Sales is 3. The other carries ₹1,500 crore of debt and no cash, so its EV is ₹4,500 crore and EV/Sales is 4.5. On price to sales they looked identical; on EV to sales the second is 50 percent more expensive.`,
    relatedRatios: ["price-to-sales", "enterprise-value", "ev-to-ebitda"],
    glossary: ["EV/Sales", "Enterprise Value"],
  },
  {
    slug: "earnings-yield",
    name: "Earnings Yield",
    group: "size-and-price",
    definition:
      "Earnings yield is the PE ratio turned upside down: the profit a company earns per year as a percentage of its share price. It lets you compare a stock directly with a bond or a fixed deposit.",
    formulas: [
      { label: "Earnings Yield", expression: "Earnings Yield (%) = EPS ÷ Share Price × 100" },
      { label: "From PE", expression: "Earnings Yield (%) = 1 ÷ PE × 100" },
    ],
    benchmark: "Compare with the fixed deposit rate and the 10-year government bond yield",
    reading: `A PE of 70 is hard to feel. An earnings yield of about 1.4 percent is not: it means that for every ₹100 of share price, the company currently earns ₹1.40 a year. Set that against a fixed deposit paying 6.5 to 7 percent and the question becomes concrete. You are accepting a lower yield today in exchange for growth. The faster the profit grows, the sooner the yield on your original price catches up and overtakes the deposit.

That is why earnings yield is best read together with profit growth, exactly as the PEG ratio does from the other direction.`,
    example: `HUL at a PE of about 70 has an earnings yield of roughly 1.4 percent. Colgate at a PE of about 39 yields roughly 2.6 percent. Bajaj Consumer at a PE of 9 yields about 11 percent, which looks generous until you recall that its profit was growing at only about 4 percent a year. The high yield was the market's way of pricing in low growth.`,
    relatedRatios: ["pe-ratio", "peg-ratio", "dividend-yield", "fcf-yield"],
    glossary: ["Earnings Yield", "P/E Ratio"],
  },
  {
    slug: "fcf-yield",
    name: "Free Cash Flow Yield",
    fullName: "FCF Yield",
    group: "size-and-price",
    definition:
      "Free cash flow yield is the surplus cash a business generates in a year as a percentage of its market cap. It is the earnings yield computed on cash that actually exists.",
    formulas: [{ label: "FCF Yield", expression: "FCF Yield (%) = Free Cash Flow ÷ Market Cap × 100" }],
    benchmark: "Higher is better; a positive earnings yield with a negative FCF yield is a warning",
    reading: `Earnings yield uses reported profit. FCF yield uses operating cash flow minus the reinvestment the business cannot avoid. For a company with honest accounting and modest capital needs the two are close. When they diverge, the FCF yield is the one to trust, because it is the money that could actually be paid out as dividends, used for buybacks, or left to pile up as cash.`,
    example: `Illustration: a company with a market cap of ₹10,000 crore reports net profit of ₹800 crore, an earnings yield of 8 percent. Its operating cash flow is ₹900 crore but it must spend ₹700 crore a year replacing worn-out plant, so free cash flow is ₹200 crore and the FCF yield is only 2 percent. The 8 percent was never available to shareholders. Airtel is the extreme case: positive cash flow, negative free cash flow, and about ₹83,000 crore of debt taken on to fill the gap.`,
    relatedRatios: ["free-cash-flow", "earnings-yield", "price-to-cash-flow"],
    glossary: ["FCF Yield"],
    goDeeper: [
      { label: "DCF theory and mechanics (Foundations)", href: "/vault/guides/dcf-theory-and-mechanics" },
    ],
  },
  {
    slug: "dividend-yield",
    name: "Dividend Yield",
    group: "size-and-price",
    definition:
      "Dividend yield is the cash dividend paid per share as a percentage of the current share price. It is the only dividend figure worth looking at; the dividend percentage quoted on face value is meaningless.",
    formulas: [
      { label: "Dividend Yield", expression: "Dividend Yield (%) = Dividend per Share ÷ Current Market Price × 100" },
      { label: "Dividend %, for contrast, ignore it", expression: "Dividend (%) = Dividend per Share ÷ Face Value × 100" },
    ],
    benchmark: "Above 5% usually signals limited growth; a very high yield with rising debt is a red flag",
    reading: `Dividend percentage is calculated on face value. If a share has a ₹10 face value and pays ₹10, the news flashes "100 percent dividend". You did not buy at face value, so the number tells you nothing. Dividend yield divides by the price you actually pay.

Dividend policy reveals what management thinks about growth. A company with a near-monopoly and no need for new products or marketing, the Coal India type, has no use for retained cash, so it pays it out and the yield sits above 5 percent. A company fighting in competitive markets and funding acquisitions, the InfoEdge type, keeps everything and yields about 0.3 percent. A very high yield usually signals that the company sees limited growth ahead. No dividend despite high profits usually signals the opposite.

Three cautions. A dividend comes out of the share price: on the ex-dividend date the price falls by roughly the dividend amount, so a ₹6 dividend is a ₹6 price drop, not free money. Dividends are taxed twice, once as corporate tax before the payout and again in your hands. And a high dividend yield can be an artifact of a shrunken equity base that also flatters ROE. Where a company has surplus cash, a buyback above market price returns it with the same outflow but gives shareholders the choice.`,
    example: `The Indian Oil case from the notes. Debt of about ₹1,16,000 crore. About 941 crore shares. A dividend of roughly ₹15 a share, about a 10 percent yield on a ₹116 price, so total dividends of about ₹14,000 crore a year. Annual interest expense about ₹6,000 crore. That ₹14,000 crore could have cut debt and saved ₹700 to ₹800 crore of interest every year permanently. Instead the company effectively borrows and hands the borrowed money out as dividend. The share went from about ₹103 five years earlier, touched ₹200, and came back to about ₹115: nowhere in five years. A government-backed company survives this. If you see the pattern in a private company, leave.`,
    caution: `Yield is calculated on past dividends. Future payments are entirely at the company's discretion. Verify the actual history under the corporate actions tab before relying on it.`,
    relatedRatios: ["dividend-payout-ratio", "earnings-yield", "return-on-equity", "debt-to-equity"],
    glossary: ["Dividend Yield", "Face Value", "Buyback"],
  },

  // ── Profitability and returns ───────────────────────────────────────────
  {
    slug: "net-profit-margin",
    name: "Net Profit Margin",
    fullName: "PAT Margin",
    group: "profitability-and-returns",
    definition:
      "Net profit margin is the profit left after every expense and tax, expressed as a percentage of sales. It is also called PAT margin, for profit after tax.",
    formulas: [
      { label: "Net Margin", expression: "Net Margin (%) = Profit After Tax ÷ Sales × 100" },
      { label: "Markup, for contrast", expression: "Markup (%) = (Selling Price − Cost Price) ÷ Cost Price × 100" },
    ],
    benchmark: "Compare within the industry; a high margin is not the same as a good business",
    reading: `Margin is always calculated on the selling price. Markup is calculated on the cost price. Buy a pencil for ₹10 and sell it for ₹15: the markup is 50 percent (₹5 on ₹10), but the margin is 33.3 percent (₹5 on ₹15). Finance almost always means margin.

The purpose of a business is not to sell at the highest possible price. It is to put in a little money and make as much as possible. A high margin is one route. Selling more volume at a lower margin is the other, and it is usually the better one, because it drives repeat purchase and loyalty. That is why margin should be read alongside return on equity, never alone.`,
    example: `Eicher Motors earns a PAT margin of about 20 percent with an ROE of about 24 percent. Page Industries, which makes Jockey, earns a PAT margin of only about 13 percent, yet its ROE is roughly double Eicher's. Lower margin, far better return on money. Walmart runs margins of around 1 percent in many categories and still produces an excellent ROE because it turns its stock so many times.`,
    caution: `A falling margin explains only part of a falling ROE. Symphony's net margin dropped from the 25 to 29 percent range to 19 percent while its ROE fell by more than half; the rest came from collapsing asset turnover. Use the DuPont breakdown to see which lever moved.`,
    relatedRatios: ["return-on-equity", "asset-turnover", "dupont-analysis"],
    glossary: ["Net Profit Margin", "Operating Margin", "Gross Margin"],
    goDeeper: [
      { label: "Profitability ratios (Foundations)", href: "/vault/guides/profitability-ratios" },
    ],
  },
  {
    slug: "return-on-equity",
    name: "Return on Equity",
    fullName: "ROE",
    group: "profitability-and-returns",
    definition:
      "Return on equity measures the profit a company earns on its shareholders' money. Equity is money raised without paying interest: share capital plus retained reserves.",
    formulas: [
      { label: "ROE", expression: "ROE (%) = Net Profit ÷ Shareholders' Equity × 100" },
      { label: "Equity", expression: "Shareholders' Equity = Share Capital + Total Reserves" },
    ],
    benchmark: "Above 20% is good in most industries; treat 15% as the floor for individual stocks",
    reading: `Raise ₹100 entirely as equity, ₹20 your own, ₹20 from friends, ₹60 from family. If you end the year with ₹120, ROE is 20 percent.

What counts as good varies by industry, so compare within the sector. In a textile peer set averaging 14 to 22 percent, an ROE of 48 percent is outstanding. As a general benchmark, above 20 percent is good in most industries, and it is harder to reach in banks and heavy industries. The floor for picking individual stocks is about 15 percent, because mutual funds return roughly 12 to 13 percent and fixed deposits 6.5 to 7 percent. Below 15 percent, the extra risk of a single stock is not being paid for.

Two things inflate ROE without the business getting better. Debt: borrowed money's returns flow into the numerator while the debt itself sits outside the denominator. Dividends: paying out profit keeps reserves small, so the equity base shrinks and ROE looks impressive. A stock with an 8 to 10 percent dividend yield and a high ROE deserves that second suspicion. HUL pays an ordinary 1 to 1.5 percent yield and still produces an excellent ROE, which is what genuine quality looks like.`,
    example: `Ram and Shyam each start with ₹100 and buy 10 pencils at ₹10. Ram sells at ₹20 each, a 50 percent margin, and sells all 10 in a day. He ends with ₹200, an ROE of 100 percent. Shyam sells at ₹15, a 33 percent margin, but the lower price means he sells 10 in two hours, rebuys 15, and repeats. By evening he has sold 30 pencils at ₹5 profit each and ends with ₹250, an ROE of 150 percent. Lower margin with higher turnover beat higher margin with low volume.

HUL's ROE is roughly 82 percent, on equity of about ₹216 crore of share capital plus ₹7,440 crore of reserves.`,
    caution: `When ROE jumps suddenly, the first check is whether debt has increased. Case 1: ₹100 of equity, ₹20 profit, ROE 20 percent. Case 2: ₹50 of equity plus ₹50 of debt at 12 percent, interest ₹6, profit ₹14 on a ₹50 base, ROE 28 percent. Lower absolute profit, higher-looking ROE, purely from leverage. For debt-heavy companies, use ROCE instead.`,
    relatedRatios: ["return-on-capital-employed", "dupont-analysis", "net-profit-margin", "debt-to-equity"],
    glossary: ["ROE"],
    goDeeper: [
      { label: "Profitability ratios (Foundations)", href: "/vault/guides/profitability-ratios" },
      { label: "ROE comparison and DuPont: why higher is not better (Research)", href: "/analysis/valuation-modeling/roe-comparison-dupont-why-higher-isnt-better" },
    ],
  },
  {
    slug: "return-on-capital-employed",
    name: "Return on Capital Employed",
    fullName: "ROCE",
    group: "profitability-and-returns",
    definition:
      "Return on capital employed measures operating profit earned on all the money running the business, equity and debt together.",
    formulas: [
      { label: "Capital Employed", expression: "Capital Employed = Share Capital + Total Reserves + Borrowings" },
      { label: "ROCE", expression: "ROCE (%) = Operating Profit ÷ Capital Employed × 100" },
    ],
    benchmark: "Use ROCE for debt-heavy companies and ROE for zero-debt ones",
    reading: `Put in ₹100 of your own equity and ₹100 borrowed from a friend, ₹200 of capital employed. End the year with ₹400 and ROCE is 100 percent.

The numerator is operating profit, before interest and tax, for a precise reason. Capital employed already includes debt in the denominator. Using net profit, which has interest already deducted, would penalise the ratio twice for the same debt. ROE uses net profit because an equity holder only cares what is left after lenders and the taxman are paid.

The rules follow from that. A zero-debt company: use ROE, because there is no interest distortion and net profit over equity gives the true final picture. A debt-heavy company: use ROCE, because ROE will flatter it.`,
    example: `HUL earns an ROCE of about 116 percent. It earns ₹116 on every ₹100 of capital, which is why the market awards it a premium. HUL also has zero debt, yet its ROE is about 82 percent, not 116. The denominators match; the numerators do not. Net profit is roughly ₹6,000 crore and operating profit roughly ₹9,000 crore, on equity of about ₹7,656 crore. "Zero debt" does not make the two ratios equal.

Cadila Healthcare raised about ₹9,000 crore as equity and about ₹3,000 crore as debt on which it pays interest. Its ROE looks better than its ROCE for exactly the leverage reason.`,
    caution: `The leverage trap in numbers: ₹100 of equity plus a ₹100 interest-free loan, turned into ₹400. ROCE says ₹200 earned on ₹200, 100 percent. ROE says ₹300 earned on ₹100 of equity, 300 percent, far better than the business really is.`,
    relatedRatios: ["return-on-equity", "debt-to-equity", "interest-coverage"],
    glossary: ["ROCE"],
    goDeeper: [
      { label: "Cost of capital (Foundations)", href: "/vault/guides/cost-of-capital" },
      { label: "WACC calculator", href: "/vault/interactive/wacc" },
    ],
  },
  {
    slug: "gross-margin",
    name: "Gross Margin",
    fullName: "Gross Profit Margin",
    group: "profitability-and-returns",
    definition:
      "Gross margin is what remains of each rupee of sales after paying for the raw materials and direct costs of making the product, before any operating expense.",
    formulas: [
      { label: "Gross Margin", expression: "Gross Margin (%) = (Sales − Cost of Goods Sold) ÷ Sales × 100" },
    ],
    benchmark: "Stable or rising is the signal; the level depends entirely on the industry",
    reading: `Gross margin is the first of the three margins on the way down the profit and loss statement, and the purest measure of pricing power. A company that can raise prices without losing customers, or buy inputs cheaper than rivals, shows it here before it shows anywhere else.

Read the trend more than the level. A falling gross margin means input costs are rising faster than prices, or the company is discounting to hold volume. Either way, the problem starts at the top of the statement and everything below it inherits it.`,
    example: `The pencil from the notes: bought for ₹10 and sold for ₹15, the gross margin is 33.3 percent, ₹5 on ₹15 of selling price. Note that the markup on cost is 50 percent; finance always quotes margin on the selling price. A brand-led business such as a premium phone maker can hold a very high gross margin because the brand, not the components, sets the price.`,
    relatedRatios: ["operating-margin", "net-profit-margin", "ebitda-margin"],
    glossary: ["Gross Margin"],
    goDeeper: [
      { label: "Reading an income statement (Foundations)", href: "/vault/guides/reading-an-income-statement" },
    ],
  },
  {
    slug: "operating-margin",
    name: "Operating Margin",
    fullName: "EBIT Margin",
    group: "profitability-and-returns",
    definition:
      "Operating margin is the profit from running the business, before interest and tax, as a percentage of sales. It shows how efficiently the company converts revenue into profit from operations alone.",
    formulas: [{ label: "Operating Margin", expression: "Operating Margin (%) = Operating Profit (EBIT) ÷ Sales × 100" }],
    benchmark: "Compare within the sector and across five years; watch the gap to gross margin",
    reading: `Between gross margin and operating margin sit the running costs: salaries, rent, advertising, distribution, and depreciation. The gap between the two tells you how expensive the business is to operate. A wide gap with a healthy gross margin means heavy overheads, which is normal for a consumer brand that advertises constantly and unusual for a commodity producer.

Operating profit is also the numerator in ROCE and in interest coverage, so a falling operating margin quietly weakens both of those ratios at once.`,
    example: `HUL earns operating profit of roughly ₹9,000 crore against net profit of roughly ₹6,000 crore. The ₹3,000 crore gap is mostly tax, since the company carries no debt and pays no interest. For a debt-heavy company the same gap would also contain the interest bill, which is why operating margin is the fairer measure for comparing businesses with different balance sheets.`,
    relatedRatios: ["gross-margin", "ebitda-margin", "net-profit-margin", "return-on-capital-employed", "interest-coverage"],
    glossary: ["Operating Margin"],
    goDeeper: [
      { label: "Profitability ratios (Foundations)", href: "/vault/guides/profitability-ratios" },
    ],
  },
  {
    slug: "ebitda-margin",
    name: "EBITDA Margin",
    group: "profitability-and-returns",
    definition:
      "EBITDA margin is operating profit before depreciation and amortisation as a percentage of sales. It approximates the cash profit from operations before any capital spending.",
    formulas: [
      { label: "EBITDA Margin", expression: "EBITDA Margin (%) = EBITDA ÷ Sales × 100" },
      { label: "EBITDA", expression: "EBITDA = Operating Profit + Depreciation + Amortisation" },
    ],
    benchmark: "Useful for comparing capital-intensive peers; never mistake it for free cash",
    reading: `Depreciation is an accounting charge that spreads the cost of plant over its life. Adding it back gives a margin that is not distorted by whether a company bought its factory last year or twenty years ago. That makes EBITDA margin the standard comparison in cement, steel, telecom, hotels, and any business where the plant is the product.

The weakness is the same as the strength. Depreciation is not a real cash cost this year, but plant does wear out and must be replaced. A business that reports a fat EBITDA margin and then spends all of it on replacement capex has no free cash flow at all.`,
    example: `Illustration: a cement company with ₹1,000 crore of sales, ₹150 crore of operating profit, and ₹100 crore of depreciation has an EBITDA margin of 25 percent but an operating margin of 15 percent. A rival with newer plants and higher depreciation might show the same 25 percent EBITDA margin and only a 10 percent operating margin. The EBITDA comparison is fair; the operating margin comparison punishes the company that has just invested.`,
    caution: `Airtel shows why EBITDA can mislead. The cash comes in, but towers break and cables fail, and the network needs more reinvestment than the business earns. EBITDA margin looks fine; free cash flow is negative. Always read EBITDA margin next to capital expenditure.`,
    relatedRatios: ["operating-margin", "ev-to-ebitda", "free-cash-flow", "net-debt-to-ebitda"],
    glossary: ["EBITDA Margin", "EV/EBITDA"],
  },
  {
    slug: "return-on-assets",
    name: "Return on Assets",
    fullName: "ROA",
    group: "profitability-and-returns",
    definition:
      "Return on assets measures net profit against everything the company owns, regardless of whether it was funded by shareholders or lenders. It is ROE with the leverage removed.",
    formulas: [{ label: "ROA", expression: "ROA (%) = Net Profit ÷ Total Assets × 100" }],
    benchmark: "Higher is better; a wide gap between ROE and ROA means the ROE is built on debt",
    reading: `ROE divides profit by equity only. ROA divides it by all assets, which equal equity plus everything borrowed. The two ratios therefore differ by exactly the leverage: ROE equals ROA multiplied by the equity multiplier from the DuPont identity.

That makes ROA the quickest honesty check on a high ROE. If ROE is 28 percent and ROA is 7 percent, the company is running four rupees of assets for every rupee of equity, and most of the return is being manufactured by borrowing. If ROE and ROA are close, the return is genuine.`,
    example: `From the leverage example in the notes: a business with ₹50 of equity and ₹50 of debt earns ₹14 after paying ₹6 of interest. Its ROE is 28 percent on the ₹50 of equity, but its ROA is 14 percent on the ₹100 of total assets. The all-equity version of the same business earned ₹20 on ₹100, an ROE and ROA of 20 percent each. The lower-profit, higher-debt version shows the better ROE and the worse ROA.`,
    caution: `For banks the balance sheet is inverted, assets are loans and liabilities are deposits, and the benchmarks are different. Use the separate bank ROA entry for lenders.`,
    relatedRatios: ["return-on-equity", "dupont-analysis", "return-on-capital-employed", "return-on-assets-bank"],
    glossary: ["ROA"],
  },
  {
    slug: "dividend-payout-ratio",
    name: "Dividend Payout Ratio",
    group: "profitability-and-returns",
    definition:
      "The dividend payout ratio is the share of net profit a company distributes as dividends. What is not paid out is retained in reserves and grows the equity base.",
    formulas: [
      { label: "Payout Ratio", expression: "Dividend Payout Ratio (%) = Total Dividends ÷ Net Profit × 100" },
      { label: "Retention", expression: "Retention Ratio (%) = 100 − Payout Ratio" },
    ],
    benchmark: "A very high payout with a very high ROE deserves suspicion",
    reading: `Retained profit feeds directly into reserves, and reserves sit in the denominator of ROE. So payout policy changes ROE without changing the business at all.

Scenario A: ₹100 of equity, ₹100 of profit, all of it paid out. Reserves stay at zero, equity stays at ₹100, and the next year's ROE looks like ₹1 earning ₹1, 100 percent. Scenario B: the same ₹100 of profit retained. Reserves become ₹100, equity becomes ₹200, and the same profit now looks like 50 percent ROE. Same business, half the ROE, purely from the payout decision.

Some companies pay high dividends deliberately to keep the equity base small, because they know investors screen on ROE. The generous explanation is that the company genuinely has no use for the cash. The check is simple: a stock with an 8 to 10 percent dividend yield and a high payout should have its ROE read with that in mind.`,
    example: `HUL pays an ordinary dividend yield of 1 to 1.5 percent, the kind of payout most profitable companies make, and still produces an ROE of about 82 percent. That is genuine quality. A company producing a similar ROE only because it pays out nearly everything it earns is a different animal.`,
    relatedRatios: ["dividend-yield", "return-on-equity", "free-cash-flow"],
    glossary: ["Dividend Payout Ratio", "Dividend Yield"],
  },

  // ── Leverage and liquidity ──────────────────────────────────────────────
  {
    slug: "debt-to-equity",
    name: "Debt to Equity Ratio",
    fullName: "D/E",
    group: "leverage-and-liquidity",
    definition:
      "The debt to equity ratio compares borrowed money with shareholders' money. It shows how much of the business is financed by lenders who must be paid whether or not there is profit.",
    formulas: [{ label: "D/E", expression: "D/E = Total Debt ÷ Total Equity" }],
    benchmark: "The investor's ideal is zero; never apply it to banks or NBFCs",
    reading: `Commerce textbooks teach that the ideal D/E is 2:1, borrowing twice your equity, because leverage boosts shareholder returns. The investor's view is different: the ideal D/E is zero.

The reason is asymmetry. Equity holders are paid only if there is profit, and they accept that. Interest must be paid whether there is profit or loss. When an industry slowdown brings two or three years of losses and there is no money left for interest, the company sinks. Many good businesses have been destroyed this way.`,
    example: `Eicher Motors carries a D/E of about 0.02 and Page Industries about 0.1. Both created enormous wealth with essentially no debt.`,
    caution: `Never apply D/E to banks, NBFCs, or any lending business. Borrowing from the public through current accounts, savings accounts, and fixed deposits, and lending it forward, is their business model. Research platforms correctly drop D/E for banks and show CASA, cost of funds, and net interest income instead. And a low D/E is not enough on its own: a company can borrow little and still be unsafe if it earns no operating profit, which is what interest coverage checks.`,
    relatedRatios: ["interest-coverage", "quick-ratio", "return-on-capital-employed", "enterprise-value"],
    glossary: ["Debt-to-Equity"],
    goDeeper: [
      { label: "Solvency ratios (Foundations)", href: "/vault/guides/solvency-ratios" },
      { label: "Capital structure (Foundations)", href: "/vault/guides/capital-structure" },
    ],
  },
  {
    slug: "interest-coverage",
    name: "Interest Coverage Ratio",
    group: "leverage-and-liquidity",
    definition:
      "Interest coverage shows how many times over a company can pay its interest bill out of operating profit.",
    formulas: [{ label: "Interest Coverage", expression: "Interest Coverage = Operating Profit ÷ Interest Expense" }],
    benchmark: "Minimum 4 to 5 times for comfort; higher is better",
    reading: `The numerator is operating profit, not net profit, because net profit is calculated after interest has already been paid. To judge whether the company can afford its interest at all, you need the profit before interest.

This ratio matters even when D/E is low. A company can have a D/E below 1 and still be unsafe if it earns little or no operating profit. A loss-making business cannot repay the bank no matter how little it borrowed.`,
    example: `Tata Chemicals earns operating profit of about ₹1,400 crore against interest of roughly ₹100 to ₹108 crore, a coverage of slightly above 12 times. For every ₹100 of interest owed, it earns about ₹1,200 of operating profit.`,
    caution: `Interest coverage uses the annual profit and loss statement, which arrives once a year. Within the year a company can take short-term or working capital loans that this ratio never sees. The quick ratio covers that gap. On some platforms this ratio is not shown by default and has to be added from a dropdown.`,
    relatedRatios: ["debt-to-equity", "quick-ratio"],
    glossary: ["Interest Coverage"],
    goDeeper: [
      { label: "Solvency ratios (Foundations)", href: "/vault/guides/solvency-ratios" },
      { label: "Credit risk fundamentals (Foundations)", href: "/vault/guides/credit-risk-fundamentals" },
    ],
  },
  {
    slug: "quick-ratio",
    name: "Quick Ratio",
    group: "leverage-and-liquidity",
    definition:
      "The quick ratio checks whether a company holds enough cash and liquid investments to pay the obligations coming due in the next few months, even in an emergency.",
    formulas: [
      { label: "Quick Ratio, strict form", expression: "Quick Ratio = (Cash + Liquid Investments) ÷ Short-Term Liabilities" },
      { label: "Textbook form", expression: "Quick Ratio = (Current Assets − Inventory) ÷ Current Liabilities" },
    ],
    benchmark: "Must be above 1",
    reading: `Interest coverage looks at the whole year. The quick ratio looks at the next two to four months. It asks a blunt question: if every short-term bill fell due at once, could the company pay from what it can turn into cash immediately?

A reading of 2 means liquid assets are double the short-term liabilities; the company could pay them off twice over. A reading just under 1 is the bare minimum and should not go lower. The strict form above, which counts only cash and liquid investments, is the more conservative reading; the textbook form also counts receivables.`,
    example: `Tata Chemicals showed a quick ratio of about 2. Godrej Consumer showed a ratio slightly below 1 but close to it, the bare minimum acceptable.`,
    relatedRatios: ["interest-coverage", "cash-conversion-cycle", "debt-to-equity"],
    glossary: ["Quick Ratio", "Current Ratio"],
    goDeeper: [
      { label: "Liquidity ratios (Foundations)", href: "/vault/guides/liquidity-ratios" },
      { label: "Working capital (Foundations)", href: "/vault/guides/working-capital" },
    ],
  },
  {
    slug: "current-ratio",
    name: "Current Ratio",
    group: "leverage-and-liquidity",
    definition:
      "The current ratio compares everything a company expects to turn into cash within a year with everything it must pay within a year. It is the broadest measure of short-term solvency.",
    formulas: [{ label: "Current Ratio", expression: "Current Ratio = Current Assets ÷ Current Liabilities" }],
    benchmark: "Above 1 is the floor; between 1.5 and 2 is comfortable for most manufacturers",
    reading: `Current assets include cash, liquid investments, receivables owed by customers, and inventory. Current liabilities include supplier bills, short-term loans, and the portion of long-term debt due this year. A ratio below 1 means the company cannot cover the next twelve months of obligations from what it has, and will depend on new borrowing or on selling more.

The current ratio is generous because it counts inventory and receivables as if they were cash. Inventory can be unsellable and receivables can bounce. That is why the quick ratio strips them out. Read the two together: a healthy current ratio with a weak quick ratio means the "liquidity" is really stock sitting in a warehouse.`,
    example: `Illustration: current assets of ₹600 crore made up of ₹100 crore cash, ₹200 crore receivables, and ₹300 crore inventory, against current liabilities of ₹400 crore. The current ratio is 1.5, which looks fine. The strict quick ratio, cash and liquid investments only, is 0.25. If a big customer delays payment and the inventory does not move, the company is in trouble despite a respectable current ratio.`,
    caution: `A very high current ratio is not automatically good. It can mean cash idling, receivables piling up because customers are not paying, or inventory that is not selling. HUL runs a negative cash cycle and a lean balance sheet precisely because it does not let money sit in working capital.`,
    relatedRatios: ["quick-ratio", "cash-conversion-cycle", "working-capital-days"],
    glossary: ["Current Ratio", "Quick Ratio"],
    goDeeper: [
      { label: "Liquidity ratios (Foundations)", href: "/vault/guides/liquidity-ratios" },
    ],
  },
  {
    slug: "net-debt-to-ebitda",
    name: "Net Debt to EBITDA",
    fullName: "Leverage Ratio",
    group: "leverage-and-liquidity",
    definition:
      "Net debt to EBITDA tells you how many years of operating cash profit it would take to repay all borrowings, net of cash on hand. It is the leverage measure lenders and rating agencies actually use.",
    formulas: [
      { label: "Net Debt / EBITDA", expression: "Net Debt to EBITDA = (Total Debt − Cash and Cash Equivalents) ÷ EBITDA" },
    ],
    benchmark: "Below 1 is conservative; above 3 is stretched for most non-financial companies",
    reading: `Debt to equity compares borrowings with the accounting value of equity, which can be small for a great business and large for a bad one. Net debt to EBITDA compares borrowings with the cash profit that will actually service them, which is what matters when a bad year arrives.

A reading of 1 means one year of EBITDA clears all debt. A reading of 4 means four years, during which any downturn in EBITDA stretches it further. Rating agencies weigh this ratio heavily, and loan covenants are often written around it, so a company drifting above 3 tends to find its borrowing costs rising.`,
    example: `The Adlabs Entertainment case from the notes shows why market cap alone misleads: over ₹1,000 crore of debt sat behind a ₹22 crore market cap. Net debt to EBITDA is the ratio that asks how many years of the park's operating earnings it would take to repay that debt, which is the question to settle before ₹22 crore ever looks cheap. At the other end, Eicher Motors at a D/E of about 0.02 and Page Industries at about 0.1 run this ratio close to zero, because there is almost no debt to divide.`,
    caution: `Do not apply this to banks or NBFCs; borrowing and lending is their business. And EBITDA can be inflated by one-off income, so use a normal year's figure, not a peak.`,
    relatedRatios: ["debt-to-equity", "interest-coverage", "ebitda-margin", "enterprise-value"],
    glossary: ["Debt-to-Equity", "EV/EBITDA"],
    goDeeper: [
      { label: "Credit risk fundamentals (Foundations)", href: "/vault/guides/credit-risk-fundamentals" },
      { label: "Covenants and triggers (Foundations)", href: "/vault/guides/covenants-and-triggers" },
    ],
  },

  // ── Efficiency ──────────────────────────────────────────────────────────
  {
    slug: "asset-turnover",
    name: "Asset Turnover",
    group: "efficiency",
    definition:
      "Asset turnover measures how much sales a company generates from each rupee of assets: plant, machinery, computers, land.",
    formulas: [{ label: "Asset Turnover", expression: "Asset Turnover = Sales ÷ Total Assets" }],
    benchmark: "Higher is always better; a fall needs a cause",
    reading: `Two people each buy a ₹100 machine. One produces and sells ₹500 of goods, the other only ₹100. The first runs the better business. That is asset turnover.

Think of a taxi. The car is the asset; the more rides it runs in a day, the better the turnover. Ola and Uber essentially promise car owners "we will raise your asset turnover" by delivering customers at the press of a button instead of through phone calls and referrals.

When asset turnover falls, there are two possible causes and you must tell them apart. Either the company is genuinely struggling to sell and volumes are falling, or it has just added a large new plant and sales have not yet caught up, which is temporary. To check, look at one year sales growth in the ratios section. Falling sales confirm the first cause.`,
    example: `HUL sells about ₹220 of goods for every ₹100 of assets. A weak penny stock managed only ₹7 per ₹100. Symphony generated ₹1.30 of sales per ₹1 of assets in 2017 and later only ₹0.67, roughly halved since 2015. Its one year sales growth was minus 23 percent, which ruled out the "new plant" explanation. The decline was a genuine sales problem.`,
    relatedRatios: ["dupont-analysis", "cash-conversion-cycle", "net-profit-margin"],
    glossary: ["Asset Turnover"],
    goDeeper: [
      { label: "Efficiency ratios (Foundations)", href: "/vault/guides/efficiency-ratios" },
    ],
  },
  {
    slug: "cash-conversion-cycle",
    name: "Cash Conversion Cycle",
    fullName: "Cash Cycle",
    group: "efficiency",
    definition:
      "The cash conversion cycle is the number of days between paying for raw material and receiving cash from the final sale.",
    formulas: [{ label: "Cash Conversion Cycle", expression: "Cash Cycle (days) = Inventory Days + Receivable Days − Payable Days" }],
    benchmark: "Lower is better; negative is excellent",
    reading: `Buy cloth for T-shirts and pay on the 1st. Stitching takes 10 days. Selling takes 20 more. The money returns on the 30th, so the cash cycle is 30 days.

The cycle reveals two things at a glance: whether the company can collect from customers on time, and whether it can actually convert its assets into sellable goods. A negative cycle, where cash from customers arrives before suppliers are paid, tells you the company's reputation and bargaining power are extremely strong. Suppliers and distributors both accept unfavourable terms to keep the relationship.`,
    example: `HUL runs a cash cycle of roughly minus 52 days. It is a huge buyer, so suppliers agree to be paid 40 days after delivery. Its plants turn raw material into product in about two days. Its distribution network sells that product within four or five days, and it collects advances from distributors and wholesalers. Cash comes in around day 7 and goes out on day 40. Money arrives before it is spent, on both sides.

At the other extreme, a penny stock whose full cycle from buying raw material to collecting from distributors took over a year. Money stuck in the market for twelve months is a business any shopkeeper would recognise as doomed.`,
    caution: `Banks and financial companies work completely differently. Do not compute a cash cycle for them.`,
    relatedRatios: ["asset-turnover", "quick-ratio", "cfo-to-pat"],
    glossary: ["Working Capital Cycle"],
    goDeeper: [
      { label: "Working capital (Foundations)", href: "/vault/guides/working-capital" },
      { label: "Efficiency ratios (Foundations)", href: "/vault/guides/efficiency-ratios" },
    ],
  },
  {
    slug: "dupont-analysis",
    name: "DuPont Analysis",
    fullName: "ROE decomposition",
    group: "efficiency",
    definition:
      "DuPont analysis breaks return on equity into three drivers, margin, asset turnover, and leverage, so you can see whether a high ROE was earned or borrowed.",
    formulas: [
      { label: "DuPont identity", expression: "ROE = Net Profit Margin × Asset Turnover × Equity Multiplier" },
      { label: "Equity Multiplier", expression: "Equity Multiplier = Total Assets ÷ Shareholders' Equity" },
    ],
    benchmark: "A good ROE rises through margin or turnover, not through the leverage multiplier",
    reading: `Two companies can both show a 25 percent ROE and be completely different businesses. One earns it by selling at a higher profit per unit, or by selling more volume per unit of asset. The other earns it by piling on debt, which raises the equity multiplier.

The warning pattern: net margin roughly flat, asset turnover roughly flat, ROE up, and the leverage multiplier jumped. That ROE increase came purely from borrowing. Do not be pleased by it. Treat it as poor-quality ROE. The first check whenever ROE jumps is whether debt has increased.`,
    example: `Symphony's ROE fell over five years from 44 percent to 41, 45, 34, and finally 15 percent. Net margin dropped from the 25 to 29 percent range to 19 percent, which explains part of the fall, but margin slipping from 26 to 19 cannot halve an ROE on its own. Asset turnover had halved since 2015, and that was the major factor. Both real levers moved the wrong way at once: selling at lower profit and selling less volume.`,
    relatedRatios: ["return-on-equity", "net-profit-margin", "asset-turnover", "debt-to-equity"],
    glossary: ["ROE", "Asset Turnover"],
    goDeeper: [
      { label: "DuPont decomposition (Foundations)", href: "/vault/guides/dupont-decomposition" },
      { label: "ROE comparison and DuPont: why higher is not better (Research)", href: "/analysis/valuation-modeling/roe-comparison-dupont-why-higher-isnt-better" },
      { label: "Compute ratios from raw statements (Learn-by-Doing)", href: "/vault/interactive/compute-ratios" },
    ],
  },
  {
    slug: "working-capital-days",
    name: "Working Capital Days",
    fullName: "Inventory, Receivable, and Payable Days",
    group: "efficiency",
    definition:
      "Working capital days are the three components of the cash conversion cycle: how long stock sits before it is sold, how long customers take to pay, and how long the company takes to pay its suppliers.",
    formulas: [
      { label: "Inventory Days", expression: "Inventory Days = Inventory ÷ Cost of Goods Sold × 365" },
      { label: "Receivable Days (DSO)", expression: "Receivable Days = Trade Receivables ÷ Sales × 365" },
      { label: "Payable Days (DPO)", expression: "Payable Days = Trade Payables ÷ Cost of Goods Sold × 365" },
    ],
    benchmark: "Low inventory and receivable days, high payable days; watch the trend more than the level",
    reading: `The cash conversion cycle is a single number. These three ratios show which part of it is moving. Inventory days rising means stock is not selling or the company is over-producing. Receivable days rising means customers are paying later, or the company is pushing sales by offering credit, which is a classic way to book profit that never turns into cash. Payable days rising can be strength, suppliers extending terms to a valued customer, or weakness, a company delaying payment because it has no cash.

Read each against the company's own history and its closest peers. A sudden jump in receivable days alongside strong reported sales growth is one of the most reliable early warnings in financial analysis.`,
    example: `HUL's negative cash cycle of about minus 52 days decomposes into these parts: production takes about two days, the product sells within four to five days, distributors pay advances, and suppliers are paid around day 40. Short inventory days, near-zero or negative receivable days, and long payable days, all at once. The penny stock in the notes, whose full cycle exceeded a year, had the opposite on every line.`,
    caution: `Use cost of goods sold for inventory and payables and sales for receivables, and keep the same convention across years. Mixing them makes the trend meaningless.`,
    relatedRatios: ["cash-conversion-cycle", "current-ratio", "cfo-to-pat"],
    glossary: ["Working Capital Cycle"],
    goDeeper: [
      { label: "Working capital (Foundations)", href: "/vault/guides/working-capital" },
      { label: "Spot the red flags (Learn-by-Doing)", href: "/vault/interactive/spot-the-red-flags" },
    ],
  },
  {
    slug: "fixed-asset-turnover",
    name: "Fixed Asset Turnover",
    group: "efficiency",
    definition:
      "Fixed asset turnover measures how much sales a company generates from its plant, machinery, and buildings alone, leaving out cash, inventory, and receivables.",
    formulas: [{ label: "Fixed Asset Turnover", expression: "Fixed Asset Turnover = Sales ÷ Net Fixed Assets" }],
    benchmark: "Higher is better; a drop right after a large capex is normal, a drop without one is not",
    reading: `Total asset turnover can be dragged down by a pile of idle cash or a bloated receivables book. Fixed asset turnover isolates the productive plant and asks how hard it is being worked. It is the right ratio for capital-intensive businesses: cement, steel, power, auto, and anything that builds a factory before it sells a product.

The same two-cause rule applies as for total asset turnover. Falling fixed asset turnover after a new plant is commissioned is expected and should recover as the plant fills. Falling fixed asset turnover with no new plant means volumes are shrinking, and the one year sales growth figure will confirm it.`,
    example: `Symphony's total asset turnover fell from ₹1.30 of sales per rupee of assets in 2017 to ₹0.67 later. The question was whether a new asset base or a sales decline caused it. Sales growth of minus 23 percent settled it: the plant was not new, the customers were gone. Fixed asset turnover would have shown the same halving, and the same answer.`,
    relatedRatios: ["asset-turnover", "dupont-analysis", "ebitda-margin"],
    glossary: ["Asset Turnover"],
    goDeeper: [
      { label: "Efficiency ratios (Foundations)", href: "/vault/guides/efficiency-ratios" },
    ],
  },

  // ── Cash flow checks ────────────────────────────────────────────────────
  {
    slug: "cfo-to-pat",
    name: "CFO to PAT Ratio",
    fullName: "Cash flow from operations to net profit",
    group: "cash-flow",
    definition:
      "The CFO to PAT ratio compares five years of cash flow from operations with five years of reported net profit. It is the simplest anti-fraud check in fundamental analysis.",
    formulas: [{ label: "CFO to PAT", expression: "CFO to PAT = Sum of 5 years' Cash Flow from Operations ÷ Sum of 5 years' Net Profit" }],
    benchmark: "Above 1, or at least above 0.8",
    reading: `Accounting books profit at the moment of sale, not at the moment of payment. Sell ₹100 of goods on a one-month credit and the books immediately show ₹100 of sales and ₹20 of profit. But cheques bounce and accounts run empty. The cash flow statement fixes this by showing when money actually arrived.

Use operating cash flow only. Not investing cash flow, not financing cash flow, because only operating cash flow shows money earned from the actual business of selling goods. Use five years, not one, because the figure swings from year to year as collections shift by a month or two. A gap of 2 to 4 percent over five years is normal. Operating cash flow far below net profit is a very dangerous sign. This one check screens out most fraudulent companies and most companies that fudge their numbers.`,
    example: `Godrej Consumer's five years of operating cash flow were 782, 512, 1,077, 1,235, and 1,082 crore, about ₹4,750 to ₹4,800 crore in total. Its five years of net profit were 654, 723, 848, 1,000, and 1,755 crore, about ₹4,900 crore. The gap is within 2 to 4 percent, so its accounting can be trusted.

Lovable reported about ₹50 crore of net profit over five years but only about ₹21 crore of operating cash flow. More than half the reported profit never arrived as cash.

Cox & Kings reported healthy profit every year until 2018 and passed the "avoid loss-making companies" test. But its operating cash flow was negative in four of those five years. Either the profit was paper, or the sales happened and the customers never paid.`,
    relatedRatios: ["free-cash-flow", "price-to-cash-flow", "earnings-per-share"],
    glossary: ["Cash Flow from Operations"],
    goDeeper: [
      { label: "Quality of earnings (Foundations)", href: "/vault/guides/quality-of-earnings" },
      { label: "Three years of cash flow: what one year hides (Research)", href: "/analysis/valuation-modeling/three-years-cash-flow-what-one-year-hides" },
      { label: "Spot the red flags (Learn-by-Doing)", href: "/vault/interactive/spot-the-red-flags" },
    ],
  },
  {
    slug: "free-cash-flow",
    name: "Free Cash Flow",
    fullName: "FCF",
    group: "cash-flow",
    definition:
      "Free cash flow is operating cash flow minus the cash the business is forced to reinvest to keep running and growing. It is the money that is genuinely surplus.",
    formulas: [{ label: "Free Cash Flow", expression: "FCF = Cash Flow from Operations − Capital Expenditure" }],
    benchmark: "Positive and growing; negative FCF must be funded by debt or new equity",
    reading: `Start with ₹20, buy two pencils, sell them for ₹30. Profit ₹10, cash received ₹10. But a business is a going concern; it has to keep operating and growing. Tomorrow you must buy three pencils with that ₹10. Free cash flow is zero, because the ₹10 is a compulsion, not a surplus. You cannot gift it or burn it.

Now you sell 1,000 pencils a day. ₹10,000 buys them and ₹15,000 comes back. You have decided that 1,000 a day is your steady scale, so tomorrow needs only ₹10,000. The extra ₹5,000 is free cash flow. Burn it and the business is unaffected.

In a real company the reinvestment is the repair and replacement of plant that wears out. A cement maker sells profitably and cash arrives, but after a year the machines have degraded and new ones are needed. What is left after that spend is FCF, the true surplus available for dividends, reserves, acquisitions, or investments. FCF is neither profit nor cash flow: profit is just a booked sale, and not all cash is bonus money.`,
    example: `Airtel generates cash flow but reports no EPS, because it is loss-making. Its business depends on a network: towers break, cables fail, roads are dug, maintenance runs day and night. Every rupee that comes in must be reinvested, and more than that must be spent. Its FCF is negative, which forced it to take on roughly ₹83,000 crore of debt just to keep operating. Cash exists; free cash does not.

Cox & Kings, profitable on paper every year until 2018, had negative operating cash flow in four of five years and negative FCF too. In pencil terms: 1,000 pencils bought for ₹10,000 and sold for ₹15,000 to a known contact on two months' credit. The books show ₹5,000 of profit at once, with no cash and no free cash. If the cheque bounces, the ₹10,000 of cost is gone as well.`,
    relatedRatios: ["cfo-to-pat", "price-to-cash-flow", "enterprise-value"],
    glossary: ["FCF Yield"],
    goDeeper: [
      { label: "DCF theory and mechanics (Foundations)", href: "/vault/guides/dcf-theory-and-mechanics" },
      { label: "Build a DCF step by step (Learn-by-Doing)", href: "/vault/interactive/build-a-dcf" },
      { label: "DCF sensitivity tool", href: "/vault/interactive/dcf-sensitivity" },
    ],
  },
  {
    slug: "cash-flow-per-share",
    name: "Cash Flow per Share",
    fullName: "Operating Cash Flow per Share",
    group: "cash-flow",
    definition:
      "Cash flow per share is operating cash flow divided by the number of shares. Set next to EPS, it shows how much of each share's reported profit actually arrived as cash.",
    formulas: [
      { label: "Cash Flow per Share", expression: "Cash Flow per Share = Cash Flow from Operations ÷ Number of Shares" },
      { label: "Gap to watch", expression: "EPS − Cash Flow per Share" },
    ],
    benchmark: "Should track EPS closely; a persistent shortfall is the CFO to PAT problem per share",
    reading: `EPS is booked profit per share. Cash flow per share is cash received per share. In a company with honest accounting and prompt-paying customers the two move together and the gap is small and random. A gap that is large, or that grows every year, means sales are being recorded that are not being collected.

It is the same test as the five-year CFO to PAT check, expressed per share so it can be read straight off a stock's summary page and used in the price to cash flow ratio.`,
    example: `HUL reported EPS of ₹27.94 against cash flow per share of ₹26.46. Profit per share exceeded cash per share by about ₹1.50, in one year only, most likely delayed collections that arrived a month or two later. Judged acceptable. Bajaj Consumer showed EPS of ₹15 against cash flow per share of about ₹12.5, implied by its P/CF of 11 at a ₹138 price. Of every ₹15 of earnings, about ₹12.5 turned into cash.`,
    relatedRatios: ["earnings-per-share", "price-to-cash-flow", "cfo-to-pat"],
    glossary: ["Cash Flow from Operations", "EPS"],
  },

  // ── Banking ─────────────────────────────────────────────────────────────
  {
    slug: "casa-ratio",
    name: "CASA Ratio",
    fullName: "Current Account and Savings Account Ratio",
    group: "banking",
    definition:
      "The CASA ratio is the share of a bank's total deposits that sits in current and savings accounts, the cheapest money a bank can raise.",
    formulas: [{ label: "CASA", expression: "CASA (%) = (Current Account + Savings Account Deposits) ÷ Total Deposits × 100" }],
    benchmark: "Higher is better; always read it together with cost of funds",
    reading: `Total deposits include fixed deposits, current accounts, savings accounts, inter-bank deposits, and every other form of funding. Current accounts pay 0 percent interest and savings accounts pay roughly 3 to 4 percent. That is extremely cheap money.

The spread math shows why it matters. A bank funded by fixed deposits at 7 percent and lending at 11 to 12 percent earns about 4 percent. A bank funded by savings accounts at 4 percent and lending at 12 percent earns 8 percent. Double the earning, from the same loan book.

There is an interest rate lifecycle. New banks pay high savings rates to attract CASA. As a bank establishes itself, it cuts them. SBI, the most established, pays about 3 percent; ICICI and HDFC Bank about 3.5 percent; IDFC First has paid 6.5 to 7 percent precisely because its CASA ratio is low and it needs current and savings accounts.`,
    example: `HDFC Bank's CASA ratio is about 42 percent, Axis Bank about 44 percent, and Kotak Mahindra about 52 percent. IDFC First is notably low.`,
    caution: `A bank can inflate CASA by paying high savings interest. An 80 percent CASA ratio built on 8 percent savings rates is not cheap money. That is why CASA is never read alone; the next entry, cost of funds, completes the picture.`,
    relatedRatios: ["cost-of-funds", "net-interest-margin", "common-size-analysis-banks"],
    glossary: ["CASA Ratio", "Cost of Funds"],
    goDeeper: [
      { label: "Sector-specific valuation (Foundations)", href: "/vault/guides/sector-specific-valuation" },
    ],
  },
  {
    slug: "cost-of-funds",
    name: "Cost of Funds",
    fullName: "Cost of Liabilities",
    group: "banking",
    definition:
      "Cost of funds is the blended average interest a bank pays across every kind of deposit and borrowing it uses to fund its loans.",
    formulas: [{ label: "Cost of Funds", expression: "Cost of Funds (%) = Total Interest Paid ÷ Average Interest-Bearing Liabilities × 100" }],
    benchmark: "Lower is better; it is the check on a flattering CASA ratio",
    reading: `Current accounts cost 0 percent, savings accounts about 3 percent, fixed deposits about 6.5 percent, and there are many other deposit forms. Cost of funds blends them into one number.

Always view CASA and cost of funds together. A high CASA ratio bought with high savings rates shows up here as a higher cost of funds, and only the pair tells you whether the bank's money is genuinely cheap.`,
    example: `HDFC Bank's cost of funds is about 4.88 percent. Kotak Mahindra's CASA ratio, at about 52 percent, is higher than HDFC Bank's 42 percent, which looks impressive. But HDFC Bank's cost of funds is still lower than Kotak's, because Kotak had to pay more interest to gather that CASA.`,
    relatedRatios: ["casa-ratio", "net-interest-margin"],
    glossary: ["Cost of Funds", "CASA Ratio"],
  },
  {
    slug: "net-npa",
    name: "Net NPA Ratio",
    fullName: "Net Non-Performing Assets",
    group: "banking",
    definition:
      "Net NPA is the percentage of a bank's loans, after provisions, that are not coming back. It measures the one skill a bank cannot do without: judging who will repay.",
    formulas: [{ label: "Net NPA", expression: "Net NPA (%) = (Gross NPAs − Provisions) ÷ Net Advances × 100" }],
    benchmark: "Lower is better; focus on net NPA, not gross",
    reading: `Banking is the business of lending. A bank that is good at telling who will repay from who will not is automatically the best bank, because everything else, growth, capital, margins, follows from that judgement. This single ratio is why HDFC Bank is regarded as one of the best banking franchises not just in India but globally.

Look specifically at net NPA, which is what remains after the bank has set aside provisions, rather than gross NPA.`,
    example: `HDFC Bank's net NPA is about 0.4 percent: of every ₹100 lent, less than 40 paise never returns. Central Bank of India, a large public sector bank, has shown about 8 percent: of every ₹100 lent, about ₹8 never returns.`,
    caution: `A loan that goes bad is capital being destroyed, which lowers the capital adequacy ratio and, in turn, the bank's ability to grow its loan book. NPAs are the start of the whole banking chain, not a standalone number.`,
    relatedRatios: ["capital-adequacy-ratio", "advances-growth", "common-size-analysis-banks"],
    glossary: ["NPA", "Provisions"],
    goDeeper: [
      { label: "Credit risk fundamentals (Foundations)", href: "/vault/guides/credit-risk-fundamentals" },
    ],
  },
  {
    slug: "advances-growth",
    name: "Advances Growth",
    fullName: "Loan Growth",
    group: "banking",
    definition:
      "Advances growth is the year-on-year increase in the loans a bank has disbursed. Since banks earn interest on loans, faster loan growth means faster earnings growth.",
    formulas: [{ label: "Advances Growth", expression: "Advances Growth (%) = (Advances This Year − Advances Last Year) ÷ Advances Last Year × 100" }],
    benchmark: "Read it with NPAs and capital adequacy; growth alone is not the achievement",
    reading: `Growth is not the hard part. Everyone in India wants a loan, and any bank could lend as much as it liked. Two constraints decide who grows well: lending only to people who will not become NPAs, and having the capital to lend in the first place.

That is why advances growth is read last, not first. A bank with a weak capital adequacy ratio simply cannot expand its loan book as fast as its peers, whatever the demand.`,
    example: `Kotak Mahindra reported advances growth of about 21 percent: ₹100 of loans last year became ₹121 this year. South Indian Bank's weaker capital adequacy corresponded with visibly slower advances growth.`,
    relatedRatios: ["capital-adequacy-ratio", "net-npa", "return-on-assets-bank"],
    glossary: ["NPA"],
  },
  {
    slug: "capital-adequacy-ratio",
    name: "Capital Adequacy Ratio",
    fullName: "CAR",
    group: "banking",
    definition:
      "The capital adequacy ratio measures how much capital a bank holds against its risk-weighted loans, which decides how much further lending it can support.",
    formulas: [{ label: "CAR", expression: "CAR (%) = (Tier 1 Capital + Tier 2 Capital) ÷ Risk-Weighted Assets × 100" }],
    benchmark: "17% and above is very good; around 12% or below is a danger sign",
    reading: `Higher is better. Raising capital is hard, because 30 to 40 banks compete for every deposit and each must offer something unique. A bank keeps its CAR healthy in two ways: keeping NPAs as low as possible, because a loan that goes bad is capital being destroyed, and attracting the maximum deposits.

The complete banking chain runs: control NPAs, build CASA, increase capital adequacy, which enables loan growth, which drives ROE, ROA, and EPS.`,
    example: `Kotak Mahindra's CAR is about 17 percent. HDFC Bank is similar, at 17 percent plus, with correspondingly strong advances growth. ICICI Bank is slightly lower, DCB Bank about 16 percent, Federal Bank somewhat behind, and South Indian Bank worse still, with the slower loan growth to match.`,
    relatedRatios: ["net-npa", "advances-growth", "casa-ratio"],
    glossary: ["Capital Adequacy Ratio", "NPA"],
  },
  {
    slug: "net-interest-margin",
    name: "Net Interest Margin",
    fullName: "NIM",
    group: "banking",
    definition:
      "Net interest margin is the interest a bank earns minus the interest it pays, as a percentage of the funds it holds, after allowing for money it could not lend out.",
    formulas: [
      { label: "Net Interest Income", expression: "Net Interest Income = Interest Earned − Interest Paid" },
      { label: "NIM", expression: "NIM (%) = Net Interest Income ÷ Average Interest-Earning Assets × 100" },
    ],
    benchmark: "Higher is better; distinguish it from the simple spread",
    reading: `The simple spread first. A bank has ₹100 at a 5 percent interest cost, so it pays ₹5, and lends at 12 percent, so it earns ₹12. The difference, ₹7, is the spread. But spread is not yet NIM.

Five people deposit ₹100 each, ₹500 at 5 percent, so total interest paid is ₹25. The bank cannot lend all ₹500. Some must sit as reserves with the RBI and some simply does not go out. Suppose only ₹400 is lent at 12 percent, earning ₹48. Net interest income is ₹48 − ₹25 = ₹23. NIM tells you what margin remains after paying every depositor and accounting for the un-lent funds.`,
    example: `HDFC Bank's NIM is about 4 percent. It earns roughly ₹4 on every ₹100 of deposits it holds.`,
    relatedRatios: ["casa-ratio", "cost-of-funds", "return-on-assets-bank"],
    glossary: ["Net Interest Margin", "CASA Ratio"],
  },
  {
    slug: "return-on-assets-bank",
    name: "Return on Assets (Banks)",
    fullName: "ROA",
    group: "banking",
    definition:
      "Return on assets measures a bank's net profit against its total assets, which for a bank means the loans it has given out.",
    formulas: [{ label: "ROA", expression: "ROA (%) = Net Profit ÷ Average Total Assets × 100" }],
    benchmark: "1% is the minimum; around 2% is very good",
    reading: `A bank's balance sheet is inverted compared with a normal company. Its assets are the loans it has given out, because those earn the income. Its liabilities are the deposits it has taken from you, because it must return that money; it borrowed it.

Below 1 percent ROA there is no point running a bank. Around 2 percent is very good. Because a bank's equity is a thin slice of its balance sheet, ROA is a fairer measure of lending quality than ROE, which leverage can flatter.`,
    example: `HDFC Bank's ROA is about 1.83 percent, very good, and Kotak Mahindra's about 1.69 percent. Bandhan Bank has shown over 3 percent, close to 4, which is exceptional, but its business model differs from other banks and should be treated as an exception rather than a benchmark.`,
    relatedRatios: ["net-interest-margin", "capital-adequacy-ratio", "return-on-equity"],
    glossary: ["ROA"],
    goDeeper: [
      { label: "Sector-specific valuation (Foundations)", href: "/vault/guides/sector-specific-valuation" },
    ],
  },
  {
    slug: "common-size-analysis-banks",
    name: "Common-Size Analysis (Banks)",
    fullName: "Line items per ₹100 of interest income",
    group: "banking",
    definition:
      "Common-size analysis restates every line of a bank's profit and loss as a percentage of interest income, and every funding source as a share of the balance sheet, so banks of any size can be compared line by line.",
    formulas: [
      { label: "Common-size P&L line", expression: "Line Item (%) = Line Item ÷ Interest Income × 100" },
      { label: "Common-size funding share", expression: "Funding Source (%) = Source ÷ Total Funding × 100" },
    ],
    benchmark: "Provisions and interest expense per ₹100 of interest income are the lines that separate banks",
    reading: `On the profit and loss side, ask what happens to every ₹100 of interest a bank earns: how much goes back to depositors, how much to running branches, how much is set aside for loans it doubts, and how much survives as profit. Operating expenses tend to look similar across banks, because rent and salaries are comparable. Interest expense and provisions are where banks differ.

On the balance sheet side, ask where the bank gets its money. There are four sources: share capital, reserves, deposits, and borrowings from the RBI or other banks. Deposits are the best source because they are the cheapest; current accounts pay nothing and savings 2.5 to 3.5 percent. Maximising the share of funding that comes from depositors is a huge advantage for any bank. The P&L explains the balance sheet: a bank paying more on savings to win depositors shows a high interest expense line, and that is exactly what lifts its deposit share over time.

Common-size analysis works for every sector, not just banking. Each sector's statements simply look different.`,
    example: `HDFC Bank, per ₹100 of interest income: about ₹51 paid to depositors (₹58,000 crore paid on ₹1,44,000 crore earned), other income of about 20 percent, operating expenses about ₹26, provisions about ₹10, profit before tax about ₹31, tax about ₹9, net profit about 22 to 23 percent, improved from 20.4 percent earlier. Deposits fund about 75 percent of its balance sheet.

Axis Bank: other income about 25 percent, so it is better at fees, insurance and mutual fund commissions, and locker charges. But interest expense is about ₹60, it must pay more to attract deposits, and provisions are about 30 percent against HDFC Bank's 10. That is the single biggest difference: its lending habits are not as good. Net profit about 2.5 percent. Deposits fund about 70 percent. Verdict: HDFC Bank is better at core banking, Axis at non-core banking.

IDFC First Bank, a new bank: fee income only about 10 percent, because it lacks its own mutual fund, insurance, and credit card products to cross-sell. Interest expense about ₹65, previously as high as ₹76 to ₹80, because it pays 6 percent on savings where others pay 3. Operating expenses are higher, partly forgivable for a bank still building branches. Provisions are below Axis but far above HDFC Bank. The combined effect left the bank in losses. Deposits fund only about 43 percent, though that share has climbed from 9 percent through 35, 38, and 42.`,
    relatedRatios: ["casa-ratio", "cost-of-funds", "net-npa", "net-interest-margin"],
    glossary: ["Provisions", "CASA Ratio"],
    goDeeper: [
      { label: "Compare two companies (Learn-by-Doing)", href: "/vault/interactive/compare-two-companies" },
      { label: "Reading an income statement (Foundations)", href: "/vault/guides/reading-an-income-statement" },
    ],
  },
  {
    slug: "gross-npa",
    name: "Gross NPA Ratio",
    fullName: "Gross Non-Performing Assets",
    group: "banking",
    definition:
      "Gross NPA is the share of a bank's total loans on which interest or principal has been overdue for more than 90 days, before any provisions are deducted.",
    formulas: [{ label: "Gross NPA", expression: "Gross NPA (%) = Gross Non-Performing Loans ÷ Total Advances × 100" }],
    benchmark: "Lower is better; the gap between gross and net NPA shows how much has been provided for",
    reading: `Gross NPA is the raw damage: every loan that has stopped performing, at full value. Net NPA is what remains after the bank has set aside provisions against those loans. The notes are clear that net NPA is the figure to focus on, because it is what still threatens capital. But gross NPA is where the story starts, and the relationship between the two is its own signal.

A bank with a high gross NPA and a low net NPA has recognised its bad loans and provided for them; the pain is in the past. A bank with gross and net NPA close together has recognised the loans but not yet paid for them; the pain is still coming. Gross NPA rising quarter after quarter means new loans are going bad faster than old ones are being resolved.`,
    example: `Illustration: two banks each with ₹1,00,000 crore of advances and ₹4,000 crore of gross NPAs, a gross NPA ratio of 4 percent. The first has provided ₹3,000 crore against them, so its net NPA is about 1 percent. The second has provided only ₹800 crore, so its net NPA is about 3.2 percent. Same gross NPA, very different balance sheet safety.`,
    relatedRatios: ["net-npa", "provision-coverage-ratio", "capital-adequacy-ratio"],
    glossary: ["NPA", "Provisions"],
    goDeeper: [
      { label: "Credit risk fundamentals (Foundations)", href: "/vault/guides/credit-risk-fundamentals" },
    ],
  },
  {
    slug: "provision-coverage-ratio",
    name: "Provision Coverage Ratio",
    fullName: "PCR",
    group: "banking",
    definition:
      "The provision coverage ratio is the share of a bank's gross non-performing loans that has already been written off against profit through provisions.",
    formulas: [{ label: "PCR", expression: "Provision Coverage Ratio (%) = Total Provisions ÷ Gross NPAs × 100" }],
    benchmark: "Higher is safer; a high ratio means the bad loans have already been paid for",
    reading: `Provisions are the money a bank sets aside from income against loans it doubts will be repaid. The coverage ratio asks what fraction of the recognised bad loans that money covers. At 100 percent, every rupee of bad loans has already been charged to profit, and any recovery from those loans is pure upside. At 40 percent, most of the loss is still sitting on the balance sheet waiting to hit capital.

It is the link between the profit and loss statement and the NPA ratios. In the common-size comparison from the notes, provisions per ₹100 of interest income were the single biggest line separating banks. A bank that provides generously will show lower profit today and a higher coverage ratio, and be the safer bank tomorrow.`,
    example: `From the gross NPA illustration: the bank with ₹4,000 crore of gross NPAs and ₹3,000 crore of provisions has a coverage ratio of 75 percent and a net NPA near 1 percent. The bank with ₹800 crore of provisions has a coverage ratio of 20 percent and a net NPA above 3 percent. The first bank's profit took the hit earlier; the second bank's profit is still borrowed from the future.`,
    relatedRatios: ["gross-npa", "net-npa", "common-size-analysis-banks"],
    glossary: ["Provisions", "NPA"],
  },
  {
    slug: "cost-to-income-ratio",
    name: "Cost to Income Ratio",
    group: "banking",
    definition:
      "The cost to income ratio measures a bank's operating expenses, branches, staff, technology, against its total income from interest and fees. It is the efficiency ratio for lenders, where asset turnover does not apply.",
    formulas: [
      { label: "Cost to Income", expression: "Cost to Income (%) = Operating Expenses ÷ (Net Interest Income + Other Income) × 100" },
    ],
    benchmark: "Lower is better; a rising ratio at a young bank is expansion, at an old bank it is a problem",
    reading: `The notes observe that operating expenses tend to look similar across established banks, because rent and salaries are comparable. That makes the cost to income ratio most useful in two situations: spotting a bank whose income is not keeping pace with its cost base, and judging a new bank that is spending heavily to grow.

For a new bank, high operating costs are partly forgivable. Branches are new, marketing is aggressive, and some setup cost even gets capitalised. The question is whether the ratio is falling as the branch network matures. For an established bank, a rising ratio means either costs are out of control or income is shrinking, and neither is good.`,
    example: `From the common-size walk-through in the notes: HDFC Bank's operating expenses run at about ₹26 per ₹100 of interest income and Axis Bank's at about ₹27, near-identical, as expected for mature banks. IDFC First's are higher, but it was still building branches and advertising heavily to attract deposits, and part of that spend was forgivable. The difference between the banks' profits came from interest expense and provisions, not from operating cost.`,
    relatedRatios: ["common-size-analysis-banks", "net-interest-margin", "return-on-assets-bank"],
    glossary: ["Net Interest Margin", "CASA Ratio"],
  },
  {
    slug: "credit-deposit-ratio",
    name: "Credit to Deposit Ratio",
    fullName: "CD Ratio",
    group: "banking",
    definition:
      "The credit to deposit ratio shows what share of the deposits a bank has collected it has lent out as loans. It measures how fully the bank is using its cheapest source of funds.",
    formulas: [{ label: "CD Ratio", expression: "Credit to Deposit Ratio (%) = Total Advances ÷ Total Deposits × 100" }],
    benchmark: "Too low wastes deposits; too high means loans are funded by expensive borrowings",
    reading: `A bank cannot lend every rupee it collects. Some must sit as reserves with the RBI, and some is held in government securities. So a CD ratio well below 100 percent is normal. A very low ratio means the bank is collecting deposits it cannot deploy, and paying interest on money that earns nothing. A ratio above 100 percent means the bank has lent more than its deposits and is funding the difference with borrowings from other banks or the RBI, which cost more.

Read it with the funding mix from the common-size balance sheet. A bank that funds 75 percent of its balance sheet from deposits can run a high CD ratio comfortably. A bank funding only 43 percent from deposits and the rest from borrowings has a CD ratio that flatters, because much of its "credit" is not funded by deposits at all.`,
    example: `Illustration built on the NIM example in the notes: five depositors bring in ₹500, and the bank lends ₹400, keeping ₹100 as reserves and liquid holdings. Its credit to deposit ratio is 80 percent. If a competitor lends ₹550 against the same ₹500 of deposits, its ratio is 110 percent, and the extra ₹50 of loans is funded by borrowing at a higher rate than it pays depositors, squeezing its margin.`,
    relatedRatios: ["casa-ratio", "advances-growth", "common-size-analysis-banks", "net-interest-margin"],
    glossary: ["CASA Ratio", "Cost of Funds"],
  },

  // ── Growth and shareholding ─────────────────────────────────────────────
  {
    slug: "sales-growth",
    name: "Sales Growth",
    fullName: "Revenue Growth",
    group: "growth-and-shareholding",
    definition:
      "Sales growth is the percentage increase in a company's revenue over a period. Compared across one, three, and five years it shows whether the business is accelerating, steady, or shrinking.",
    formulas: [
      { label: "One year growth", expression: "Sales Growth (%) = (Sales This Year − Sales Last Year) ÷ Sales Last Year × 100" },
      { label: "Multi-year average (CAGR)", expression: "Sales CAGR (%) = ((Sales in Final Year ÷ Sales in Base Year) ^ (1 ÷ Years) − 1) × 100" },
    ],
    benchmark: "Must be present; read the 1, 3, and 5 year figures together",
    reading: `Sales growth is listed in the notes as an essential check in its own right, alongside profit growth. Profit can be manufactured for a year or two by cutting costs or booking one-off income. Sales cannot grow for long unless customers are buying more. A company whose profit is growing while sales are flat is squeezing margin, which has a limit.

The three-window reading matters most. Growth accelerating from the five year average to the three year average to the latest year is the pattern that justifies a rising valuation. Decelerating growth with a still-high PE is the pattern that precedes a de-rating. Sales growth also settles the asset turnover question: a fall in turnover with negative sales growth is a demand problem, not a new-plant effect.`,
    example: `Symphony's one year sales growth of minus 23 percent was the figure that confirmed its halved asset turnover came from collapsing demand rather than from new capacity. On the PE side, the notes use the 1, 3, and 5 year windows for profit growth in exactly the same way: HUL at 15, 13, and 9 to 10 percent, improving; Colgate at 15, 10, and 7 percent, improving; Bajaj Consumer at 4.5, 4, and 8 percent, slowing.`,
    caution: `Use consolidated sales. Standalone sales for Tata Motors are about ₹70,000 crore; consolidated including JLR are about ₹3 lakh crore. Growth computed on one and compared with the other is meaningless.`,
    relatedRatios: ["profit-growth", "asset-turnover", "peg-ratio", "price-to-sales"],
    glossary: ["CAGR"],
    goDeeper: [
      { label: "CAGR calculator", href: "/vault/interactive/cagr" },
    ],
  },
  {
    slug: "profit-growth",
    name: "Profit Growth",
    fullName: "Earnings Growth",
    group: "growth-and-shareholding",
    definition:
      "Profit growth is the percentage increase in net profit over a period. It is the denominator of the PEG ratio and the figure that decides whether a high PE is deserved.",
    formulas: [
      { label: "One year growth", expression: "Profit Growth (%) = (Net Profit This Year − Net Profit Last Year) ÷ Net Profit Last Year × 100" },
      { label: "Multi-year average (CAGR)", expression: "Profit CAGR (%) = ((Profit in Final Year ÷ Profit in Base Year) ^ (1 ÷ Years) − 1) × 100" },
    ],
    benchmark: "Rising every year; use the 3 or 5 year average, and the latest year to choose between them",
    reading: `The notes' minimum checklist requires that the company be profitable every year and that profit be rising. The single-year figure can mislead in either direction: a one-off gain or loss swings it, and one negative year in an otherwise profitable company was explicitly noted rather than treated as disqualifying.

The three windows do the real work. Use the three or five year average as the growth rate in PEG. When they disagree, the latest year breaks the tie: if it matches the three year average, weight that; if it matches the five year average, weight that. Growth accelerating across the windows while PE is flat or falling is the setup worth the most attention.`,
    example: `Godrej Consumer: 75 percent over one year, 34 over three, 25 over five. Accelerating, so the three year figure carries the weight and a PE of 33 reads as fair. Bajaj Consumer: 4.5 percent over one year, 4 over three, 8 over five. Slowing, the latest year matches the three year average, and a PE of 9 reads as expensive against 4 percent growth. Same ratio, opposite verdicts, decided by the growth trend.`,
    caution: `Profit growth must be checked against cash. Cox & Kings reported rising profit every year until 2018 and negative operating cash flow in four of those five years. Growth in a number that never arrived as cash is not growth.`,
    relatedRatios: ["sales-growth", "peg-ratio", "pe-ratio", "cfo-to-pat", "earnings-per-share"],
    glossary: ["CAGR", "EPS"],
    goDeeper: [
      { label: "CAGR calculator", href: "/vault/interactive/cagr" },
      { label: "Quality of earnings (Foundations)", href: "/vault/guides/quality-of-earnings" },
    ],
  },
  {
    slug: "promoter-holding",
    name: "Promoter Holding",
    fullName: "Shareholding Pattern",
    group: "growth-and-shareholding",
    definition:
      "Promoter holding is the percentage of a company's shares owned by its founders or controlling group. Read with institutional holdings, its trend is an early warning of trouble long before it shows in the accounts.",
    formulas: [
      { label: "Promoter Holding", expression: "Promoter Holding (%) = Shares Held by Promoters ÷ Total Shares Outstanding × 100" },
      { label: "Institutional Holding", expression: "DII or FII Holding (%) = Shares Held by the Institution Type ÷ Total Shares Outstanding × 100" },
    ],
    benchmark: "Above 40 to 50% is a good sign; for very large companies, read the trend instead of the level",
    reading: `Promoters know the business better than anyone. When they buy more of it, they are telling you they have confidence in it. When they sell, they are telling you the opposite, whatever the press release says. Rising promoter holding is very positive. Falling promoter holding is very negative.

The level rule has an exception. Very large companies, worth ₹20,000 to ₹50,000 crore or more, often cannot sustain a high promoter stake, and banks and some large companies are not permitted one. In those cases the trend replaces the level.

Domestic institutional investors (mutual funds, insurers) and foreign institutional investors are the market's professionals. Track whether they are adding or reducing. The combined rule from the notes: promoter rising is positive, FII rising is positive, DII rising is positive. All three falling at once is the negative signal, and one of the best methods for finding companies in which both the owners and the professionals are losing faith. Add the stock to a watchlist so that changes in the shareholding pattern reach you as alerts.`,
    example: `Tata Chemicals: the Tata group's holding was 30.6 percent in a September quarter and rose above 31 percent by December, with further increases expected in the March quarter. Well below the 40 to 50 percent guideline, but a large company where the trend, rising, is what counts. Healthy DII and FII holdings alongside it gave an overall positive structure.`,
    caution: `Pledged promoter shares change the picture. A high promoter holding that is heavily pledged against loans can be sold by the lender in a downturn, which is the opposite of a vote of confidence. Check the pledge percentage next to the holding.`,
    relatedRatios: ["debt-to-equity", "cfo-to-pat", "dividend-yield"],
    glossary: ["Promoter Holding", "DII", "Promoter Pledge"],
    goDeeper: [
      { label: "Equities (Foundations)", href: "/vault/guides/equities" },
      { label: "Where to find Indian markets data (Foundations)", href: "/vault/guides/where-to-find-indian-markets-data" },
    ],
  },
];

export function findRatio(slug: string): RatioEntry | undefined {
  return RATIOS.find((r) => r.slug === slug);
}

export function ratiosInGroup(group: RatioGroupId): RatioEntry[] {
  return RATIOS.filter((r) => r.group === group);
}
