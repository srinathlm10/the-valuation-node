import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, ArrowDown, Plus, Minus, Equal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import {
  FINANCIAL_COMPANIES,
  derive,
  fmtCr,
  fmtPct,
  track,
  type FinancialCompany,
} from "@/lib/learnFinancials";

type LineKind = "start" | "cost" | "income" | "subtotal" | "final";

interface PnlLine {
  key: string;
  label: string;
  kind: LineKind;
  value: (c: FinancialCompany) => number;
  explain: (c: FinancialCompany) => string;
}

const LINES: PnlLine[] = [
  {
    key: "revenue",
    label: "Revenue from Operations",
    kind: "start",
    value: (c) => c.revenue,
    explain: (c) =>
      `This is the money ${c.name} earned from its core business, selling goods or services, before any costs are taken out. It is the top of the waterfall, and every line below reduces or adjusts it. Watch for separately disclosed "other operating revenue" which sometimes hides here.`,
  },
  {
    key: "cogs",
    label: "Cost of Materials / Goods Sold",
    kind: "cost",
    value: (c) => c.cogs,
    explain: () =>
      `The direct cost of producing what was sold, raw materials, components, and manufacturing inputs. Subtracting this from revenue gives Gross Profit. A rising COGS as a share of revenue means input-cost pressure or weakening pricing power.`,
  },
  {
    key: "grossProfit",
    label: "Gross Profit",
    kind: "subtotal",
    value: (c) => derive(c).grossProfit,
    explain: () =>
      `Revenue minus direct costs. Gross margin (Gross Profit ÷ Revenue) tells you how much is left to cover everything else, salaries, marketing, R&D, before profit. Higher and stable gross margins usually signal pricing power or a cost advantage.`,
  },
  {
    key: "employeeCost",
    label: "Employee Benefits Expense",
    kind: "cost",
    value: (c) => c.employeeCost,
    explain: (c) =>
      `Salaries, provident fund, gratuity, and ESOP charges. For a services business like an IT company this is the single largest cost; for a manufacturer like ${c.name} it may be smaller than materials. It scales with headcount and wage inflation.`,
  },
  {
    key: "otherExpenses",
    label: "Other Expenses",
    kind: "cost",
    value: (c) => c.otherExpenses,
    explain: () =>
      `A catch-all for selling, distribution, advertising, rent, repairs, power, and admin costs. It's worth scanning the notes, a large or fast-growing "other expenses" line can mask items management would rather not highlight.`,
  },
  {
    key: "ebitda",
    label: "EBITDA",
    kind: "subtotal",
    value: (c) => derive(c).ebitda,
    explain: () =>
      `Earnings Before Interest, Tax, Depreciation & Amortisation. This is a proxy for operating cash profitability, before the effect of financing, accounting depreciation, and taxes. It's not a line item under Ind AS, analysts compute it, but it's one of the most-watched profitability measures.`,
  },
  {
    key: "depreciation",
    label: "Depreciation & Amortisation",
    kind: "cost",
    value: (c) => c.depreciation,
    explain: () =>
      `A non-cash charge that spreads the cost of long-lived assets (plants, machinery, software) over their useful life. No cash leaves the business this year, but it reflects the real economic wearing-out of assets. Capital-heavy businesses carry heavy D&A.`,
  },
  {
    key: "ebit",
    label: "EBIT / Operating Profit",
    kind: "subtotal",
    value: (c) => derive(c).ebit,
    explain: () =>
      `EBITDA minus D&A. This is the profit from running the business, before the cost of debt and before tax. Because it ignores how the company is financed, EBIT lets you compare the operating quality of two companies with very different debt loads.`,
  },
  {
    key: "otherIncome",
    label: "Other Income",
    kind: "income",
    value: (c) => c.otherIncome,
    explain: () =>
      `Income from outside core operations, interest earned on cash, dividends, treasury gains. It's added back here. Be careful: a company whose profit is propped up by large "other income" rather than its actual business deserves a closer look.`,
  },
  {
    key: "financeCosts",
    label: "Finance Costs",
    kind: "cost",
    value: (c) => c.financeCosts,
    explain: () =>
      `Interest paid on borrowings. A heavily indebted company pays a large finance cost, which eats into profit before it reaches shareholders. Comparing EBIT to finance costs (interest coverage) tells you how comfortably the company services its debt.`,
  },
  {
    key: "pbt",
    label: "Profit Before Tax",
    kind: "subtotal",
    value: (c) => derive(c).pbt,
    explain: () =>
      `EBIT plus other income, minus finance costs. This is what's left before the government takes its share. Exceptional one-off items (asset sales, impairments) also sit around here, always strip them out to see normalised earnings.`,
  },
  {
    key: "tax",
    label: "Tax Expense",
    kind: "cost",
    value: (c) => derive(c).tax,
    explain: (c) =>
      `Current tax plus deferred tax. The effective rate here is about ${fmtPct(
        c.taxRate,
        0
      )}. India's headline corporate rate under the new regime is ~25%, but the effective rate varies with deductions, incentives, and deferred-tax movements.`,
  },
  {
    key: "pat",
    label: "Profit After Tax (Net Profit)",
    kind: "final",
    value: (c) => derive(c).pat,
    explain: () =>
      `The bottom line, the profit that belongs to shareholders. Divided by the number of shares, this becomes Earnings Per Share (EPS), the number that drives the P/E ratio. Net margin (PAT ÷ Revenue) is the final measure of how much of each rupee of sales the company keeps.`,
  },
];

