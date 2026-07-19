---
title: "How Terminal Value Quietly Dominates Most Valuations"
slug: "terminal-value-dominates-valuations"
category: "Valuation"
tags: ["DCF", "terminal value", "valuation", "discount rate"]
metaTitle: "How Terminal Value Dominates Your DCF | Valuation Node"
metaDescription: "In most DCF models, the majority of the value sits in the terminal value. Learn why, what that means for reliability, and how to keep your model honest."
author: "Gajji Srinath"
publishDate: "INSERT_HONEST_DATE"
lastReviewed: "INSERT_HONEST_DATE"
readingTime: 7
isResearch: true
excerpt: >-
  You forecast five years carefully, cell by cell. Then one formula, covering
  everything after year five, contributes most of the answer. That formula
  deserves more scrutiny than it usually gets.
methodologySummary: >-
  This piece works through the mechanics of terminal value in a discounted
  cash flow model using illustrative, rounded numbers. It is not a valuation
  of any specific company. This is analysis for learning, not investment
  advice.
whereIMightBeWrong: >-
  This piece uses the Gordon Growth method because it is the most common, but
  exit-multiple approaches to terminal value have different failure modes
  (importing today's market multiples into the future). The 60 to 80 percent
  share quoted is typical for growing companies at ordinary discount rates,
  but it varies: high discount rates or long explicit forecasts shrink the
  terminal share. The core point, that the tail assumptions dominate and
  deserve the most scrutiny, holds across methods.
---

## The uncomfortable arithmetic of a DCF

A [discounted cash flow model](/learn/foundations/valuation/dcf-theory-and-mechanics) has two parts. The explicit forecast period, usually five to ten years, where you project cash flows year by year. And the [terminal value](/learn/foundations/valuation/terminal-value-approaches), a single number meant to capture everything the company earns after the forecast ends, from year six to forever.

The uncomfortable truth: in most DCF models, the terminal value contributes 60 to 80 percent of the total valuation. The five years you modelled carefully are the minority of the answer. The infinite tail you compressed into one formula is the majority.

This is not a flaw in your spreadsheet. It is mathematically inevitable, and understanding why is the first step to handling it honestly.

## Why the tail is so heavy

Companies are long-lived. A healthy business does not stop earning in year five; most of its lifetime cash generation lies beyond any practical forecast horizon. The terminal value is simply the present value of that long tail, and a long tail of growing cash flows is worth a lot, even after discounting.

The standard formula, the Gordon Growth method, values the tail as:

```
Terminal value = FCF in year 6 ÷ (WACC − g)
```

where FCF is free cash flow, [WACC](/learn/foundations/corporate-finance/cost-of-capital) is the discount rate, and g is the perpetual growth rate. The result is then discounted back five years to today.

Notice the denominator: WACC minus g. Two assumptions, subtracted from each other. When two similar-sized numbers are subtracted, small changes in either produce large swings in the result. That single denominator is where most of a DCF's fragility lives.

## A worked illustration of the sensitivity

Take an illustrative company with free cash flow of 100 in year six, a WACC of 12 percent, and perpetual growth of 4 percent.

Terminal value = 100 ÷ (0.12 − 0.04) = 100 ÷ 0.08 = **1,250**

Now nudge the assumptions slightly:

| WACC | g | Denominator | Terminal value | Change |
|---|---|---|---|---|
| 12% | 4% | 8% | 1,250 | baseline |
| 12% | 5% | 7% | 1,429 | +14% |
| 11% | 4% | 7% | 1,429 | +14% |
| 11% | 5% | 6% | 1,667 | +33% |
| 12% | 3% | 9% | 1,111 | −11% |
| 13% | 3% | 10% | 1,000 | −20% |

One percentage point of movement in either assumption swings the terminal value by double digits. Combine a point on each and the swing exceeds 30 percent. Since terminal value is the majority of the total valuation, these tiny assumption changes move the final answer dramatically. An analyst who wants a valuation to reach a particular number can get there quietly, without touching a single forecast cell, just by shading WACC down and g up. Nothing looks manipulated. The forecast rows are untouched. The answer moved anyway.

## The discipline that keeps a model honest

Because the terminal value carries so much weight, it deserves specific sanity checks:

**Check the growth rate against reality.** A perpetual growth rate is forever. No company grows faster than the economy forever, because it would eventually become the economy. So g should not exceed long-run nominal GDP growth, and for most mature businesses it should sit below it. Any model with g above that range is assuming something no company has ever achieved.

**Check the terminal share of value.** Compute terminal value as a percentage of total enterprise value. If it exceeds roughly 75 percent, the model is saying almost all the worth lies beyond anything you actually modelled, which means the valuation is really an assumption dressed as an analysis. Either extend the explicit forecast or hold the conclusion loosely.

**Check the implied exit multiple.** Translate the terminal value into an implied multiple of year-five earnings or EBITDA. If your terminal value implies the company will trade at a multiple far above what mature companies in its industry actually command, the growth assumption is smuggling in optimism the multiple makes visible.

**Always show a sensitivity table.** A single-point DCF output is false precision. A grid of valuations across a range of WACC and g values is the honest presentation, because it shows the reader how much the answer depends on two judgment calls.

## The real lesson

The terminal value is not a technical afterthought at the bottom of a model. It is the model. Treat the perpetual growth rate and the discount rate as the two most consequential assumptions in the entire valuation, defend them explicitly, and present the range rather than the point. A DCF is a tool for structured thinking about value, not a machine that outputs truth, and nowhere is that clearer than in the one formula that quietly decides most of the answer.

<!-- Cross-link hooks: discounted cash flow + free cash flow (linked: dcf-theory-and-mechanics),
     terminal value + perpetuity growth (linked: terminal-value-approaches),
     WACC (linked: cost-of-capital). All targets exist. -->
