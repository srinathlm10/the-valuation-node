import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip,
} from "recharts";
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import {
  COMPANY_PAIRS,
  getCompany,
  derive,
  fmtPct,
  fmtX,
  track,
  type FinancialCompany,
  type DerivedFinancials,
} from "@/lib/learnFinancials";

type Dir = "higher" | "lower";

interface Dimension {
  key: string;
  label: string;
  question: string;
  dir: Dir; // which direction is "stronger"
  get: (c: FinancialCompany, d: DerivedFinancials) => number;
  fmt: (v: number) => string;
  explain: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: "growth",
    label: "Revenue Growth",
    question: "Which company grew revenue faster last year?",
    dir: "higher",
    get: (_c, d) => d.revenueGrowth,
    fmt: (v) => fmtPct(v),
    explain:
      "Faster growth is generally better, but it must be profitable and sustainable. A cyclical company bouncing off a weak base can post huge growth that doesn't repeat.",
  },
  {
    key: "margin",
    label: "EBITDA Margin",
    question: "Which company is more profitable at the operating level?",
    dir: "higher",
    get: (_c, d) => d.ebitdaMargin,
    fmt: (v) => fmtPct(v),
    explain:
      "EBITDA margin shows how much operating cash profit each rupee of sales produces. Structurally higher margins usually reflect pricing power, brand strength, or a cost advantage.",
  },
  {
    key: "roe",
    label: "Return on Equity",
    question: "Which company earns more on shareholders' capital?",
    dir: "higher",
    get: (_c, d) => d.roe,
    fmt: (v) => fmtPct(v),
    explain:
      "ROE rewards efficient use of equity. But remember leverage flatters ROE — a highly indebted company can show a high ROE while being riskier, which is why you look at leverage next.",
  },
  {
    key: "leverage",
    label: "Debt-to-Equity",
    question: "Which company carries the safer balance sheet (less debt)?",
    dir: "lower",
    get: (_c, d) => d.debtToEquity,
    fmt: (v) => fmtX(v, 2),
    explain:
      "Lower debt means more resilience in a downturn and more flexibility to invest. High leverage is not automatically bad — but it demands stable, predictable cash flows to support it.",
  },
  {
    key: "coverage",
    label: "Interest Coverage",
    question: "Which company covers its interest bill more comfortably?",
    dir: "higher",
    get: (_c, d) => d.interestCoverage,
    fmt: (v) => (isFinite(v) ? fmtX(v, 0) : "≈ no debt"),
    explain:
      "Interest coverage (EBIT ÷ interest) is a direct solvency test. A near-debt-free company has effectively infinite coverage; a leveraged one needs a healthy buffer so a profit dip doesn't threaten debt servicing.",
  },
  {
    key: "valuation",
    label: "P/E Ratio",
    question: "Which company is cheaper on a price-to-earnings basis?",
    dir: "lower",
    get: (c, d) => (isFinite(d.pe) ? d.pe : 0),
    fmt: (v) => fmtX(v, 0),
    explain:
      "A lower P/E means you pay less per rupee of earnings — but cheap can be a trap. The market often assigns a lower multiple to slower-growing, riskier, or more cyclical businesses for good reason.",
  },
];

function winner(dim: Dimension, va: number, vb: number): "a" | "b" {
  if (dim.dir === "higher") return va >= vb ? "a" : "b";
  return va <= vb ? "a" : "b";
}

// Normalise to 0–100 where the stronger company on that axis is 100.
function radarScore(dir: Dir, val: number, other: number): number {
  if (dir === "higher") {
    const max = Math.max(val, other);
    if (max <= 0) return 0;
    return Math.max(0, Math.min(100, (val / max) * 100));
  }
  // lower is better
  const min = Math.min(val, other);
  if (val <= 0) return 100;
  return Math.max(0, Math.min(100, (min / val) * 100));
}

