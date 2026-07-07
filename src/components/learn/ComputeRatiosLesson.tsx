import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import {
  FINANCIAL_COMPANIES,
  derive,
  fmtCr,
  track,
  type FinancialCompany,
  type DerivedFinancials,
} from "@/lib/learnFinancials";

type Unit = "%" | "x" | "days";

interface RatioChallenge {
  key: string;
  category: string;
  name: string;
  formula: string;
  unit: Unit;
  // operands to show the learner
  operands: (c: FinancialCompany, d: DerivedFinancials) => { label: string; value: number }[];
  // the true answer expressed in the display unit (e.g. 18.2 for 18.2%)
  answer: (c: FinancialCompany, d: DerivedFinancials) => number;
  interpret: (c: FinancialCompany, d: DerivedFinancials) => string;
}

const CHALLENGES: RatioChallenge[] = [
  {
    key: "net-margin",
    category: "Profitability",
    name: "Net Profit Margin",
    formula: "Net Profit ÷ Revenue × 100",
    unit: "%",
    operands: (c, d) => [
      { label: "Net Profit (PAT)", value: d.pat },
      { label: "Revenue", value: c.revenue },
    ],
    answer: (_c, d) => d.netMargin * 100,
    interpret: (c, d) =>
      `${c.name} keeps about ₹${Math.round(d.netMargin * 100)} of every ₹100 of sales as profit. Net margin varies hugely by sector, thin for autos and retail, fat for software and branded consumer goods, so always compare within an industry.`,
  },
  {
    key: "roe",
    category: "Profitability",
    name: "Return on Equity (ROE)",
    formula: "Net Profit ÷ Shareholders' Equity × 100",
    unit: "%",
    operands: (_c, d) => [
      { label: "Net Profit (PAT)", value: d.pat },
      { label: "Shareholders' Equity", value: (_c as FinancialCompany).equity },
    ],
    answer: (_c, d) => d.roe * 100,
    interpret: (c, d) =>
      `ROE measures how much profit ${c.name} generates on each rupee shareholders have invested. At ~${Math.round(
        d.roe * 100
      )}%, this is ${d.roe > 0.2 ? "strong" : d.roe > 0.12 ? "reasonable" : "modest"}. But watch out, ROE can be inflated by high leverage, which is why the DuPont breakdown exists.`,
  },
  {
    key: "current-ratio",
    category: "Liquidity",
    name: "Current Ratio",
    formula: "Current Assets ÷ Current Liabilities",
    unit: "x",
    operands: (c) => [
      { label: "Current Assets", value: c.currentAssets },
      { label: "Current Liabilities", value: c.currentLiabilities },
    ],
    answer: (_c, d) => d.currentRatio,
    interpret: (c, d) =>
      `A current ratio of ${d.currentRatio.toFixed(1)}× means ${c.name} has ₹${d.currentRatio.toFixed(
        1
      )} of short-term assets for every ₹1 of short-term dues. Below 1.0× can signal liquidity stress; far above 2.0× may mean idle working capital. Context matters, negative-working-capital retailers thrive below 1.0×.`,
  },
  {
    key: "debt-equity",
    category: "Solvency",
    name: "Debt-to-Equity",
    formula: "Total Debt ÷ Shareholders' Equity",
    unit: "x",
    operands: (c) => [
      { label: "Total Debt", value: c.totalDebt },
      { label: "Shareholders' Equity", value: c.equity },
    ],
    answer: (_c, d) => d.debtToEquity,
    interpret: (c, d) =>
      `At ${d.debtToEquity.toFixed(2)}×, ${c.name} is ${
        d.debtToEquity < 0.3 ? "very lightly geared" : d.debtToEquity < 1 ? "moderately geared" : "heavily geared"
      }. Debt amplifies returns in good times and losses in bad times. Acceptable leverage depends on how stable and predictable the company's cash flows are.`,
  },
  {
    key: "interest-coverage",
    category: "Solvency",
    name: "Interest Coverage",
    formula: "EBIT ÷ Finance Costs",
    unit: "x",
    operands: (c, d) => [
      { label: "EBIT (Operating Profit)", value: d.ebit },
      { label: "Finance Costs", value: c.financeCosts },
    ],
    answer: (_c, d) => d.interestCoverage,
    interpret: (c, d) =>
      `Interest coverage shows how many times over ${c.name}'s operating profit covers its interest bill, here about ${d.interestCoverage.toFixed(
        0
      )}×. Below ~2–3× is a warning sign: a small dip in profit could leave the company unable to service its debt.`,
  },
  {
    key: "receivable-days",
    category: "Efficiency",
    name: "Receivable Days",
    formula: "Receivables ÷ Revenue × 365",
    unit: "days",
    operands: (c) => [
      { label: "Trade Receivables", value: c.receivables },
      { label: "Revenue", value: c.revenue },
    ],
    answer: (_c, d) => d.receivableDays,
    interpret: (c, d) =>
      `On average ${c.name} collects cash from customers in about ${Math.round(
        d.receivableDays
      )} days. Rising receivable days, especially faster than revenue, is a classic early warning that sales are being "bought" with generous credit, or that customers are struggling to pay.`,
  },
];

