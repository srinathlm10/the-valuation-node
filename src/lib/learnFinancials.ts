// Shared financial dataset for Learn-by-Doing modules:
// "Read an Income Statement", "Compute Ratios", and "Compare Two Companies".
//
// All figures are APPROXIMATE, rounded, illustrative FY24 numbers for educational
// use only. They are internally consistent so ratios compute cleanly, but they are
// NOT precise reported financials and must not be used as investment data.

export interface FinancialCompany {
  slug: string;
  name: string;
  ticker: string;
  sector: string;
  sectorKey: string; // used to pair peers for comparison
  description: string;
  fy: string;

  // Income statement (₹ Cr)
  revenue: number;
  cogs: number; // cost of materials / goods sold
  employeeCost: number;
  otherExpenses: number;
  depreciation: number;
  financeCosts: number;
  otherIncome: number;
  taxRate: number; // effective tax rate applied to PBT

  // Balance sheet (₹ Cr)
  totalAssets: number;
  currentAssets: number;
  inventory: number;
  receivables: number;
  cash: number;
  currentLiabilities: number;
  totalDebt: number;
  equity: number;

  // Market
  shares: number; // crore shares
  price: number; // illustrative price per share (₹)

  // Prior year (for growth)
  prevRevenue: number;
  prevPat: number;
}

export interface DerivedFinancials {
  grossProfit: number;
  ebitda: number;
  ebit: number;
  pbt: number;
  tax: number;
  pat: number;
  netDebt: number;

  grossMargin: number;
  ebitdaMargin: number;
  ebitMargin: number;
  netMargin: number;

  roe: number;
  roce: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  interestCoverage: number;
  assetTurnover: number;
  inventoryDays: number;
  receivableDays: number;

  eps: number;
  pe: number;
  revenueGrowth: number;
  patGrowth: number;
}

export function derive(c: FinancialCompany): DerivedFinancials {
  const grossProfit = c.revenue - c.cogs;
  const ebitda = c.revenue - c.cogs - c.employeeCost - c.otherExpenses;
  const ebit = ebitda - c.depreciation;
  const pbt = ebit + c.otherIncome - c.financeCosts;
  const tax = pbt * c.taxRate;
  const pat = pbt - tax;
  const netDebt = c.totalDebt - c.cash;
  const capitalEmployed = c.equity + c.totalDebt;
  const eps = pat / c.shares;

  return {
    grossProfit,
    ebitda,
    ebit,
    pbt,
    tax,
    pat,
    netDebt,
    grossMargin: grossProfit / c.revenue,
    ebitdaMargin: ebitda / c.revenue,
    ebitMargin: ebit / c.revenue,
    netMargin: pat / c.revenue,
    roe: pat / c.equity,
    roce: ebit / capitalEmployed,
    currentRatio: c.currentAssets / c.currentLiabilities,
    quickRatio: (c.currentAssets - c.inventory) / c.currentLiabilities,
    debtToEquity: c.totalDebt / c.equity,
    interestCoverage: c.financeCosts > 0 ? ebit / c.financeCosts : Infinity,
    assetTurnover: c.revenue / c.totalAssets,
    inventoryDays: c.cogs > 0 ? (c.inventory / c.cogs) * 365 : 0,
    receivableDays: (c.receivables / c.revenue) * 365,
    eps,
    pe: eps > 0 ? c.price / eps : Infinity,
    revenueGrowth: c.revenue / c.prevRevenue - 1,
    patGrowth: c.prevPat !== 0 ? c.pat / c.prevPat - 1 : Infinity,
  };
}

