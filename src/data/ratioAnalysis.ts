// Ratio Analysis reference: one entry per ratio with a plain definition, the
// formula on its own labelled line, how to read the number, a worked Indian
// example, and where the ratio misleads. Source of truth for figures is the
// author's fundamental-analysis notes; do not invent or "update" company
// numbers here. Markdown is allowed in `reading`, `example`, and `caution`.
//
// Pages: /learn/ratio-analysis (hub) and /learn/ratio-analysis/:slug (entry).
// The sitemap generator reads the `slug:` lines of this file directly.

export type RatioGroupId =
  | "size-and-price"
  | "profitability-and-returns"
  | "leverage-and-liquidity"
  | "efficiency"
  | "cash-flow"
  | "banking";

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
      { label: "Equities (Foundations)", href: "/learn/foundations/markets-and-instruments/equities" },
      { label: "Relative valuation (Foundations)", href: "/learn/foundations/valuation/relative-valuation" },
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
      { label: "Capital structure (Foundations)", href: "/learn/foundations/corporate-finance/capital-structure" },
      { label: "Relative valuation (Foundations)", href: "/learn/foundations/valuation/relative-valuation" },
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
      { label: "Reading an income statement (Foundations)", href: "/learn/foundations/accounting/reading-an-income-statement" },
      { label: "Read an income statement line by line (Learn-by-Doing)", href: "/learn/by-doing/read-an-income-statement" },
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
      { label: "Market ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/market-ratios" },
      { label: "High PE: what it implies and when it is a trap (Research)", href: "/research/high-pe-what-it-implies-and-when-its-a-trap" },
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
      { label: "Reading a balance sheet (Foundations)", href: "/learn/foundations/accounting/reading-a-balance-sheet" },
      { label: "Sector-specific valuation (Foundations)", href: "/learn/foundations/valuation/sector-specific-valuation" },
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
      { label: "CAGR calculator", href: "/tools/cagr" },
      { label: "Relative valuation (Foundations)", href: "/learn/foundations/valuation/relative-valuation" },
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
      { label: "Reading a cash flow statement (Foundations)", href: "/learn/foundations/accounting/reading-a-cash-flow-statement" },
    ],
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
      { label: "Profitability ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/profitability-ratios" },
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
      { label: "Profitability ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/profitability-ratios" },
      { label: "ROE comparison and DuPont: why higher is not better (Research)", href: "/research/roe-comparison-dupont-why-higher-isnt-better" },
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
      { label: "Cost of capital (Foundations)", href: "/learn/foundations/corporate-finance/cost-of-capital" },
      { label: "WACC calculator", href: "/tools/wacc" },
    ],
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
      { label: "Solvency ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/solvency-ratios" },
      { label: "Capital structure (Foundations)", href: "/learn/foundations/corporate-finance/capital-structure" },
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
      { label: "Solvency ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/solvency-ratios" },
      { label: "Credit risk fundamentals (Foundations)", href: "/learn/foundations/credit-analysis/credit-risk-fundamentals" },
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
      { label: "Liquidity ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/liquidity-ratios" },
      { label: "Working capital (Foundations)", href: "/learn/foundations/corporate-finance/working-capital" },
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
      { label: "Efficiency ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/efficiency-ratios" },
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
      { label: "Working capital (Foundations)", href: "/learn/foundations/corporate-finance/working-capital" },
      { label: "Efficiency ratios (Foundations)", href: "/learn/foundations/financial-statement-analysis/efficiency-ratios" },
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
      { label: "DuPont decomposition (Foundations)", href: "/learn/foundations/financial-statement-analysis/dupont-decomposition" },
      { label: "ROE comparison and DuPont: why higher is not better (Research)", href: "/research/roe-comparison-dupont-why-higher-isnt-better" },
      { label: "Compute ratios from raw statements (Learn-by-Doing)", href: "/learn/by-doing/compute-ratios" },
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
      { label: "Quality of earnings (Foundations)", href: "/learn/foundations/accounting/quality-of-earnings" },
      { label: "Three years of cash flow: what one year hides (Research)", href: "/research/three-years-cash-flow-what-one-year-hides" },
      { label: "Spot the red flags (Learn-by-Doing)", href: "/learn/by-doing/spot-the-red-flags" },
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
      { label: "DCF theory and mechanics (Foundations)", href: "/learn/foundations/valuation/dcf-theory-and-mechanics" },
      { label: "Build a DCF step by step (Learn-by-Doing)", href: "/learn/by-doing/build-a-dcf" },
      { label: "DCF sensitivity tool", href: "/tools/dcf-sensitivity" },
    ],
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
      { label: "Sector-specific valuation (Foundations)", href: "/learn/foundations/valuation/sector-specific-valuation" },
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
      { label: "Credit risk fundamentals (Foundations)", href: "/learn/foundations/credit-analysis/credit-risk-fundamentals" },
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
      { label: "Sector-specific valuation (Foundations)", href: "/learn/foundations/valuation/sector-specific-valuation" },
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
      { label: "Compare two companies (Learn-by-Doing)", href: "/learn/by-doing/compare-two-companies" },
      { label: "Reading an income statement (Foundations)", href: "/learn/foundations/accounting/reading-an-income-statement" },
    ],
  },
];

export function findRatio(slug: string): RatioEntry | undefined {
  return RATIOS.find((r) => r.slug === slug);
}

export function ratiosInGroup(group: RatioGroupId): RatioEntry[] {
  return RATIOS.filter((r) => r.group === group);
}
