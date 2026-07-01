import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, Flag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { track } from "@/lib/learnFinancials";

interface Signal {
  text: string;
  isRedFlag: boolean;
  explain: string;
}

interface RedFlagCase {
  key: string;
  company: string; // hypothetical
  theme: string;
  scenario: string;
  signals: Signal[];
}

const CASES: RedFlagCase[] = [
  {
    key: "cash",
    company: "Meridian Infra Ltd (hypothetical)",
    theme: "Profit up, cash missing",
    scenario:
      "A mid-cap infrastructure company reports its best-ever profit. The headline looks great — but you decide to look past the net profit line. Tick every observation you'd treat as a genuine red flag.",
    signals: [
      {
        text: "Net profit grew 40%, but operating cash flow turned negative.",
        isRedFlag: true,
        explain:
          "The single most important earnings-quality check. Profit is an accounting opinion; cash is a fact. Profit rising while operating cash flow falls means the 'profit' isn't turning into money.",
      },
      {
        text: "Trade receivable days jumped from 60 to 130.",
        isRedFlag: true,
        explain:
          "Customers are taking far longer to pay — or sales are being booked before cash is realistically collectible. Receivables growing much faster than revenue is a classic channel-stuffing signal.",
      },
      {
        text: "A large chunk of revenue is recognised on unbilled percentage-of-completion.",
        isRedFlag: true,
        explain:
          "Unbilled revenue relies on management estimates of project progress. When it balloons, it's a common place for aggressive or premature revenue recognition to hide.",
      },
      {
        text: "The board raised the dividend this year.",
        isRedFlag: false,
        explain:
          "On its own this is neutral-to-positive. It only becomes a concern if the dividend is being funded by fresh debt rather than genuine cash generation — which you'd verify separately.",
      },
      {
        text: "The statutory auditor issued a clean (unqualified) report.",
        isRedFlag: false,
        explain:
          "A clean report is normal and not a red flag. Just remember it is not a guarantee — audits give reasonable, not absolute, assurance.",
      },
      {
        text: "The cash balance rose, entirely because the company raised fresh equity.",
        isRedFlag: false,
        explain:
          "Higher cash from an equity raise is financing, not operations. It isn't a red flag by itself — but don't mistake it for cash the business generated.",
      },
    ],
  },
  {
    key: "debt",
    company: "Apex Steel & Power Ltd (hypothetical)",
    theme: "The debt spiral",
    scenario:
      "A capital-intensive manufacturer has been expanding aggressively. Earnings are still positive, but you want to stress-test the balance sheet. Which of these are real warning signs?",
    signals: [
      {
        text: "Debt-to-equity rose from 1.2× to 2.8× in two years.",
        isRedFlag: true,
        explain:
          "Rapidly rising leverage leaves little margin for error. If cash flows wobble in a downturn, a balance sheet like this can unravel quickly.",
      },
      {
        text: "Interest coverage has fallen to 1.3×.",
        isRedFlag: true,
        explain:
          "Operating profit barely covers the interest bill. Any dip in earnings could mean the company can't service its debt — the definition of solvency risk.",
      },
      {
        text: "Promoters have pledged 78% of their shareholding.",
        isRedFlag: true,
        explain:
          "High promoter pledging is a serious governance and solvency signal. If the share price falls, lenders can sell pledged shares, triggering a downward spiral and loss of promoter control.",
      },
      {
        text: "Short-term borrowings are funding long-term capital projects.",
        isRedFlag: true,
        explain:
          "An asset-liability mismatch. Long-gestation assets funded by loans that must be rolled over frequently create refinancing risk — dangerous if credit conditions tighten.",
      },
      {
        text: "The company operates in a cyclical industry.",
        isRedFlag: false,
        explain:
          "Cyclicality is a characteristic, not a red flag. It matters only in combination with high fixed costs and leverage — which is why the debt signals above are the real concern.",
      },
      {
        text: "Management issued confident revenue guidance for next year.",
        isRedFlag: false,
        explain:
          "Optimistic guidance is normal management communication. It's neither reassuring nor alarming on its own — judge the company by its numbers, not its narrative.",
      },
    ],
  },
  {
    key: "quality",
    company: "Nimbus Tech Ltd (hypothetical)",
    theme: "Too good to be true",
    scenario:
      "A fast-growing small-cap is the talk of the market, posting eye-popping margins. Extraordinary numbers deserve extraordinary scrutiny. Flag the observations that should make you cautious.",
    signals: [
      {
        text: "Net margin is 45% — triple the industry average — with no obvious moat.",
        isRedFlag: true,
        explain:
          "Margins far above peers without a clear, durable competitive advantage are suspicious. Either the moat is real and identifiable, or the numbers deserve deep scepticism.",
      },
      {
        text: "A large share of revenue comes from related-party entities.",
        isRedFlag: true,
        explain:
          "Sales to entities controlled by the promoter can be used to inflate revenue and profit that isn't genuine third-party demand. Always scrutinise related-party transactions in the notes.",
      },
      {
        text: "The auditor resigned mid-year and was replaced.",
        isRedFlag: true,
        explain:
          "An unexplained auditor exit — especially mid-cycle — is one of the strongest governance warning signs. Auditors rarely walk away from a clean, well-run client.",
      },
      {
        text: "Most of the reported profit is 'other income', not operating profit.",
        isRedFlag: true,
        explain:
          "If profit depends on treasury gains or one-offs rather than the core business, the earnings are low-quality and unlikely to be sustainable.",
      },
      {
        text: "Contingent liabilities (guarantees) are three times net worth.",
        isRedFlag: true,
        explain:
          "Large off-balance-sheet exposures can crystallise into real liabilities. When they dwarf net worth, a single adverse event could wipe out shareholders.",
      },
      {
        text: "The company pays tax at the full statutory rate.",
        isRedFlag: false,
        explain:
          "Actually reassuring. Companies fabricating profits often can't or won't pay full tax on them. A normal tax rate is weak evidence the profits are real.",
      },
      {
        text: "Free cash flow is consistently strong and closely matches reported profit.",
        isRedFlag: false,
        explain:
          "This is a green flag, not a red one. Profit converting cleanly into cash is exactly what you want to see — it's the opposite of the first case.",
      },
    ],
  },
];