function tolerance(unit: Unit, answer: number): number {
  // generous but meaningful: ~4% relative, with a small absolute floor per unit
  const rel = Math.abs(answer) * 0.04;
  const floor = unit === "days" ? 3 : unit === "%" ? 0.4 : 0.05;
  return Math.max(rel, floor);
}

function unitLabel(unit: Unit): string {
  return unit === "%" ? "%" : unit === "x" ? "×" : "days";
}

export function ComputeRatiosLesson() {
  const [companySlug, setCompanySlug] = useState(FINANCIAL_COMPANIES[0].slug);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, "correct" | "close" | "wrong">>({});
  const completedRef = useRef(false);

  const company = useMemo(
    () => FINANCIAL_COMPANIES.find((c) => c.slug === companySlug) ?? FINANCIAL_COMPANIES[0],
    [companySlug]
  );
  const d = useMemo(() => derive(company), [company]);

  const total = CHALLENGES.length;
  const challenge = CHALLENGES[idx];
  const answer = challenge.answer(company, d);
  const done = Object.keys(results).length === total && checked && idx === total - 1;
  const score = Object.values(results).filter((r) => r === "correct" || r === "close").length;

  useEffect(() => {
    track("Learn-by-Doing Module Started", { module: "compute-ratios" });
  }, []);

  const resetChallengeState = () => {
    setInput("");
    setChecked(false);
  };

  const changeCompany = useCallback((slug: string) => {
    setCompanySlug(slug);
    setIdx(0);
    setResults({});
    resetChallengeState();
    completedRef.current = false;
  }, []);

  const check = useCallback(() => {
    const entered = parseFloat(input);
    if (isNaN(entered)) return;
    const tol = tolerance(challenge.unit, answer);
    let verdict: "correct" | "close" | "wrong";
    if (Math.abs(entered - answer) <= tol) verdict = "correct";
    else if (Math.abs(entered - answer) <= tol * 2.5) verdict = "close";
    else verdict = "wrong";
    setChecked(true);
    setResults((r) => ({ ...r, [challenge.key]: verdict }));
    track("Learn-by-Doing Step Completed", { module: "compute-ratios", step: idx + 1, verdict });
  }, [input, answer, challenge, idx]);

  const next = useCallback(() => {
    if (idx < total - 1) {
      setIdx((i) => i + 1);
      resetChallengeState();
    }
  }, [idx, total]);

  const prev = useCallback(() => {
    if (idx > 0) {
      setIdx((i) => i - 1);
      resetChallengeState();
    }
  }, [idx]);

  const restart = useCallback(() => {
    setIdx(0);
    setResults({});
    resetChallengeState();
    completedRef.current = false;
  }, []);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      track("Learn-by-Doing Module Completed", { module: "compute-ratios", score, total });
    }
  }, [done, score, total]);

  const verdict = results[challenge.key];

  return (
    <div className="pb-24 lg:pb-0">
      {/* Company + progress */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Company</label>
        <select
          value={companySlug}
          onChange={(e) => changeCompany(e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {FINANCIAL_COMPANIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.ticker}), {c.sector}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Ratio {idx + 1} of {total}: <span className="text-foreground font-medium">{challenge.name}</span>
          </p>
          <span className="text-xs text-muted-foreground">
            Score: <span className="font-medium text-foreground">{score}</span>/{Object.keys(results).length}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300 rounded-full" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{challenge.category}</span>
          <h2 className="mt-1 text-xl font-bold">{challenge.name}</h2>

          {/* Formula */}
          <div className="mt-4 p-3 bg-muted/40 rounded-lg font-mono text-sm text-center">
            {challenge.name} = {challenge.formula}
          </div>

          {/* Given numbers */}
          <div className="mt-5">
            <p className="text-sm font-medium mb-2">Pull these from {company.name}'s {company.fy} statements:</p>
            <div className="rounded-lg border divide-y">
              {challenge.operands(company, d).map((op) => (
                <div key={op.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{op.label}</span>
                  <span className="font-medium tabular-nums">{fmtCr(op.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Your answer */}
          <div className="mt-6">
            <label className="text-sm font-medium block mb-2">Your answer</label>
            <div className="flex items-stretch gap-2">
              <div className="flex items-center flex-1 border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-ring">
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={input}
                  disabled={checked}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !checked && input !== "") check();
                  }}
                  placeholder="Type your computed value"
                  className="flex-1 py-2.5 bg-transparent outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-muted-foreground pl-2 select-none">{unitLabel(challenge.unit)}</span>
              </div>
              {!checked ? (
                <Button onClick={check} disabled={input === ""}>
                  Check
                </Button>
              ) : (
                idx < total - 1 && (
                  <Button onClick={next} className="flex items-center gap-1">
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Feedback */}
          {checked && (
            <div
              className={cn(
                "mt-4 p-4 rounded-lg border",
                verdict === "correct"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                  : verdict === "close"
                  ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
              )}
            >
              <div className="flex items-center gap-2 font-medium text-sm">
                {verdict === "wrong" ? <X className="h-4 w-4 text-red-500" /> : <Check className="h-4 w-4 text-emerald-500" />}
                {verdict === "correct" ? "Correct!" : verdict === "close" ? "Close enough, well done." : "Not quite."}
                <span className="ml-auto text-muted-foreground font-normal">
                  Actual: {challenge.unit === "days" ? Math.round(answer) : answer.toFixed(challenge.unit === "%" ? 1 : 2)}
                  {unitLabel(challenge.unit)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{challenge.interpret(company, d)}</p>
            </div>
          )}

          {/* Completion */}
          {done && (
            <div className="mt-8 space-y-6">
              <div className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 text-center">
                <p className="text-sm text-muted-foreground">You computed</p>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                  {score}/{total}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {score === total
                    ? "Perfect, you can pull ratios straight from raw statements."
                    : score >= total - 2
                    ? "Strong work. Revisit the ones you missed and try another company."
                    : "Good start. Try the same ratios on a different company to lock it in."}
                </p>
              </div>

              <div className="p-5 rounded-xl border">
                <h3 className="font-semibold mb-4">Go deeper</h3>
                <div className="space-y-3 text-sm">
                  <Link to="/learn/foundations/financial-statement-analysis/profitability-ratios" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <ChevronRight className="h-4 w-4 shrink-0" /> Profitability Ratios, Foundations
                  </Link>
                  <Link to="/learn/foundations/financial-statement-analysis/dupont-decomposition" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <ChevronRight className="h-4 w-4 shrink-0" /> DuPont Decomposition, Foundations
                  </Link>
                  <Link to="/learn/by-doing/compare-two-companies" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <ChevronRight className="h-4 w-4 shrink-0" /> Next: Compare Two Companies Side by Side
                  </Link>
                </div>
              </div>

              <Button variant="outline" onClick={restart} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" /> Try again with another company
              </Button>

              <NewsletterSignup source="learn-by-doing:compute-ratios" />

              <p className="text-xs text-muted-foreground italic">
                Figures are approximate, illustrative {company.fy} numbers for educational use only. Not investment advice.
              </p>
            </div>
          )}

          {!checked && (
            <div className="mt-6 p-3 rounded-lg border border-dashed flex items-start gap-2 text-xs text-muted-foreground">
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
              Compute it yourself before checking, that's the whole point. A calculator is fine; the goal is knowing which numbers to combine.
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={prev} disabled={idx === 0} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 flex items-center justify-between z-30">
        <p className="text-xs text-muted-foreground truncate">
          {challenge.name} · {idx + 1}/{total}
        </p>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {!checked ? (
            <Button size="sm" onClick={check} disabled={input === ""}>
              Check
            </Button>
          ) : (
            idx < total - 1 && (
              <Button size="sm" onClick={next}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
