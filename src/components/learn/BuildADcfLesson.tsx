import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar,
} from "recharts";
import {
  ChevronLeft, ChevronRight, Download, RotateCcw,
  TrendingUp, TrendingDown, AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { calculateDcf } from "@/lib/dcf";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { LEARN_COMPANIES, type LearnCompany } from "@/lib/learnDcfCompanies";
import { CHART_PRIMARY, CHART_NEUTRAL, CHART_MUTED_FILL, chartTooltipStyle, chartTick } from "@/lib/chartTheme";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCr(n: number): string {
  return `₹${Math.round(Math.abs(n)).toLocaleString("en-IN")} Cr`;
}

function fmtShare(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fmtPct(n: number, dp = 1): string {
  return `${(n * 100).toFixed(dp)}%`;
}

function track(event: string, props?: Record<string, unknown>) {
  if (typeof (window as any).umami !== "undefined") {
    (window as any).umami.track(event, props);
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  "Pick a company",
  "Forecast revenue growth",
  "Set the operating margin",
  "Apply taxes to get NOPAT",
  "Understand free cash flow",
  "Choose the discount rate (WACC)",
  "Add the terminal value",
  "Arrive at value per share",
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  step: number;
  company: LearnCompany;
  revenueGrowth: number;
  operatingMargin: number;
  taxRate: number;
  wacc: number;
  terminalGrowth: number;
  result: ReturnType<typeof calculateDcf>;
}

function ModelSidebar({ step, company, revenueGrowth, operatingMargin, taxRate, wacc, terminalGrowth, result }: SidebarProps) {
  return (
    <div className="sticky top-6">
      <div className="rounded-xl border p-4 bg-muted/20">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Your Model
        </h3>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company</span>
            <span className="font-medium text-right max-w-[130px] truncate">{company.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Revenue</span>
            <span>₹{company.baseRevenue.toLocaleString("en-IN")} Cr</span>
          </div>

          {step >= 2 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue Growth</span>
              <span>{fmtPct(revenueGrowth)}/yr</span>
            </div>
          )}

          {step >= 3 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Op. Margin</span>
              <span>{fmtPct(operatingMargin)}</span>
            </div>
          )}

          {step >= 4 && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax Rate</span>
                <span>{fmtPct(taxRate)}</span>
              </div>
              {result && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NOPAT (Y5)</span>
                  <span>{fmtCr(result.yearlyData[4].nopat)}</span>
                </div>
              )}
            </>
          )}

          {step >= 6 && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WACC</span>
                <span>{fmtPct(wacc)}</span>
              </div>
              {result && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sum PV FCFs</span>
                  <span>{fmtCr(result.sumPvCashFlows)}</span>
                </div>
              )}
            </>
          )}

          {step >= 7 && result && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Terminal Growth</span>
                <span>{fmtPct(terminalGrowth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PV of TV</span>
                <span>{fmtCr(result.pvTerminalValue)}</span>
              </div>
              <div className="border-t pt-2.5 flex justify-between font-medium">
                <span>Enterprise Value</span>
                <span>{fmtCr(result.enterpriseValue)}</span>
              </div>
            </>
          )}

          {step >= 8 && result && (
            <div className="border-t pt-2.5 flex justify-between font-bold text-primary">
              <span>Value / Share</span>
              <span>{fmtShare(result.equityValuePerShare)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function BuildADcfLesson() {
  // ── State ──
  const [step, setStep] = useState(1);
  const [companySlug, setCompanySlug] = useState(LEARN_COMPANIES[0].slug);
  const [revenueGrowth, setRevenueGrowth] = useState(LEARN_COMPANIES[0].cagr3yr);
  const [operatingMargin, setOperatingMargin] = useState(LEARN_COMPANIES[0].historicalMargin);
  const [taxRate, setTaxRate] = useState(0.25);
  const [wacc, setWacc] = useState(0.12);
  const [terminalGrowth, setTerminalGrowth] = useState(0.05);
  const completedRef = useRef(false);

  // ── Derived ──
  const company = useMemo(
    () => LEARN_COMPANIES.find(c => c.slug === companySlug) ?? LEARN_COMPANIES[0],
    [companySlug]
  );

  const result = useMemo(
    () =>
      calculateDcf({
        baseRevenue: company.baseRevenue,
        revenueGrowth,
        operatingMargin,
        taxRate,
        wacc,
        terminalGrowth,
        forecastYears: 5,
        netDebt: company.netDebt,
        sharesOutstanding: company.sharesOutstanding,
      }),
    [company, revenueGrowth, operatingMargin, taxRate, wacc, terminalGrowth]
  );

  // Historical + forecast data for revenue chart; last historical point bridges both lines
  const revenueChartData = useMemo(() => {
    const hist = company.historicalRevenue.map((h, i) => ({
      fy: h.fy,
      historical: h.revenue,
      forecast: i === company.historicalRevenue.length - 1 ? h.revenue : null,
    }));
    const fore = (result?.yearlyData ?? []).map((y, i) => ({
      fy: `Y${i + 1}`,
      historical: null,
      forecast: Math.round(y.revenue),
    }));
    return [...hist, ...fore];
  }, [company, result]);

  // Revenue vs EBIT for margin chart
  const marginChartData = useMemo(
    () =>
      (result?.yearlyData ?? []).map((y, i) => ({
        fy: `Y${i + 1}`,
        revenue: Math.round(y.revenue),
        operatingProfit: Math.round(y.ebit),
      })),
    [result]
  );

  // ── Analytics ──
  useEffect(() => {
    track("Learn-by-Doing Module Started", { module: "build-a-dcf" });
  }, []);

  useEffect(() => {
    if (step === TOTAL_STEPS && !completedRef.current) {
      completedRef.current = true;
      track("Learn-by-Doing Module Completed");
    }
  }, [step]);

  // ── Handlers ──
  const handleCompanyChange = useCallback((slug: string) => {
    const c = LEARN_COMPANIES.find(co => co.slug === slug) ?? LEARN_COMPANIES[0];
    setCompanySlug(slug);
    setRevenueGrowth(c.cagr3yr);
    setOperatingMargin(c.historicalMargin);
  }, []);

  const handleNext = useCallback(() => {
    track("Learn-by-Doing Step Completed", { module: "build-a-dcf", step });
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  }, [step]);

  const handlePrev = useCallback(() => {
    if (step > 1) setStep(s => s - 1);
  }, [step]);

  const handleReset = useCallback(() => {
    const c = LEARN_COMPANIES[0];
    completedRef.current = false;
    setStep(1);
    setCompanySlug(c.slug);
    setRevenueGrowth(c.cagr3yr);
    setOperatingMargin(c.historicalMargin);
    setTaxRate(0.25);
    setWacc(0.12);
    setTerminalGrowth(0.05);
  }, []);

  const handleExport = useCallback(async () => {
    if (!result) return;
    const { utils, writeFile } = await import("xlsx");
    const wb = utils.book_new();

    utils.book_append_sheet(
      wb,
      utils.aoa_to_sheet([
        ["Assumption", "Value"],
        ["Company", company.name],
        ["Ticker", company.ticker],
        ["Base Revenue (₹ Cr)", company.baseRevenue],
        ["Revenue Growth", fmtPct(revenueGrowth)],
        ["Operating Margin", fmtPct(operatingMargin)],
        ["Tax Rate", fmtPct(taxRate)],
        ["WACC", fmtPct(wacc)],
        ["Terminal Growth Rate", fmtPct(terminalGrowth)],
        ["Net Debt (₹ Cr)", company.netDebt],
        ["Shares Outstanding (Cr)", company.sharesOutstanding],
        [],
        ["Note", "Figures are approximate and for educational use only. Not investment advice."],
      ]),
      "Assumptions"
    );

    utils.book_append_sheet(
      wb,
      utils.aoa_to_sheet([
        ["Year", "Revenue (₹ Cr)", "EBIT (₹ Cr)", "NOPAT / FCF (₹ Cr)", "Discount Factor", "PV (₹ Cr)"],
        ...result.yearlyData.map(y => [
          `Year ${y.year}`,
          Math.round(y.revenue),
          Math.round(y.ebit),
          Math.round(y.fcf),
          y.discountFactor.toFixed(4),
          Math.round(y.pv),
        ]),
        [],
        ["Terminal FCF (₹ Cr)", "", Math.round(result.terminalFcf)],
        ["Terminal Value (₹ Cr)", "", Math.round(result.terminalValue)],
        ["PV of Terminal Value (₹ Cr)", "", Math.round(result.pvTerminalValue)],
        [],
        ["Sum of PV FCFs (₹ Cr)", "", Math.round(result.sumPvCashFlows)],
        ["Enterprise Value (₹ Cr)", "", Math.round(result.enterpriseValue)],
        ["Net Debt (₹ Cr)", "", company.netDebt],
        ["Equity Value (₹ Cr)", "", Math.round(result.equityValue)],
        ["Value per Share (₹)", "", Math.round(result.equityValuePerShare)],
      ]),
      "Cash Flows"
    );

    writeFile(wb, `dcf-${company.ticker.toLowerCase()}-learn.xlsx`);
    track("DCF Model Downloaded", { source: "learn-by-doing" });
  }, [result, company, revenueGrowth, operatingMargin, taxRate, wacc, terminalGrowth]);

  // ── Step content ──────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      // ── Step 1: Pick a company ────────────────────────────────────────────
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold">What is a DCF?</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              A Discounted Cash Flow (DCF) model estimates what a company is worth today based on the cash it will generate in the future. The core idea: a rupee today is worth more than a rupee tomorrow, because you can invest today's rupee and earn a return.
            </p>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We forecast how much cash the business will produce over the next five years, then add an estimate for all future cash flows beyond that (the "terminal value"), and discount everything back to today's value. The result is what the business should be worth right now.
            </p>
            <p className="mt-2 text-muted-foreground">
              In the next 7 steps, you'll build this model one assumption at a time.
            </p>

            <div className="mt-5 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700 dark:text-amber-300">
              Figures shown are approximate, publicly available data used for educational purposes only. They are not investment recommendations.
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium block mb-2">Choose a company to value</label>
              <select
                value={companySlug}
                onChange={e => handleCompanyChange(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {LEARN_COMPANIES.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.ticker}) - {c.sector}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 p-5 rounded-xl border">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-semibold text-lg">{company.name}</p>
                <span className="text-xs text-muted-foreground shrink-0">{company.ticker}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 mb-3">{company.sector}</p>
              <p className="text-sm text-muted-foreground">{company.description}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Historical revenue (₹ Cr)</p>
              <ResponsiveContainer width="100%" height={200} className="text-muted-foreground">
                <BarChart data={company.historicalRevenue} barSize={48}>
                  <XAxis dataKey="fy" tick={{ ...chartTick, fontSize: 12 }} />
                  <YAxis
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    tick={chartTick}
                    width={52}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [fmtCr(v), "Revenue"]} />
                  <Bar dataKey="revenue" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/25">
              <p className="text-sm text-primary">
                <strong>Why this matters:</strong> The base revenue is our starting point. Every cash flow we forecast builds from this number. The historical trend also tells us whether the business has been growing steadily or erratically - context you'll use when you set the growth rate in the next step.
              </p>
            </div>
          </div>
        );

      // ── Step 2: Revenue growth ────────────────────────────────────────────
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold">Forecasting Revenue Growth</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              How fast will {company.name} grow over the next five years? Analysts look at historical CAGR, industry trends, competitive dynamics, capacity expansion, and management guidance. Past growth is a useful anchor, not a guarantee. High past growth often reverts towards the industry average over time.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border text-center">
                <p className="text-xs text-muted-foreground">3-Year Revenue CAGR</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{fmtPct(company.cagr3yr)}</p>
              </div>
              <div className="p-4 rounded-xl border text-center">
                <p className="text-xs text-muted-foreground">5-Year Revenue CAGR</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{fmtPct(company.cagr5yr)}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Your revenue growth forecast</label>
                <span className="text-xl font-bold text-primary">{fmtPct(revenueGrowth)}</span>
              </div>
              <Slider
                min={0}
                max={0.4}
                step={0.01}
                value={[revenueGrowth]}
                onValueChange={([v]) => setRevenueGrowth(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>40%</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Revenue projection vs history (₹ Cr)</p>
              <ResponsiveContainer width="100%" height={230} className="text-muted-foreground">
                <LineChart data={revenueChartData}>
                  <XAxis dataKey="fy" tick={chartTick} />
                  <YAxis
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    tick={chartTick}
                    width={52}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [fmtCr(v), ""]} />
                  <Legend
                    formatter={v => (v === "historical" ? "Historical" : "Forecast")}
                  />
                  <Line
                    dataKey="historical"
                    stroke={CHART_NEUTRAL}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                    name="historical"
                  />
                  <Line
                    dataKey="forecast"
                    stroke={CHART_PRIMARY}
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ r: 4 }}
                    connectNulls={false}
                    name="forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Why this matters:</strong> A 2–3% change in revenue growth can swing the final valuation by 20–30%. This is the single most sensitive input in a DCF. Analysts spend most of their research time getting the growth assumption right, because it cascades through every line below it.
              </p>
            </div>
          </div>
        );

      // ── Step 3: Operating margin ──────────────────────────────────────────
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold">Setting the Operating Margin</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Operating margin is EBIT (earnings before interest and tax) as a percentage of revenue. It tells you how much of every rupee of revenue the company keeps as operating profit. {company.name} earned an operating margin of approximately {fmtPct(company.historicalMargin)} in its latest year.
            </p>
            <p className="mt-2 text-muted-foreground">
              Will the margin expand, contract, or stay flat? Expanding margins (improving cost efficiency, pricing power, or operating leverage) add significant value. Shrinking margins are a red flag.
            </p>

            <div className="mt-5 p-4 rounded-xl border">
              <p className="text-xs text-muted-foreground">Historical operating margin ({company.historicalRevenue.at(-1)?.fy})</p>
              <p className="text-3xl font-bold mt-1">{fmtPct(company.historicalMargin)}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Your margin assumption</label>
                <span className="text-xl font-bold text-primary">{fmtPct(operatingMargin)}</span>
              </div>
              <Slider
                min={0.02}
                max={0.5}
                step={0.005}
                value={[operatingMargin]}
                onValueChange={([v]) => setOperatingMargin(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Revenue vs Operating Profit - Forecast (₹ Cr)</p>
              <ResponsiveContainer width="100%" height={230} className="text-muted-foreground">
                <BarChart data={marginChartData} barGap={4}>
                  <XAxis dataKey="fy" tick={chartTick} />
                  <YAxis
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                    tick={chartTick}
                    width={52}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [fmtCr(v), ""]} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill={CHART_MUTED_FILL} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="operatingProfit" name="Operating Profit (EBIT)" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/25">
              <p className="text-sm text-primary">
                <strong>Why this matters:</strong> Margin expansion is where value gets created. A business growing at 15% with expanding margins is worth far more than one growing at 15% with shrinking margins. This is why analysts track quarterly EBIT margins so closely.
              </p>
            </div>
          </div>
        );

      // ── Step 4: Tax → NOPAT ───────────────────────────────────────────────
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold">Applying Taxes to Get NOPAT</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              NOPAT stands for Net Operating Profit After Tax. We take EBIT and subtract corporate taxes. This is the after-tax operating profit available to all capital providers: both debt holders and shareholders.
            </p>
            <div className="mt-3 p-3 bg-muted/30 rounded-lg font-mono text-sm">
              NOPAT = EBIT × (1 − Tax Rate)
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              India's standard corporate tax rate is 25% for companies under the new regime (22% + surcharge ≈ 25.17%). Most large listed companies pay an effective rate of 22–27%.
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Effective tax rate</label>
                <span className="text-xl font-bold text-primary">{fmtPct(taxRate)}</span>
              </div>
              <Slider
                min={0.1}
                max={0.4}
                step={0.01}
                value={[taxRate]}
                onValueChange={([v]) => setTaxRate(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10%</span>
                <span>40%</span>
              </div>
            </div>

            {result && (
              <div className="mt-6 overflow-x-auto">
                <p className="text-sm font-medium mb-3">EBIT → NOPAT (₹ Cr)</p>
                <table className="text-sm w-full text-right">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs">
                      <th className="text-left pb-2 font-normal">Line item</th>
                      {result.yearlyData.map(y => (
                        <th key={y.year} className="pb-2 pl-4 font-normal">Y{y.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">Revenue</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4">{fmtCr(y.revenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">EBIT</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4">{fmtCr(y.ebit)}</td>
                      ))}
                    </tr>
                    <tr className="font-medium">
                      <td className="text-left py-2">NOPAT</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4 text-primary">
                          {fmtCr(y.nopat)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/25">
              <p className="text-sm text-primary">
                <strong>Why this matters:</strong> By using NOPAT rather than net profit, we strip out the effect of how the company is financed (how much debt it uses). This lets us value the business itself, independent of its capital structure. We add the financing effect back at the end by subtracting net debt from enterprise value.
              </p>
            </div>
          </div>
        );

      // ── Step 5: Free cash flow ────────────────────────────────────────────
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold">From NOPAT to Free Cash Flow</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Accounting profit can be manipulated. Cash cannot. What really matters for valuation is not how much profit a company reports, but how much cash it actually generates after running the business and reinvesting what's needed to keep growing.
            </p>
            <p className="mt-3 text-muted-foreground">The full formula for free cash flow (FCF) is:</p>
            <div className="mt-2 p-3 bg-muted/30 rounded-lg font-mono text-sm">
              FCF = NOPAT + D&A − CapEx − ΔNWC
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              <strong>For this educational model, FCF ≈ NOPAT.</strong> This assumes depreciation roughly offsets maintenance capex, and working capital stays stable as a share of revenue. In a full model, you'd research each of these explicitly: CapEx guidance, historical D&A, and working capital trends from cash flow statements.
            </p>

            {result && (
              <div className="mt-6 overflow-x-auto">
                <p className="text-sm font-medium mb-3">Your complete cash flow forecast (₹ Cr)</p>
                <table className="text-sm w-full text-right">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs">
                      <th className="text-left pb-2 font-normal">Line item</th>
                      {result.yearlyData.map(y => (
                        <th key={y.year} className="pb-2 pl-4 font-normal">Y{y.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">Revenue</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4">{fmtCr(y.revenue)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">
                        EBIT ({fmtPct(operatingMargin)} margin)
                      </td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4">{fmtCr(y.ebit)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">
                        NOPAT (after {fmtPct(taxRate)} tax)
                      </td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4">{fmtCr(y.nopat)}</td>
                      ))}
                    </tr>
                    <tr className="font-medium">
                      <td className="text-left py-2">Free Cash Flow</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4 text-primary">
                          {fmtCr(y.fcf)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Why this matters:</strong> The gap between profit and cash is where many accounting irregularities hide. A company reporting high profits but generating little cash is a warning sign. When you read annual reports, always compare PAT to operating cash flow. If they consistently diverge, investigate why.
              </p>
            </div>
          </div>
        );

      // ── Step 6: WACC ──────────────────────────────────────────────────────
      case 6:
        return (
          <div>
            <h2 className="text-xl font-bold">Choosing the Discount Rate (WACC)</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              ₹100 received five years from now is worth less than ₹100 today, because you could invest today's ₹100 and earn a return. The discount rate, called WACC (Weighted Average Cost of Capital), is the rate we use to shrink future cash flows back to their present value.
            </p>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              WACC reflects the blended required return for all capital providers: equity holders (who take more risk) and debt holders (who get priority). A riskier business deserves a higher WACC. Its future cash should be discounted more steeply.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground">Low risk (FMCG, utilities)</p>
                <p className="font-bold mt-1">9–11%</p>
              </div>
              <div className="p-3 rounded-lg border border-primary/25 bg-primary/5">
                <p className="text-xs text-muted-foreground">Medium risk (industrials)</p>
                <p className="font-bold mt-1">11–13%</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground">Higher risk (cyclicals)</p>
                <p className="font-bold mt-1">13–16%</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Your WACC</label>
                <span className="text-xl font-bold text-primary">{fmtPct(wacc)}</span>
              </div>
              <Slider
                min={0.06}
                max={0.2}
                step={0.005}
                value={[wacc]}
                onValueChange={([v]) => setWacc(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>6%</span>
                <span>20%</span>
              </div>
            </div>

            {wacc <= terminalGrowth + 0.02 && (
              <div className="mt-4 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your WACC is close to the terminal growth rate you'll set in Step 7. The Gordon Growth formula breaks down when WACC approaches TGR. Keep at least 3–4% gap.
                </p>
              </div>
            )}

            {result && (
              <div className="mt-6 overflow-x-auto">
                <p className="text-sm font-medium mb-3">Discounting cash flows to present value (₹ Cr)</p>
                <table className="text-sm w-full text-right">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs">
                      <th className="text-left pb-2 font-normal">Line item</th>
                      {result.yearlyData.map(y => (
                        <th key={y.year} className="pb-2 pl-4 font-normal">Y{y.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">FCF</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4">{fmtCr(y.fcf)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-left py-2 text-muted-foreground">Discount factor</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4 text-muted-foreground">
                          {y.discountFactor.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                    <tr className="font-medium">
                      <td className="text-left py-2">Present Value</td>
                      {result.yearlyData.map(y => (
                        <td key={y.year} className="py-2 pl-4 text-primary">
                          {fmtCr(y.pv)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 text-right text-sm">
                  <span className="text-muted-foreground">Sum of PV FCFs: </span>
                  <span className="font-semibold">{fmtCr(result.sumPvCashFlows)}</span>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/25">
              <p className="text-sm text-primary">
                <strong>Why this matters:</strong> The discount rate is brutally powerful. Dropping WACC from 13% to 11% on the same set of cash flows can raise the valuation by 30–40%. This is why interest rate cuts are bullish for equities: lower rates mean lower discount rates, which mechanically lifts all DCF valuations.
              </p>
            </div>
          </div>
        );

      // ── Step 7: Terminal value ────────────────────────────────────────────
      case 7: {
        const tgWarning = terminalGrowth >= wacc - 0.02;
        return (
          <div>
            <h2 className="text-xl font-bold">Adding the Terminal Value</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We can only forecast in detail for 5 years. But businesses don't stop generating cash after Year 5. The terminal value (TV) captures all cash flows from Year 6 onwards, modelled as a perpetuity growing at a constant terminal growth rate (TGR). We use the Gordon Growth Model:
            </p>
            <div className="mt-3 p-3 bg-muted/30 rounded-lg font-mono text-sm">
              TV = FCF₅ × (1 + TGR) / (WACC − TGR)
            </div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The TGR must be conservative, roughly equal to India's long-term nominal GDP growth rate or slightly below. Most analysts use 4–6% for established Indian companies. Using a higher TGR is aggressive and inflates the terminal value dramatically.
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Terminal growth rate</label>
                <span className="text-xl font-bold text-primary">{fmtPct(terminalGrowth)}</span>
              </div>
              <Slider
                min={0.02}
                max={0.08}
                step={0.005}
                value={[terminalGrowth]}
                onValueChange={([v]) => setTerminalGrowth(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2%</span>
                <span>8%</span>
              </div>
            </div>

            {tgWarning && (
              <div className="mt-4 p-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Terminal growth ({fmtPct(terminalGrowth)}) is too close to WACC ({fmtPct(wacc)}). The Gordon Growth formula requires WACC to be meaningfully higher than TGR. Reduce the TGR or go back to Step 6 and raise your WACC.
                </p>
              </div>
            )}

            {result && !tgWarning && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border text-center">
                    <p className="text-xs text-muted-foreground">PV of 5-year FCFs</p>
                    <p className="text-lg font-bold mt-1">{fmtCr(result.sumPvCashFlows)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fmtPct(1 - result.terminalValuePct)} of EV
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border text-center">
                    <p className="text-xs text-muted-foreground">PV of Terminal Value</p>
                    <p className="text-lg font-bold mt-1">{fmtCr(result.pvTerminalValue)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fmtPct(result.terminalValuePct)} of EV
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Enterprise value breakdown</p>
                  <div className="h-8 rounded-full overflow-hidden flex text-xs font-medium">
                    <div
                      className="bg-primary h-full flex items-center justify-center text-white"
                      style={{ width: `${(1 - result.terminalValuePct) * 100}%` }}
                    >
                      FCFs {fmtPct(1 - result.terminalValuePct, 0)}
                    </div>
                    <div
                      className="bg-slate-400 h-full flex items-center justify-center text-white"
                      style={{ width: `${result.terminalValuePct * 100}%` }}
                    >
                      TV {fmtPct(result.terminalValuePct, 0)}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <span className="text-muted-foreground">Enterprise Value: </span>
                  <span className="font-semibold">{fmtCr(result.enterpriseValue)}</span>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Why this matters:</strong> In most DCF models, the terminal value accounts for 60–80% of total enterprise value. This means the 5-year forecast period matters less than the terminal assumptions. It's a reminder that DCF valuations are far more sensitive to TGR and WACC than to near-term revenue projections.
              </p>
            </div>
          </div>
        );
      }

      // ── Step 8: Value per share ───────────────────────────────────────────
      case 8: {
        const upside =
          result && company.currentPrice > 0
            ? (result.equityValuePerShare - company.currentPrice) / company.currentPrice
            : null;

        return (
          <div>
            <h2 className="text-xl font-bold">Arriving at Value per Share</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Enterprise Value is what the entire business is worth to all capital providers. To get to equity value (what belongs to shareholders), we subtract net debt. Dividing by shares outstanding gives us value per share.
            </p>
            <div className="mt-3 p-3 bg-muted/30 rounded-lg font-mono text-sm leading-relaxed">
              Equity Value = Enterprise Value − Net Debt<br />
              Value per Share = Equity Value ÷ Shares Outstanding
            </div>

            {result ? (
              <>
                <div className="mt-6 p-6 rounded-xl border-2 border-primary/25 bg-primary/5 text-center">
                  <p className="text-sm text-muted-foreground">Your DCF value per share</p>
                  <p className="text-5xl font-bold text-primary mt-2">
                    {fmtShare(result.equityValuePerShare)}
                  </p>
                  {company.currentPrice > 0 && upside !== null && (
                    <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">
                        vs. ~{fmtShare(company.currentPrice)} market price (illustrative)
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-sm font-medium",
                          upside >= 0 ? "text-emerald-600" : "text-red-500"
                        )}
                      >
                        {upside >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {upside >= 0 ? "+" : ""}
                        {fmtPct(upside)} implied {upside >= 0 ? "upside" : "downside"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-3">Your assumptions</h3>
                  <div className="divide-y text-sm">
                    {[
                      ["Company", `${company.name} (${company.ticker})`],
                      ["Revenue Growth", `${fmtPct(revenueGrowth)}/yr for 5 years`],
                      ["Operating Margin", fmtPct(operatingMargin)],
                      ["Tax Rate", fmtPct(taxRate)],
                      ["WACC", fmtPct(wacc)],
                      ["Terminal Growth Rate", fmtPct(terminalGrowth)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2">
                        <span className="text-muted-foreground">{label}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 font-medium">
                      <span>Enterprise Value</span>
                      <span>{fmtCr(result.enterpriseValue)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-medium">
                      <span>Net Debt</span>
                      <span>
                        {company.netDebt < 0
                          ? `(${fmtCr(-company.netDebt)} net cash)`
                          : fmtCr(company.netDebt)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 font-bold text-primary">
                      <span>Equity Value per Share</span>
                      <span>{fmtShare(result.equityValuePerShare)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleExport} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download your model (Excel)
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try with another company
                  </Button>
                </div>

                <div className="mt-8 p-5 rounded-xl border">
                  <h3 className="font-semibold mb-4">Go deeper</h3>
                  <div className="space-y-3 text-sm">
                    <Link
                      to="/learn/foundations/valuation/dcf-theory-and-mechanics"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ChevronRight className="h-4 w-4 shrink-0" />
                      DCF Theory and Mechanics - Foundations
                    </Link>
                    <Link
                      to="/learn/foundations/valuation/common-dcf-mistakes"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ChevronRight className="h-4 w-4 shrink-0" />
                      Common DCF Mistakes - Foundations
                    </Link>
                    <Link
                      to="/tools/dcf-sensitivity"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ChevronRight className="h-4 w-4 shrink-0" />
                      DCF Sensitivity Calculator - run scenarios across WACC and TGR
                    </Link>
                    <Link
                      to="/research"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ChevronRight className="h-4 w-4 shrink-0" />
                      Research - see DCF used in real company analysis
                    </Link>
                  </div>
                </div>

                <div className="mt-8">
                  <NewsletterSignup source="learn-by-doing:build-a-dcf" />
                </div>

                <p className="mt-6 text-xs text-muted-foreground italic">
                  This model is for educational purposes only. Company data shown is approximate and may not reflect current figures. Nothing here is investment advice.
                </p>
              </>
            ) : (
              <div className="mt-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20">
                <p className="text-sm text-red-700 dark:text-red-300">
                  Your WACC ({fmtPct(wacc)}) is at or below your terminal growth rate ({fmtPct(terminalGrowth)}). The Gordon Growth formula cannot compute a valid terminal value. Go back to Step 6 or Step 7 to fix this.
                </p>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  }

  // ── Layout ────────────────────────────────────────────────────────────────

  const sidebarProps: SidebarProps = {
    step, company, revenueGrowth, operatingMargin, taxRate, wacc, terminalGrowth, result,
  };

  // Mobile sticky bar shows key summary
  const mobileSummary = step >= 8 && result
    ? `Value/Share: ${fmtShare(result.equityValuePerShare)}`
    : step >= 2
    ? `${company.name} · ${fmtPct(revenueGrowth)} growth`
    : company.name;

  return (
    <div className="pb-24 lg:pb-0">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Step {step} of {TOTAL_STEPS}: <span className="text-foreground font-medium">{STEP_TITLES[step - 1]}</span>
          </p>
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-8 items-start">
        {/* Step content */}
        <div className="flex-1 min-w-0">
          {renderStep()}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {step < TOTAL_STEPS && (
              <Button onClick={handleNext} className="flex items-center gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar, desktop only */}
        <aside className="hidden lg:block w-68 shrink-0" style={{ width: "17rem" }}>
          <ModelSidebar {...sidebarProps} />
        </aside>
      </div>

      {/* Mobile sticky summary bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 flex items-center justify-between z-30">
        <p className="text-xs text-muted-foreground truncate">{mobileSummary}</p>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {step < TOTAL_STEPS && (
            <Button size="sm" onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