export const FINANCIAL_COMPANIES: FinancialCompany[] = [
  // ── IT Services ──────────────────────────────────────────────────────────
  {
    slug: "tcs",
    name: "Tata Consultancy Services",
    ticker: "TCS",
    sector: "IT Services",
    sectorKey: "it",
    description:
      "India's largest IT services company. Asset-light, people-heavy, near debt-free, with industry-leading margins and cash generation.",
    fy: "FY24",
    revenue: 240000,
    cogs: 10000,
    employeeCost: 130000,
    otherExpenses: 40000,
    depreciation: 5000,
    financeCosts: 800,
    otherIncome: 4000,
    taxRate: 0.25,
    totalAssets: 140000,
    currentAssets: 95000,
    inventory: 50,
    receivables: 45000,
    cash: 45000,
    currentLiabilities: 40000,
    totalDebt: 8000,
    equity: 90000,
    shares: 362,
    price: 3900,
    prevRevenue: 225000,
    prevPat: 42000,
  },
  {
    slug: "infosys",
    name: "Infosys",
    ticker: "INFY",
    sector: "IT Services",
    sectorKey: "it",
    description:
      "India's second-largest IT services firm. Similar asset-light model to TCS, with strong cash flows and slightly lower margins.",
    fy: "FY24",
    revenue: 154000,
    cogs: 8000,
    employeeCost: 82000,
    otherExpenses: 30000,
    depreciation: 4500,
    financeCosts: 500,
    otherIncome: 3000,
    taxRate: 0.26,
    totalAssets: 120000,
    currentAssets: 78000,
    inventory: 50,
    receivables: 30000,
    cash: 30000,
    currentLiabilities: 35000,
    totalDebt: 7000,
    equity: 78000,
    shares: 415,
    price: 1550,
    prevRevenue: 146000,
    prevPat: 24100,
  },

  // ── FMCG ─────────────────────────────────────────────────────────────────
  {
    slug: "hindustan-unilever",
    name: "Hindustan Unilever",
    ticker: "HINDUNILVR",
    sector: "FMCG",
    sectorKey: "fmcg",
    description:
      "India's largest FMCG company. Vast distribution, strong brands, high return on capital, and a premium market valuation.",
    fy: "FY24",
    revenue: 61000,
    cogs: 30000,
    employeeCost: 3000,
    otherExpenses: 13000,
    depreciation: 1200,
    financeCosts: 300,
    otherIncome: 700,
    taxRate: 0.25,
    totalAssets: 70000,
    currentAssets: 15000,
    inventory: 4000,
    receivables: 3000,
    cash: 5000,
    currentLiabilities: 12000,
    totalDebt: 1500,
    equity: 50000,
    shares: 235,
    price: 2400,
    prevRevenue: 59000,
    prevPat: 10100,
  },
  {
    slug: "itc",
    name: "ITC",
    ticker: "ITC",
    sector: "FMCG",
    sectorKey: "fmcg",
    description:
      "Diversified conglomerate anchored by a high-margin cigarettes business, with FMCG, hotels, paper, and agri segments. Very high margins and near debt-free.",
    fy: "FY24",
    revenue: 70000,
    cogs: 30000,
    employeeCost: 5000,
    otherExpenses: 9000,
    depreciation: 2000,
    financeCosts: 100,
    otherIncome: 3000,
    taxRate: 0.25,
    totalAssets: 100000,
    currentAssets: 35000,
    inventory: 12000,
    receivables: 3000,
    cash: 8000,
    currentLiabilities: 15000,
    totalDebt: 500,
    equity: 75000,
    shares: 1250,
    price: 450,
    prevRevenue: 68000,
    prevPat: 18700,
  },

  // ── Paints ───────────────────────────────────────────────────────────────
  {
    slug: "asian-paints",
    name: "Asian Paints",
    ticker: "ASIANPAINT",
    sector: "Paints",
    sectorKey: "paints",
    description:
      "India's dominant decorative paints company with ~55% market share, deep distribution, and best-in-class return on equity.",
    fy: "FY24",
    revenue: 35000,
    cogs: 20000,
    employeeCost: 2000,
    otherExpenses: 7000,
    depreciation: 900,
    financeCosts: 300,
    otherIncome: 500,
    taxRate: 0.25,
    totalAssets: 22000,
    currentAssets: 14000,
    inventory: 6000,
    receivables: 3500,
    cash: 1500,
    currentLiabilities: 8000,
    totalDebt: 2000,
    equity: 13000,
    shares: 95.9,
    price: 2400,
    prevRevenue: 34500,
    prevPat: 4100,
  },
  {
    slug: "berger-paints",
    name: "Berger Paints",
    ticker: "BERGEPAINT",
    sector: "Paints",
    sectorKey: "paints",
    description:
      "India's second-largest paints company. Faster-growing than the leader but at smaller scale and slightly lower margins.",
    fy: "FY24",
    revenue: 11000,
    cogs: 6500,
    employeeCost: 700,
    otherExpenses: 2200,
    depreciation: 300,
    financeCosts: 100,
    otherIncome: 150,
    taxRate: 0.25,
    totalAssets: 8000,
    currentAssets: 5000,
    inventory: 2200,
    receivables: 1300,
    cash: 500,
    currentLiabilities: 3000,
    totalDebt: 800,
    equity: 4500,
    shares: 116.6,
    price: 580,
    prevRevenue: 10500,
    prevPat: 860,
  },

  // ── Automobiles ──────────────────────────────────────────────────────────
  {
    slug: "maruti-suzuki",
    name: "Maruti Suzuki",
    ticker: "MARUTI",
    sector: "Automobiles",
    sectorKey: "auto",
    description:
      "India's largest passenger vehicle maker. Near debt-free with a large treasury, thin operating margins typical of autos, boosted by treasury income.",
    fy: "FY24",
    revenue: 141000,
    cogs: 105000,
    employeeCost: 5000,
    otherExpenses: 18000,
    depreciation: 3000,
    financeCosts: 200,
    otherIncome: 5000,
    taxRate: 0.25,
    totalAssets: 95000,
    currentAssets: 30000,
    inventory: 4000,
    receivables: 3500,
    cash: 3000,
    currentLiabilities: 25000,
    totalDebt: 500,
    equity: 72000,
    shares: 31.4,
    price: 12000,
    prevRevenue: 118000,
    prevPat: 8200,
  },
  {
    slug: "tata-motors",
    name: "Tata Motors",
    ticker: "TATAMOTORS",
    sector: "Automobiles",
    sectorKey: "auto",
    description:
      "Global automaker (including JLR) mid-turnaround. Highly cyclical, capital-intensive, and carrying significant debt, but rapidly improving profitability.",
    fy: "FY24",
    revenue: 438000,
    cogs: 260000,
    employeeCost: 45000,
    otherExpenses: 73000,
    depreciation: 28000,
    financeCosts: 10000,
    otherIncome: 3000,
    taxRate: 0.28,
    totalAssets: 380000,
    currentAssets: 150000,
    inventory: 55000,
    receivables: 22000,
    cash: 40000,
    currentLiabilities: 160000,
    totalDebt: 120000,
    equity: 90000,
    shares: 383,
    price: 950,
    prevRevenue: 346000,
    prevPat: 2700,
  },
];

