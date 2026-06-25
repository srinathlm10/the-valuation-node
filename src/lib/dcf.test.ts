import { describe, it, expect } from "vitest";
import { calculateDcf, calculateSensitivity } from "./dcf";

const BASE: Parameters<typeof calculateDcf>[0] = {
  baseRevenue: 10_000,
  revenueGrowth: 0.15,
  operatingMargin: 0.20,
  taxRate: 0.25,
  wacc: 0.12,
  terminalGrowth: 0.045,
  forecastYears: 5,
  netDebt: 0,
  sharesOutstanding: 100,
};

describe("calculateDcf", () => {
  it("returns a result for standard inputs", () => {
    const r = calculateDcf(BASE);
    expect(r).not.toBeNull();
    expect(r!.equityValuePerShare).toBeGreaterThan(0);
    expect(r!.yearlyData).toHaveLength(5);
  });

  it("EV equals sumPvCashFlows + pvTerminalValue", () => {
    const r = calculateDcf(BASE)!;
    expect(r.enterpriseValue).toBeCloseTo(r.sumPvCashFlows + r.pvTerminalValue, 1);
  });

  it("returns null when wacc equals terminalGrowth (Gordon Growth undefined)", () => {
    expect(calculateDcf({ ...BASE, wacc: 0.04, terminalGrowth: 0.04 })).toBeNull();
  });

  it("returns null when wacc < terminalGrowth", () => {
    expect(calculateDcf({ ...BASE, wacc: 0.03, terminalGrowth: 0.05 })).toBeNull();
  });

  it("returns null for zero or negative sharesOutstanding", () => {
    expect(calculateDcf({ ...BASE, sharesOutstanding: 0 })).toBeNull();
    expect(calculateDcf({ ...BASE, sharesOutstanding: -10 })).toBeNull();
  });

  it("higher WACC produces lower per-share value", () => {
    const lo = calculateDcf({ ...BASE, wacc: 0.09 })!;
    const hi = calculateDcf({ ...BASE, wacc: 0.22 })!;
    expect(lo.equityValuePerShare).toBeGreaterThan(hi.equityValuePerShare);
  });

  it("net cash position (negative netDebt) increases equity value per share", () => {
    const noDebt = calculateDcf(BASE)!;
    const netCash = calculateDcf({ ...BASE, netDebt: -5_000 })!;
    expect(netCash.equityValuePerShare).toBeGreaterThan(noDebt.equityValuePerShare);
  });

  it("zero revenue growth: all years have same revenue as baseRevenue", () => {
    const r = calculateDcf({ ...BASE, revenueGrowth: 0 })!;
    r.yearlyData.forEach((y) => expect(y.revenue).toBeCloseTo(BASE.baseRevenue, 0));
  });

  it("negative revenue growth still produces a valid result", () => {
    const r = calculateDcf({ ...BASE, revenueGrowth: -0.05 });
    expect(r).not.toBeNull();
    const yr5 = r!.yearlyData[4].revenue;
    expect(yr5).toBeLessThan(BASE.baseRevenue);
  });

  it("handles 10-year forecast period", () => {
    const r = calculateDcf({ ...BASE, forecastYears: 10 })!;
    expect(r.yearlyData).toHaveLength(10);
  });

  it("terminalValuePct is a fraction between 0 and 1", () => {
    const r = calculateDcf(BASE)!;
    expect(r.terminalValuePct).toBeGreaterThan(0);
    expect(r.terminalValuePct).toBeLessThan(1);
  });
});

describe("calculateSensitivity", () => {
  it("returns a 5×5 grid", () => {
    const grid = calculateSensitivity(BASE);
    expect(grid).toHaveLength(5);
    grid.forEach((row) => expect(row).toHaveLength(5));
  });

  it("center cell [2][2] matches base calculateDcf result", () => {
    const grid = calculateSensitivity(BASE);
    const base = calculateDcf(BASE)!;
    expect(grid[2][2]).toBeCloseTo(base.equityValuePerShare, 1);
  });

  it("top-left cell (highest TG, lowest WACC) has highest value", () => {
    const grid = calculateSensitivity(BASE);
    const topLeft = grid[0][0]!;
    const center = grid[2][2]!;
    const bottomRight = grid[4][4];
    expect(topLeft).toBeGreaterThan(center);
    if (bottomRight !== null) expect(center).toBeGreaterThan(bottomRight);
  });
});
