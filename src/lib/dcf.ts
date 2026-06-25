export interface DcfInputs {
  baseRevenue: number;       // ₹ crore
  revenueGrowth: number;     // decimal (0.12 = 12%)
  operatingMargin: number;   // decimal
  taxRate: number;           // decimal
  wacc: number;              // decimal
  terminalGrowth: number;    // decimal
  forecastYears: number;     // integer 1–15
  netDebt: number;           // ₹ crore (negative = net cash position)
  sharesOutstanding: number; // crore shares (e.g. 95.8 = 958 million shares)
}

export interface YearData {
  year: number;
  revenue: number;
  ebit: number;
  nopat: number;
  fcf: number;
  discountFactor: number;
  pv: number;
}

export interface DcfResult {
  yearlyData: YearData[];
  terminalFcf: number;
  terminalValue: number;
  pvTerminalValue: number;
  sumPvCashFlows: number;
  enterpriseValue: number;
  equityValue: number;
  equityValuePerShare: number;
  terminalValuePct: number;
}

/** Column deltas for WACC: left = lowest WACC = highest value */
export const WACC_DELTAS = [-0.02, -0.01, 0, 0.01, 0.02] as const;

/** Row deltas for terminal growth: top = highest TG = highest value */
export const TG_DELTAS = [0.02, 0.01, 0, -0.01, -0.02] as const;

/**
 * Two-stage DCF model. FCF is simplified as NOPAT (EBIT after tax) — a full
 * model would subtract capex and working-capital changes.
 *
 * Returns null when WACC ≤ terminal growth (Gordon Growth denominator = 0 or negative).
 */
export function calculateDcf(inputs: DcfInputs): DcfResult | null {
  const {
    baseRevenue,
    revenueGrowth,
    operatingMargin,
    taxRate,
    wacc,
    terminalGrowth,
    forecastYears,
    netDebt,
    sharesOutstanding,
  } = inputs;

  if (wacc <= terminalGrowth) return null;
  if (sharesOutstanding <= 0) return null;
  if (forecastYears < 1 || forecastYears > 15) return null;

  let revenue = baseRevenue;
  const yearlyData: YearData[] = [];

  for (let t = 1; t <= forecastYears; t++) {
    revenue *= 1 + revenueGrowth;
    const ebit = revenue * operatingMargin;
    const nopat = ebit * (1 - taxRate);
    const fcf = nopat;
    const discountFactor = 1 / (1 + wacc) ** t;
    const pv = fcf * discountFactor;
    yearlyData.push({ year: t, revenue, ebit, nopat, fcf, discountFactor, pv });
  }

  const lastFcf = yearlyData[yearlyData.length - 1].fcf;
  const terminalFcf = lastFcf * (1 + terminalGrowth);
  const terminalValue = terminalFcf / (wacc - terminalGrowth);
  const terminalDiscount = 1 / (1 + wacc) ** forecastYears;
  const pvTerminalValue = terminalValue * terminalDiscount;

  const sumPvCashFlows = yearlyData.reduce((s, y) => s + y.pv, 0);
  const enterpriseValue = sumPvCashFlows + pvTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const equityValuePerShare = equityValue / sharesOutstanding;
  const terminalValuePct = pvTerminalValue / enterpriseValue;

  return {
    yearlyData,
    terminalFcf,
    terminalValue,
    pvTerminalValue,
    sumPvCashFlows,
    enterpriseValue,
    equityValue,
    equityValuePerShare,
    terminalValuePct,
  };
}

/**
 * Builds a 5×5 sensitivity grid varying WACC and terminal growth by ±2% and ±1%.
 * matrix[row][col] where row = TG_DELTAS index, col = WACC_DELTAS index.
 * Center cell [2][2] is the base case.
 */
export function calculateSensitivity(base: DcfInputs): (number | null)[][] {
  return TG_DELTAS.map((dTg) =>
    WACC_DELTAS.map((dWacc) => {
      const r = calculateDcf({
        ...base,
        wacc: base.wacc + dWacc,
        terminalGrowth: base.terminalGrowth + dTg,
      });
      return r?.equityValuePerShare ?? null;
    }),
  );
}
