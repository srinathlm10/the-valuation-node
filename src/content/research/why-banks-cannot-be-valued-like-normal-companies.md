---
title: "Why Banks Cannot Be Valued Like Normal Companies"
slug: "why-banks-cannot-be-valued-like-normal-companies"
category: "Sector"
tags: ["bank valuation", "P/B ratio", "financial sector", "valuation methods"]
metaTitle: "Why Banks Need Different Valuation Methods | Valuation Node"
metaDescription: "Free cash flow DCF breaks down for banks. Learn why debt is raw material for a bank, why P/B and ROE drive bank valuation, and how analysts actually value lenders."
author: "Gajji Srinath"
publishDate: "INSERT_HONEST_DATE"
lastReviewed: "INSERT_HONEST_DATE"
readingTime: 8
isResearch: true
excerpt: >-
  Apply a standard DCF to a bank and the model dissolves in your hands. The
  reason reveals something fundamental about what a bank actually is.
methodologySummary: >-
  This piece explains the conceptual differences in valuing banks, using
  illustrative, rounded figures. It is not a valuation of any specific
  institution. This is analysis for learning, not investment advice.
whereIMightBeWrong: >-
  This piece simplifies: real bank valuation involves fee income (which
  behaves more like a normal business), regulatory capital rules that differ
  by jurisdiction, and cycle effects on credit costs that can dominate
  short-run earnings. The justified P/B formula assumes stable long-run ROE,
  which banking crises routinely violate. The core argument, that
  equity-based methods replace enterprise DCF for lenders, is standard
  practice; the precision of any specific multiple is not.
---

## The moment the standard toolkit breaks

Value a paint company and the process is familiar: forecast revenue, subtract operating costs, deduct investment needs, arrive at free cash flow, discount at a blended cost of capital. Every step assumes a clean separation between the business (operations) and how it is financed (debt and equity).

For a bank, that separation does not exist. Debt is not how a bank finances its business. Debt **is** the business. A bank's core activity is taking money in (deposits, borrowings) at one rate and lending it out at a higher rate. Deposits are its raw material the way crude oil is a refinery's. Interest paid to depositors is not a financing cost to strip out; it is the direct cost of goods sold.

This single fact breaks the standard machinery in three places. The Foundations topic on [sector-specific valuation](/learn/foundations/valuation/sector-specific-valuation) covers the full toolkit; this piece explains why the standard one fails.

## Break one: free cash flow loses its meaning

For a normal company, free cash flow is operating cash minus capital expenditure: cash the business generates that belongs to its capital providers. For a bank, the concept collapses. When a bank grows, it grows by expanding its loan book, and every new loan is cash going out the door. Is that outflow an investment (like capex) or the product itself? It is both, inseparably. When deposits flood in, cash surges, but that cash belongs to depositors, not shareholders.

There is no clean line between operating, investing, and financing flows in a lender, so a free-cash-flow DCF has nothing solid to discount. The standard fix is to value only the cash that can actually reach shareholders, which leads to equity-focused methods.

## Break two: WACC has no denominator to stand on

The weighted average cost of capital blends the cost of debt and equity according to a company's capital structure, assuming that structure is a financing choice. A bank's "capital structure" is overwhelmingly deposits and borrowings, often above 90 percent of the balance sheet, and that is not a choice to optimize; it is the operating model itself, shaped by regulation.

Blending a cost of deposits into a discount rate makes no economic sense when deposits are raw material. So bank valuation discards WACC entirely and discounts at the [cost of equity](/learn/foundations/corporate-finance/cost-of-capital) alone, valuing the shareholders' slice directly rather than the whole enterprise.

## Break three: the balance sheet becomes the income engine

For a paint company, the income statement is the story and the balance sheet is the supporting cast. For a bank, it is reversed. A bank's earnings are generated **by** its balance sheet: assets (loans, investments) earn interest, liabilities (deposits) cost interest, and profit is the spread times the volume. Book value is not an accounting residue; it is the productive capacity of the machine.

This is why bank analysis centers on balance-sheet metrics: net interest margin (the spread earned on assets), asset quality (what fraction of loans will actually be repaid), and capital adequacy (the regulatory equity cushion that determines how large the balance sheet may grow). A bank's reported profit means little until you know whether its loans are sound, because a lender can book years of healthy interest income on loans that will eventually never be repaid. Provisioning judgment, how much is set aside for expected loan losses, gives bank managements more discretion over reported profit than almost any other industry enjoys.

## How banks are actually valued

Two connected methods dominate.

**Price-to-book anchored on ROE.** Since book value is the earnings engine, the natural question is what multiple of book value the equity deserves, and the answer depends on the [return on equity](/learn/foundations/financial-statement-analysis/profitability-ratios) the bank earns on that book. The workhorse relationship:

```
Justified P/B = (ROE − g) ÷ (Cost of equity − g)
```

An illustrative bank earning an ROE of 16 percent, with a cost of equity of 13 percent and long-run growth of 5 percent, justifies a P/B of (0.16 − 0.05) ÷ (0.13 − 0.05) = 0.11 ÷ 0.08, roughly **1.4 times book**. A weaker bank earning only 10 percent, below its cost of equity, justifies (0.10 − 0.05) ÷ (0.13 − 0.05), roughly 0.6 times: less than its book value, because each rupee retained earns below what shareholders require. This is why bank [P/B multiples](/learn/foundations/financial-statement-analysis/market-ratios) spread so widely: the multiple is a direct verdict on whether the bank creates or destroys value with shareholder capital.

**Dividend or residual-income models.** Because only distributable cash matters, analysts also value banks on projected dividends (constrained by regulatory capital needs) or on residual income: profit earned above the cost of the equity employed. Both discount at the cost of equity, and both respect the regulatory reality that a growing bank must retain capital before it can pay anything out.

## The practical takeaway

When you move from valuing an ordinary company to valuing a bank, three substitutions carry most of the work: replace free cash flow with returns on equity and distributable profit, replace WACC with cost of equity, and replace the income statement with the balance sheet as your primary document. And add a question ordinary companies never face this sharply: are the reported assets real? For a lender, asset quality is not one metric among many. It is the difference between a valuation and a fiction.

<!-- Cross-link hooks: price-to-book ratio (linked: market-ratios),
     return on equity (linked: profitability-ratios), cost of equity (linked: cost-of-capital),
     bank valuation (linked: sector-specific-valuation).
     TODO: "net interest margin" and "capital adequacy" have no dedicated Learn pages yet; left as plain text. -->