export function SpotRedFlagsLesson() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, Set<number>>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const completedRef = useRef(false);

  const current = CASES[caseIdx];
  const total = CASES.length;
  const isRevealed = !!revealed[current.key];
  const sel = selected[current.key] ?? new Set<number>();

  const allRevealed = CASES.every((c) => revealed[c.key]);

  // Scoring across all revealed cases
  const scoreData = useMemo(() => {
    let caught = 0;
    let totalFlags = 0;
    let falsePositives = 0;
    CASES.forEach((c) => {
      if (!revealed[c.key]) return;
      const s = selected[c.key] ?? new Set<number>();
      c.signals.forEach((sig, i) => {
        if (sig.isRedFlag) {
          totalFlags++;
          if (s.has(i)) caught++;
        } else if (s.has(i)) {
          falsePositives++;
        }
      });
    });
    return { caught, totalFlags, falsePositives };
  }, [selected, revealed]);

  useEffect(() => {
    track("Learn-by-Doing Module Started", { module: "spot-the-red-flags" });
  }, []);

  useEffect(() => {
    if (allRevealed && !completedRef.current) {
      completedRef.current = true;
      track("Learn-by-Doing Module Completed", {
        module: "spot-the-red-flags",
        caught: scoreData.caught,
        totalFlags: scoreData.totalFlags,
      });
    }
  }, [allRevealed, scoreData]);

  const toggle = useCallback(
    (i: number) => {
      if (isRevealed) return;
      setSelected((prev) => {
        const next = new Set(prev[current.key] ?? []);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return { ...prev, [current.key]: next };
      });
    },
    [current.key, isRevealed]
  );

  const reveal = useCallback(() => {
    setRevealed((r) => ({ ...r, [current.key]: true }));
    const s = selected[current.key] ?? new Set<number>();
    const caught = current.signals.filter((sig, i) => sig.isRedFlag && s.has(i)).length;
    track("Learn-by-Doing Step Completed", { module: "spot-the-red-flags", case: current.key, caught });
  }, [current, selected]);

  const next = useCallback(() => setCaseIdx((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setCaseIdx((i) => Math.max(i - 1, 0)), []);
  const restart = useCallback(() => {
    setCaseIdx(0);
    setSelected({});
    setRevealed({});
    completedRef.current = false;
  }, []);

  const caseFlags = current.signals.filter((s) => s.isRedFlag).length;
  const caseCaught = current.signals.filter((s, i) => s.isRedFlag && sel.has(i)).length;

  return (
    <div className="pb-24 lg:pb-0">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Case {caseIdx + 1} of {total}: <span className="text-foreground font-medium">{current.theme}</span>
          </p>
          {allRevealed && (
            <span className="text-xs text-muted-foreground">
              Red flags caught: <span className="font-medium text-foreground">{scoreData.caught}</span>/{scoreData.totalFlags}
            </span>
          )}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300 rounded-full" style={{ width: `${((caseIdx + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Scenario */}
        <div className="rounded-xl border p-5">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{current.theme}</span>
          </div>
          <h2 className="mt-2 text-lg font-bold">{current.company}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{current.scenario}</p>
        </div>

        {/* Signals checklist */}
        <div className="mt-5 space-y-2.5">
          {current.signals.map((sig, i) => {
            const isSel = sel.has(i);
            const showResult = isRevealed;
            const correct = isSel === sig.isRedFlag;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border-2 p-4 transition-all",
                  !showResult && "cursor-pointer",
                  !showResult && isSel && "border-blue-400 bg-blue-50/40 dark:bg-blue-950/20",
                  !showResult && !isSel && "hover:border-muted-foreground/30",
                  showResult && sig.isRedFlag && "border-red-300 bg-red-50/40 dark:bg-red-950/20",
                  showResult && !sig.isRedFlag && "border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10"
                )}
                onClick={() => toggle(i)}
              >
                <div className="flex items-start gap-3">
                  {!showResult ? (
                    <span
                      className={cn(
                        "mt-0.5 h-5 w-5 shrink-0 rounded border flex items-center justify-center",
                        isSel ? "bg-blue-600 border-blue-600 text-white" : "border-muted-foreground/40"
                      )}
                    >
                      {isSel && <Check className="h-3.5 w-3.5" />}
                    </span>
                  ) : (
                    <span className="mt-0.5 shrink-0">
                      {sig.isRedFlag ? (
                        <Flag className="h-5 w-5 text-red-500" />
                      ) : (
                        <Check className="h-5 w-5 text-emerald-500" />
                      )}
                    </span>
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium">{sig.text}</p>
                    {showResult && (
                      <>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full font-medium",
                              sig.isRedFlag
                                ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                                : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                            )}
                          >
                            {sig.isRedFlag ? "Red flag" : "Not a red flag"}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
                              correct
                                ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                            )}
                          >
                            {correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            {correct ? "You got it" : isSel ? "False alarm" : "You missed this"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{sig.explain}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reveal / result bar */}
        {!isRevealed ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {sel.size} selected · pick the ones you'd genuinely flag
            </p>
            <Button onClick={reveal}>
              <AlertTriangle className="mr-2 h-4 w-4" /> Reveal the red flags
            </Button>
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-lg bg-muted/40 border text-sm">
            You caught <strong>{caseCaught}</strong> of <strong>{caseFlags}</strong> red flags in this case.
            {caseIdx < total - 1 && (
              <Button onClick={next} className="ml-3 mt-2 sm:mt-0 inline-flex items-center gap-1" size="sm">
                Next case <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Completion */}
        {allRevealed && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 text-center">
              <p className="text-sm text-muted-foreground">Across all three cases you caught</p>
              <p className="text-4xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                {scoreData.caught}/{scoreData.totalFlags}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                red flags{scoreData.falsePositives > 0 ? `, with ${scoreData.falsePositives} false alarm${scoreData.falsePositives > 1 ? "s" : ""}` : " — clean run"}.
              </p>
            </div>

            <div className="p-5 rounded-xl border">
              <h3 className="font-semibold">The pattern behind the flags</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Most real-world accounting failures rhyme with these three cases: <strong className="text-foreground">profit that never becomes cash</strong>,{" "}
                <strong className="text-foreground">a balance sheet quietly buckling under debt</strong>, and{" "}
                <strong className="text-foreground">numbers too good to be true with weak governance</strong>. When you see one flag, look for the others — they usually travel together.
              </p>
            </div>

            <div className="p-5 rounded-xl border">
              <h3 className="font-semibold mb-4">Go deeper</h3>
              <div className="space-y-3 text-sm">
                <Link to="/learn/foundations/accounting/quality-of-earnings" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ChevronRight className="h-4 w-4 shrink-0" /> Quality of Earnings — Foundations
                </Link>
                <Link to="/learn/foundations/credit-analysis/altman-z-score" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ChevronRight className="h-4 w-4 shrink-0" /> Altman Z-Score and Distress Models — Foundations
                </Link>
                <Link to="/learn/foundations/accounting/reading-a-cash-flow-statement" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ChevronRight className="h-4 w-4 shrink-0" /> Reading a Cash Flow Statement — Foundations
                </Link>
              </div>
            </div>

            <Button variant="outline" onClick={restart} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Start over
            </Button>

            <NewsletterSignup source="learn-by-doing:spot-the-red-flags" />

            <p className="text-xs text-muted-foreground italic">
              All companies and figures in this module are hypothetical, created purely to illustrate common warning signs. Any resemblance to real companies is coincidental. Not investment advice.
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={caseIdx === 0} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          {isRevealed && caseIdx < total - 1 && (
            <Button onClick={next} className="flex items-center gap-1">
              Next case <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 flex items-center justify-between z-30">
        <p className="text-xs text-muted-foreground truncate">
          Case {caseIdx + 1}/{total} · {current.theme}
        </p>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {!isRevealed ? (
            <Button size="sm" onClick={reveal}>
              Reveal
            </Button>
          ) : (
            caseIdx < total - 1 && (
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