export function CompareCompaniesLesson() {
  const [pairKey, setPairKey] = useState(COMPANY_PAIRS[0].key);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, "a" | "b">>({});
  const completedRef = useRef(false);

  const pair = useMemo(() => COMPANY_PAIRS.find((p) => p.key === pairKey) ?? COMPANY_PAIRS[0], [pairKey]);
  const a = getCompany(pair.a)!;
  const b = getCompany(pair.b)!;
  const da = useMemo(() => derive(a), [a]);
  const db = useMemo(() => derive(b), [b]);

  const total = DIMENSIONS.length;
  const dim = DIMENSIONS[idx];
  const va = dim.get(a, da);
  const vb = dim.get(b, db);
  const correctSide = winner(dim, va, vb);
  const picked = picks[dim.key];
  const answered = picked !== undefined;

  const score = DIMENSIONS.reduce((acc, dd) => {
    const p = picks[dd.key];
    if (!p) return acc;
    const w = winner(dd, dd.get(a, da), dd.get(b, db));
    return acc + (p === w ? 1 : 0);
  }, 0);
  const answeredCount = Object.keys(picks).length;
  const done = answeredCount === total && idx === total - 1 && answered;

  const radarData = useMemo(
    () =>
      DIMENSIONS.map((dd) => ({
        dimension: dd.label,
        [a.ticker]: Math.round(radarScore(dd.dir, dd.get(a, da), dd.get(b, db))),
        [b.ticker]: Math.round(radarScore(dd.dir, dd.get(b, db), dd.get(a, da))),
      })),
    [a, b, da, db]
  );

  useEffect(() => {
    track("Learn-by-Doing Module Started", { module: "compare-two-companies" });
  }, []);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      track("Learn-by-Doing Module Completed", { module: "compare-two-companies", score, total });
    }
  }, [done, score, total]);

  const changePair = useCallback((key: string) => {
    setPairKey(key);
    setIdx(0);
    setPicks({});
    completedRef.current = false;
  }, []);

  const pick = useCallback(
    (side: "a" | "b") => {
      if (picks[dim.key]) return;
      setPicks((p) => ({ ...p, [dim.key]: side }));
      track("Learn-by-Doing Step Completed", {
        module: "compare-two-companies",
        step: idx + 1,
        correct: side === correctSide,
      });
    },
    [dim.key, picks, idx, correctSide]
  );

  const next = useCallback(() => setIdx((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);
  const restart = useCallback(() => {
    setIdx(0);
    setPicks({});
    completedRef.current = false;
  }, []);

  // Overall tally for the verdict
  const tally = useMemo(() => {
    let aWins = 0;
    let bWins = 0;
    DIMENSIONS.forEach((dd) => {
      if (dd.key === "valuation") return; // valuation isn't "quality", handle separately
      const w = winner(dd, dd.get(a, da), dd.get(b, db));
      if (w === "a") aWins++;
      else bWins++;
    });
    return { aWins, bWins };
  }, [a, b, da, db]);

  const CompanyCard = ({
    company,
    value,
    side,
  }: {
    company: FinancialCompany;
    value: number;
    side: "a" | "b";
  }) => {
    const isPicked = picked === side;
    const isCorrect = answered && side === correctSide;
    return (
      <button
        onClick={() => pick(side)}
        disabled={answered}
        className={cn(
          "flex-1 text-left p-4 rounded-xl border-2 transition-all",
          !answered && "hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer",
          answered && isCorrect && "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20",
          answered && isPicked && !isCorrect && "border-red-400 bg-red-50/50 dark:bg-red-950/20",
          answered && !isPicked && !isCorrect && "opacity-60"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{company.name}</span>
          {answered && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
          {answered && isPicked && !isCorrect && <X className="h-4 w-4 text-red-500" />}
        </div>
        <p className="text-xs text-muted-foreground">{company.ticker}</p>
        <p className={cn("mt-3 text-2xl font-bold tabular-nums", answered ? "" : "blur-[6px] select-none")}>
          {dim.fmt(value)}
        </p>
        {!answered && <p className="text-[11px] text-muted-foreground mt-1">Tap to pick — value reveals after</p>}
      </button>
    );
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Pair picker */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Choose a match-up (same sector)</label>
        <select
          value={pairKey}
          onChange={(e) => changePair(e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {COMPANY_PAIRS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label} — {p.sector}
            </option>
          ))}
        </select>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Round {idx + 1} of {total}: <span className="text-foreground font-medium">{dim.label}</span>
          </p>
          <span className="text-xs text-muted-foreground">
            Called right: <span className="font-medium text-foreground">{score}</span>/{answeredCount}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300 rounded-full" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold">{dim.question}</h2>

        <div className="mt-5 flex gap-3">
          <CompanyCard company={a} value={va} side="a" />
          <div className="flex items-center text-xs font-semibold text-muted-foreground">vs</div>
          <CompanyCard company={b} value={vb} side="b" />
        </div>

        {answered && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>
                {(correctSide === "a" ? a.name : b.name)} wins this round ({dim.fmt(correctSide === "a" ? va : vb)} vs{" "}
                {dim.fmt(correctSide === "a" ? vb : va)}).
              </strong>{" "}
              {dim.explain}
            </p>
          </div>
        )}

        {answered && idx < total - 1 && (
          <div className="mt-6 flex justify-end">
            <Button onClick={next} className="flex items-center gap-1">
              Next round <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Completion */}
        {done && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 text-center">
              <Trophy className="h-6 w-6 mx-auto text-blue-600" />
              <p className="mt-2 text-sm text-muted-foreground">You called</p>
              <p className="text-4xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                {score}/{total}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">rounds correctly</p>
            </div>

            {/* Radar */}
            <div>
              <p className="text-sm font-medium mb-2">Full profile (100 = stronger of the two on each axis)</p>
              <div className="rounded-xl border p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                    <Radar name={a.ticker} dataKey={a.ticker} stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                    <Radar name={b.ticker} dataKey={b.ticker} stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verdict */}
            <div className="p-5 rounded-xl border">
              <h3 className="font-semibold">The analyst's takeaway</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                On business-quality measures (growth, margins, returns, balance sheet), {" "}
                <strong className="text-foreground">
                  {tally.aWins === tally.bWins
                    ? "the two are evenly matched"
                    : `${tally.aWins > tally.bWins ? a.name : b.name} leads ${Math.max(tally.aWins, tally.bWins)}–${Math.min(tally.aWins, tally.bWins)}`}
                </strong>
                . But the "better business" is not always the "better investment" — {da.pe < db.pe ? a.name : b.name} trades
                at the lower P/E, so the market is already pricing in some of these differences. Comparison is about
                understanding trade-offs, not crowning a single winner.
              </p>
            </div>

            <div className="p-5 rounded-xl border">
              <h3 className="font-semibold mb-4">Go deeper</h3>
              <div className="space-y-3 text-sm">
                <Link to="/learn/foundations/valuation/relative-valuation" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ChevronRight className="h-4 w-4 shrink-0" /> Relative Valuation — Foundations
                </Link>
                <Link to="/learn/foundations/financial-statement-analysis/dupont-decomposition" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ChevronRight className="h-4 w-4 shrink-0" /> DuPont Decomposition — Foundations
                </Link>
                <Link to="/learn/by-doing/spot-the-red-flags" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ChevronRight className="h-4 w-4 shrink-0" /> Next: Spot the Red Flags
                </Link>
              </div>
            </div>

            <Button variant="outline" onClick={restart} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Try another match-up
            </Button>

            <NewsletterSignup source="learn-by-doing:compare-two-companies" />

            <p className="text-xs text-muted-foreground italic">
              Figures are approximate, illustrative FY24 numbers for educational use only. Not investment advice.
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={idx === 0} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 flex items-center justify-between z-30">
        <p className="text-xs text-muted-foreground truncate">
          {dim.label} · {idx + 1}/{total}
        </p>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {answered && idx < total - 1 && (
            <Button size="sm" onClick={next}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