const kindStyles: Record<LineKind, { row: string; badge: string; icon: React.ReactNode }> = {
  start: { row: "font-semibold", badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", icon: null },
  cost: { row: "text-muted-foreground", badge: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400", icon: <Minus className="h-3 w-3" /> },
  income: { row: "text-muted-foreground", badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400", icon: <Plus className="h-3 w-3" /> },
  subtotal: { row: "font-medium", badge: "bg-primary/10 text-primary", icon: <Equal className="h-3 w-3" /> },
  final: { row: "font-bold text-primary", badge: "bg-primary text-primary-foreground", icon: <Equal className="h-3 w-3" /> },
};

// A shrinking-bar "margin ladder" for the key subtotals.
function MarginLadder({ company }: { company: FinancialCompany }) {
  const d = derive(company);
  const rows = [
    { label: "Revenue", value: company.revenue, color: "bg-primary/35" },
    { label: "Gross Profit", value: d.grossProfit, color: "bg-primary/50" },
    { label: "EBITDA", value: d.ebitda, color: "bg-primary/65" },
    { label: "EBIT", value: d.ebit, color: "bg-primary/75" },
    { label: "PBT", value: d.pbt, color: "bg-primary/85" },
    { label: "PAT", value: d.pat, color: "bg-primary" },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 text-muted-foreground">{r.label}</span>
          <div className="flex-1 h-6 bg-muted/40 rounded overflow-hidden">
            <div
              className={cn("h-full rounded transition-all", r.color)}
              style={{ width: `${Math.max((r.value / company.revenue) * 100, 6)}%` }}
            />
          </div>
          <span className="w-24 sm:w-36 shrink-0 text-right tabular-nums">
            {fmtCr(r.value)}
            <span className="hidden sm:inline text-muted-foreground"> · {fmtPct(r.value / company.revenue, 0)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function ReadIncomeStatementLesson() {
  const [companySlug, setCompanySlug] = useState(FINANCIAL_COMPANIES[0].slug);
  const [revealed, setRevealed] = useState(1); // number of lines shown
  const completedRef = useRef(false);

  const company = useMemo(
    () => FINANCIAL_COMPANIES.find((c) => c.slug === companySlug) ?? FINANCIAL_COMPANIES[0],
    [companySlug]
  );

  const total = LINES.length;
  const current = LINES[revealed - 1];
  const done = revealed >= total;

  useEffect(() => {
    track("Learn-by-Doing Module Started", { module: "read-an-income-statement" });
  }, []);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      track("Learn-by-Doing Module Completed", { module: "read-an-income-statement" });
    }
  }, [done]);

  const next = useCallback(() => {
    setRevealed((r) => {
      const nr = Math.min(r + 1, total);
      track("Learn-by-Doing Step Completed", { module: "read-an-income-statement", step: nr });
      return nr;
    });
  }, [total]);

  const prev = useCallback(() => setRevealed((r) => Math.max(r - 1, 1)), []);

  const reset = useCallback(() => {
    completedRef.current = false;
    setRevealed(1);
  }, []);

  const changeCompany = useCallback((slug: string) => {
    setCompanySlug(slug);
    setRevealed(1);
    completedRef.current = false;
  }, []);

  return (
    <div className="pb-24 lg:pb-0">
      {/* Company picker + progress */}
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
        <p className="mt-2 text-xs text-muted-foreground">{company.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Line {revealed} of {total}: <span className="text-foreground font-medium">{current.label}</span>
          </p>
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${(revealed / total) * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          {/* The building statement */}
          <div className="rounded-xl border overflow-hidden">
            <div className="px-4 py-3 bg-muted/30 border-b flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{company.name}, Income Statement</h3>
              <span className="text-xs text-muted-foreground">{company.fy} · ₹ Crore</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left font-normal px-4 py-2">Line item</th>
                  <th className="text-right font-normal px-4 py-2">₹ Cr</th>
                  <th className="text-right font-normal px-4 py-2 w-20">% of rev</th>
                </tr>
              </thead>
              <tbody>
                {LINES.slice(0, revealed).map((line, i) => {
                  const s = kindStyles[line.kind];
                  const val = line.value(company);
                  const isCurrent = i === revealed - 1;
                  return (
                    <tr
                      key={line.key}
                      className={cn(
                        "border-b border-border/40 transition-colors",
                        s.row,
                        isCurrent && "bg-primary/10"
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-2">
                          <span className={cn("inline-flex items-center justify-center h-4 w-4 rounded-full", s.badge)}>
                            {s.icon}
                          </span>
                          {line.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{fmtCr(val)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {fmtPct(val / company.revenue, 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation of the current line */}
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/25">
            <p className="text-sm text-foreground">
              <strong>{current.label}:</strong> {current.explain(company)}
            </p>
          </div>

          {/* Margin ladder appears once we reach EBITDA */}
          {revealed >= 6 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">How each rupee of revenue shrinks to profit</p>
              <MarginLadder company={company} />
            </div>
          )}

          {/* Completion recap */}
          {done && (
            <div className="mt-8 space-y-6">
              <div className="p-5 rounded-xl border-2 border-primary/25 bg-primary/5">
                <h3 className="font-semibold">You've read the whole statement.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Of every ₹100 {company.name} earned in revenue, it kept about{" "}
                  <strong className="text-foreground">₹{Math.round(derive(company).netMargin * 100)}</strong> as net
                  profit. The biggest single drag was{" "}
                  <strong className="text-foreground">
                    {company.cogs >= company.employeeCost && company.cogs >= company.otherExpenses
                      ? "cost of materials"
                      : company.employeeCost >= company.otherExpenses
                      ? "employee cost"
                      : "other expenses"}
                  </strong>
                  . That single insight, where the money goes, is what reading a P&L is really about.
                </p>
              </div>

              <div className="p-5 rounded-xl border">
                <h3 className="font-semibold mb-4">Go deeper</h3>
                <div className="space-y-3 text-sm">
                  <Link to="/learn/foundations/accounting/reading-an-income-statement" className="flex items-center gap-2 text-primary hover:underline">
                    <ChevronRight className="h-4 w-4 shrink-0" /> Reading an Income Statement, Foundations
                  </Link>
                  <Link to="/learn/foundations/accounting/quality-of-earnings" className="flex items-center gap-2 text-primary hover:underline">
                    <ChevronRight className="h-4 w-4 shrink-0" /> Quality of Earnings, Foundations
                  </Link>
                  <Link to="/learn/by-doing/compute-ratios" className="flex items-center gap-2 text-primary hover:underline">
                    <ChevronRight className="h-4 w-4 shrink-0" /> Next: Compute Ratios from Raw Statements
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={reset} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" /> Read another company
                </Button>
              </div>

              <NewsletterSignup source="learn-by-doing:read-an-income-statement" />

              <p className="text-xs text-muted-foreground italic">
                Figures are approximate, illustrative {company.fy} numbers for educational use only. Not investment advice.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={prev} disabled={revealed === 1} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            {!done && (
              <Button onClick={next} className="flex items-center gap-1">
                Reveal next line <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 flex items-center justify-between z-30">
        <p className="text-xs text-muted-foreground truncate">
          {company.name} · {current.label}
        </p>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Button size="sm" variant="outline" onClick={prev} disabled={revealed === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {!done && (
            <Button size="sm" onClick={next}>
              Next <ArrowDown className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
