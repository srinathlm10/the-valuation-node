import { useState, useMemo, useCallback } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { RotateCcw, Download, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  calculateDcf,
  calculateSensitivity,
  TG_DELTAS,
  WACC_DELTAS,
  type DcfInputs,
  type DcfResult,
} from "@/lib/dcf";

// ── Formatting ────────────────────────────────────────────────────────────────

function fmtCr(n: number): string {
  if (!isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
}

function fmtShare(n: number): string {
  if (!isFinite(n)) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fmtPct(n: number, dp = 1): string {
  return `${(n * 100).toFixed(dp)}%`;
}

function heatColor(v: number, min: number, max: number): string {
  if (min === max || !isFinite(v)) return "hsl(60,50%,92%)";
  const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
  return `hsl(${Math.round(t * 120)},60%,88%)`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium tabular-nums">{fmt(value)}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function CashFlowTable({ result }: { result: DcfResult }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Cash Flow Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto px-6 pb-4 pt-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="py-1.5 text-left font-medium">Year</th>
              <th className="py-1.5 text-right font-medium">Revenue</th>
              <th className="py-1.5 text-right font-medium">EBIT</th>
              <th className="py-1.5 text-right font-medium">FCF</th>
              <th className="py-1.5 text-right font-medium">PV (FCF)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {result.yearlyData.map((y) => (
              <tr key={y.year}>
                <td className="py-1.5 text-muted-foreground">FY{y.year}</td>
                <td className="py-1.5 text-right font-mono tabular-nums">{fmtCr(y.revenue)}</td>
                <td className="py-1.5 text-right font-mono tabular-nums">{fmtCr(y.ebit)}</td>
                <td className="py-1.5 text-right font-mono tabular-nums">{fmtCr(y.fcf)}</td>
                <td className="py-1.5 text-right font-mono tabular-nums">{fmtCr(y.pv)}</td>
              </tr>
            ))}
            <tr className="text-muted-foreground border-t border-border/60">
              <td className="py-1.5 italic">TV</td>
              <td className="py-1.5 text-right font-mono tabular-nums" colSpan={3}>
                {fmtCr(result.terminalValue)}
              </td>
              <td className="py-1.5 text-right font-mono tabular-nums">{fmtCr(result.pvTerminalValue)}</td>
            </tr>
            <tr className="font-semibold border-t">
              <td className="py-1.5">EV</td>
              <td className="py-1.5" colSpan={3} />
              <td className="py-1.5 text-right font-mono tabular-nums">{fmtCr(result.enterpriseValue)}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function SensitivityHeatmap({
  matrix,
  baseWacc,
  baseTg,
}: {
  matrix: (number | null)[][];
  baseWacc: number;
  baseTg: number;
}) {
  const allVals = matrix.flat().filter((v): v is number => v !== null);
  const min = allVals.length ? Math.min(...allVals) : 0;
  const max = allVals.length ? Math.max(...allVals) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Sensitivity — Value per Share (₹)
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          WACC → (columns) · Terminal Growth ↓ (rows) · Outlined cell = base case
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr>
              <th className="py-1 pr-2 text-left text-muted-foreground font-normal whitespace-nowrap">
                TG / WACC
              </th>
              {WACC_DELTAS.map((d, ci) => (
                <th
                  key={ci}
                  className="py-1 px-2 text-center text-muted-foreground font-normal whitespace-nowrap"
                >
                  {fmtPct(baseWacc + d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, ri) => (
              <tr key={ri}>
                <td className="py-1 pr-2 text-muted-foreground font-medium whitespace-nowrap">
                  {fmtPct(baseTg + TG_DELTAS[ri])}
                </td>
                {row.map((val, ci) => {
                  const isBase = ri === 2 && ci === 2;
                  return (
                    <td
                      key={ci}
                      className={`py-1 px-2 text-center font-mono tabular-nums rounded${
                        isBase ? " outline outline-2 outline-primary outline-offset-1" : ""
                      }`}
                      style={{
                        backgroundColor:
                          val !== null ? heatColor(val, min, max) : "#f5f5f5",
                      }}
                      title={
                        val !== null
                          ? `WACC: ${fmtPct(baseWacc + WACC_DELTAS[ci])}, TG: ${fmtPct(baseTg + TG_DELTAS[ri])}, Value: ${fmtShare(val)}`
                          : "N/A — WACC ≤ Terminal Growth"
                      }
                    >
                      {val !== null ? fmtShare(val) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function ResultsSummary({
  result,
  companyName,
  currentPrice,
  netDebt,
}: {
  result: DcfResult;
  companyName: string;
  currentPrice?: number;
  netDebt: number;
}) {
  const upside =
    currentPrice != null && currentPrice > 0
      ? (result.equityValuePerShare / currentPrice - 1) * 100
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Valuation Summary
        </CardTitle>
        <p className="text-xs text-muted-foreground">{companyName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-muted-foreground">Enterprise Value</span>
            <span className="font-mono font-medium">{fmtCr(result.enterpriseValue)}</span>
          </div>
          {netDebt !== 0 && (
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-muted-foreground">
                {netDebt > 0 ? "Less: Net Debt" : "Add: Net Cash"}
              </span>
              <span className="font-mono text-muted-foreground">{fmtCr(Math.abs(netDebt))}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-muted-foreground">Equity Value</span>
            <span className="font-mono font-medium">{fmtCr(result.equityValue)}</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Intrinsic Value / Share</span>
            <span className="text-2xl font-bold font-mono">
              {fmtShare(result.equityValuePerShare)}
            </span>
          </div>
          {currentPrice != null && currentPrice > 0 && (
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-mono text-muted-foreground">{fmtShare(currentPrice)}</span>
            </div>
          )}
          {upside !== null && (
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-muted-foreground">Upside / (Downside)</span>
              <span
                className={`font-mono font-semibold flex items-center gap-1 ${
                  upside >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"
                }`}
              >
                {upside >= 0 ? "+" : ""}
                {upside.toFixed(1)}%
                {upside >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
              </span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>PV of FCFs</span>
            <span className="font-mono">{fmtCr(result.sumPvCashFlows)}</span>
          </div>
          <div className="flex justify-between">
            <span>PV of Terminal Value</span>
            <span className="font-mono">{fmtCr(result.pvTerminalValue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Terminal Value as % of EV</span>
            <span className="font-mono">{fmtPct(result.terminalValuePct)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const KATEX_FORMULAS = [
  {
    label: "DCF Intrinsic Value",
    latex: "V_0 = \\sum_{t=1}^{n} \\frac{FCF_t}{(1+r)^t} + \\frac{TV_n}{(1+r)^n}",
    note: "Sum of discounted free cash flows plus the discounted terminal value. r = WACC.",
  },
  {
    label: "Terminal Value (Gordon Growth Model)",
    latex: "TV = \\frac{FCF_{n+1}}{WACC - g}",
    note: "Perpetuity value of cash flows growing at g forever. Requires WACC > g.",
  },
  {
    label: "Free Cash Flow (simplified)",
    latex: "FCF \\approx EBIT \\times (1 - t_{\\text{eff}})",
    note: "NOPAT approximation. A full model subtracts net capex and Δworking capital.",
  },
] as const;

function FormulasPanel() {
  return (
    <div className="space-y-5 border rounded-lg p-5 bg-muted/20 mt-6">
      <p className="text-sm font-semibold">Key Formulas</p>
      {KATEX_FORMULAS.map((f) => (
        <div key={f.label} className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{f.label}</p>
          <div
            className="overflow-x-auto py-1"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(f.latex, { throwOnError: false, displayMode: true }),
            }}
          />
          <p className="text-xs text-muted-foreground">{f.note}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export interface DcfSensitivityCalculatorProps {
  companyName?: string;
  baseRevenue?: number;
  netDebt?: number;
  sharesOutstanding?: number;
  currentPrice?: number;
  defaultRevenueGrowth?: number;
  defaultOperatingMargin?: number;
  defaultTaxRate?: number;
  defaultWacc?: number;
  defaultTerminalGrowth?: number;
  defaultForecastYears?: number;
}

const DEFAULTS = {
  revenueGrowth: 0.15,
  operatingMargin: 0.20,
  taxRate: 0.25,
  wacc: 0.12,
  terminalGrowth: 0.045,
  forecastYears: 5,
} as const;

export function DcfSensitivityCalculator({
  companyName = "Sample Company",
  baseRevenue = 10_000,
  netDebt = 0,
  sharesOutstanding = 100,
  currentPrice,
  defaultRevenueGrowth = DEFAULTS.revenueGrowth,
  defaultOperatingMargin = DEFAULTS.operatingMargin,
  defaultTaxRate = DEFAULTS.taxRate,
  defaultWacc = DEFAULTS.wacc,
  defaultTerminalGrowth = DEFAULTS.terminalGrowth,
  defaultForecastYears = DEFAULTS.forecastYears,
}: DcfSensitivityCalculatorProps) {
  const [revenueGrowth, setRevenueGrowth] = useState(defaultRevenueGrowth);
  const [operatingMargin, setOperatingMargin] = useState(defaultOperatingMargin);
  const [taxRate, setTaxRate] = useState(defaultTaxRate);
  const [wacc, setWacc] = useState(defaultWacc);
  const [terminalGrowth, setTerminalGrowth] = useState(defaultTerminalGrowth);
  const [forecastYears, setForecastYears] = useState(defaultForecastYears);
  const [showFormulas, setShowFormulas] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const inputs: DcfInputs = useMemo(
    () => ({
      baseRevenue,
      revenueGrowth,
      operatingMargin,
      taxRate,
      wacc,
      terminalGrowth,
      forecastYears,
      netDebt,
      sharesOutstanding,
    }),
    [
      baseRevenue,
      revenueGrowth,
      operatingMargin,
      taxRate,
      wacc,
      terminalGrowth,
      forecastYears,
      netDebt,
      sharesOutstanding,
    ],
  );

  const result = useMemo(() => calculateDcf(inputs), [inputs]);
  const sensitivityMatrix = useMemo(() => calculateSensitivity(inputs), [inputs]);

  const handleReset = useCallback(() => {
    setRevenueGrowth(defaultRevenueGrowth);
    setOperatingMargin(defaultOperatingMargin);
    setTaxRate(defaultTaxRate);
    setWacc(defaultWacc);
    setTerminalGrowth(defaultTerminalGrowth);
    setForecastYears(defaultForecastYears);
  }, [
    defaultRevenueGrowth,
    defaultOperatingMargin,
    defaultTaxRate,
    defaultWacc,
    defaultTerminalGrowth,
    defaultForecastYears,
  ]);

  const handleExport = useCallback(async () => {
    if (!result) return;
    setIsExporting(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const s1 = XLSX.utils.aoa_to_sheet([
        ["The Valuation Node — DCF Model"],
        ["Generated", new Date().toLocaleDateString("en-IN")],
        [],
        ["Assumption", "Value"],
        ["Company", companyName],
        ["Base Revenue (₹ Cr)", baseRevenue],
        ["Revenue Growth", `${(revenueGrowth * 100).toFixed(1)}%`],
        ["Operating Margin", `${(operatingMargin * 100).toFixed(1)}%`],
        ["Tax Rate", `${(taxRate * 100).toFixed(1)}%`],
        ["WACC", `${(wacc * 100).toFixed(1)}%`],
        ["Terminal Growth Rate", `${(terminalGrowth * 100).toFixed(1)}%`],
        ["Forecast Years", forecastYears],
        ["Net Debt (₹ Cr)", netDebt],
        ["Shares Outstanding (Cr)", sharesOutstanding],
      ]);
      XLSX.utils.book_append_sheet(wb, s1, "Assumptions");

      const s2 = XLSX.utils.aoa_to_sheet([
        ["Year", "Revenue (₹ Cr)", "EBIT (₹ Cr)", "FCF (₹ Cr)", "Discount Factor", "PV (₹ Cr)"],
        ...result.yearlyData.map((y) => [
          `FY${y.year}`,
          Math.round(y.revenue),
          Math.round(y.ebit),
          Math.round(y.fcf),
          +y.discountFactor.toFixed(4),
          Math.round(y.pv),
        ]),
        ["Terminal Value", "", "", Math.round(result.terminalValue), "", Math.round(result.pvTerminalValue)],
        [],
        ["Enterprise Value (₹ Cr)", "", "", "", "", Math.round(result.enterpriseValue)],
        ["Equity Value (₹ Cr)", "", "", "", "", Math.round(result.equityValue)],
        ["Intrinsic Value / Share (₹)", "", "", "", "", Math.round(result.equityValuePerShare)],
      ]);
      XLSX.utils.book_append_sheet(wb, s2, "Cash Flows");

      const waccHeaders = WACC_DELTAS.map((d) => `WACC ${((wacc + d) * 100).toFixed(1)}%`);
      const tgHeaders = TG_DELTAS.map((d) => `TG ${((terminalGrowth + d) * 100).toFixed(1)}%`);
      const s3 = XLSX.utils.aoa_to_sheet([
        ["Sensitivity — Intrinsic Value per Share (₹)"],
        ["TG / WACC", ...waccHeaders],
        ...sensitivityMatrix.map((row, ri) => [
          tgHeaders[ri],
          ...row.map((v) => (v !== null ? Math.round(v) : "N/A")),
        ]),
      ]);
      XLSX.utils.book_append_sheet(wb, s3, "Sensitivity Grid");

      XLSX.writeFile(wb, `DCF_${companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`);

      if (typeof (window as any).umami !== "undefined") {
        (window as any).umami.track("DCF Model Downloaded", { company: companyName });
      }
    } finally {
      setIsExporting(false);
    }
  }, [
    result,
    sensitivityMatrix,
    companyName,
    baseRevenue,
    revenueGrowth,
    operatingMargin,
    taxRate,
    wacc,
    terminalGrowth,
    forecastYears,
    netDebt,
    sharesOutstanding,
  ]);

  const waccConstraintViolated = wacc <= terminalGrowth;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Base Revenue:{" "}
          <span className="font-mono font-medium">{fmtCr(baseRevenue)}</span>
          {" · "}Shares:{" "}
          <span className="font-mono font-medium">
            {sharesOutstanding.toLocaleString("en-IN")} Cr
          </span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFormulas((s) => !s)}>
            Formulas
            {showFormulas ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!result || isExporting}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {isExporting ? "Exporting…" : "Excel"}
          </Button>
        </div>
      </div>

      {waccConstraintViolated && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          WACC ({fmtPct(wacc)}) must be greater than Terminal Growth ({fmtPct(terminalGrowth)}) for
          the Gordon Growth Model to produce a valid result.
        </div>
      )}

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Assumptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <SliderRow
              label="Revenue Growth Rate"
              value={revenueGrowth}
              min={-0.05}
              max={0.40}
              step={0.005}
              fmt={fmtPct}
              onChange={setRevenueGrowth}
            />
            <SliderRow
              label="Operating Margin"
              value={operatingMargin}
              min={0.02}
              max={0.50}
              step={0.005}
              fmt={fmtPct}
              onChange={setOperatingMargin}
            />
            <SliderRow
              label="Effective Tax Rate"
              value={taxRate}
              min={0.10}
              max={0.45}
              step={0.01}
              fmt={fmtPct}
              onChange={setTaxRate}
            />
            <SliderRow
              label="WACC"
              value={wacc}
              min={0.06}
              max={0.30}
              step={0.005}
              fmt={fmtPct}
              onChange={setWacc}
            />
            <SliderRow
              label="Terminal Growth Rate"
              value={terminalGrowth}
              min={0.01}
              max={0.09}
              step={0.005}
              fmt={fmtPct}
              onChange={setTerminalGrowth}
            />
            <SliderRow
              label="Forecast Period"
              value={forecastYears}
              min={3}
              max={10}
              step={1}
              fmt={(v) => `${v} yr`}
              onChange={setForecastYears}
            />
          </CardContent>
        </Card>

        {result ? (
          <CashFlowTable result={result} />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-full min-h-[200px] text-sm text-muted-foreground p-6">
              Adjust WACC above terminal growth rate to generate a projection.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom row */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SensitivityHeatmap
            matrix={sensitivityMatrix}
            baseWacc={wacc}
            baseTg={terminalGrowth}
          />
          <ResultsSummary
            result={result}
            companyName={companyName}
            currentPrice={currentPrice}
            netDebt={netDebt}
          />
        </div>
      )}

      {/* Formulas panel */}
      {showFormulas && <FormulasPanel />}

      <p className="text-xs text-muted-foreground border-t pt-4">
        FCF is simplified as NOPAT (EBIT after tax) — a full model would account for capex, changes
        in working capital, and depreciation separately. All figures in ₹ crore. Not financial advice.
      </p>
    </div>
  );
}