export function getCompany(slug: string): FinancialCompany | undefined {
  return FINANCIAL_COMPANIES.find((c) => c.slug === slug);
}

// Peer pairs (same sector) for the comparison module.
export interface CompanyPair {
  key: string;
  label: string;
  sector: string;
  a: string; // slug
  b: string; // slug
}

export const COMPANY_PAIRS: CompanyPair[] = [
  { key: "auto", label: "Maruti Suzuki vs Tata Motors", sector: "Automobiles", a: "maruti-suzuki", b: "tata-motors" },
  { key: "it", label: "TCS vs Infosys", sector: "IT Services", a: "tcs", b: "infosys" },
  { key: "fmcg", label: "Hindustan Unilever vs ITC", sector: "FMCG", a: "hindustan-unilever", b: "itc" },
  { key: "paints", label: "Asian Paints vs Berger Paints", sector: "Paints", a: "asian-paints", b: "berger-paints" },
];

// ── Formatting helpers ──────────────────────────────────────────────────────

export function fmtCr(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}₹${Math.round(Math.abs(n)).toLocaleString("en-IN")} Cr`;
}

export function fmtRs(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function fmtPct(n: number, dp = 1): string {
  if (!isFinite(n)) return "—";
  return `${(n * 100).toFixed(dp)}%`;
}

export function fmtX(n: number, dp = 1): string {
  if (!isFinite(n)) return "—";
  return `${n.toFixed(dp)}×`;
}

export function fmtDays(n: number): string {
  return `${Math.round(n)} days`;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof (window as any).umami !== "undefined") {
    (window as any).umami.track(event, props);
  }
}
