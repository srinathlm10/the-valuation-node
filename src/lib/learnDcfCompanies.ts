export interface LearnCompany {
  slug: string;
  name: string;
  ticker: string;
  sector: string;
  description: string;
  baseRevenue: number;
  historicalRevenue: { fy: string; revenue: number }[];
  historicalMargin: number;
  cagr3yr: number;
  cagr5yr: number;
  netDebt: number;
  sharesOutstanding: number;
  currentPrice: number;
}

// Approximate FY24 figures — for educational use only, not investment data.
export const LEARN_COMPANIES: LearnCompany[] = [
  {
    slug: "asian-paints",
    name: "Asian Paints",
    ticker: "ASIANPAINT",
    sector: "Paints & Coatings",
    description:
      "India's largest paint company with ~55% market share in decorative paints. Known for strong distribution, brand loyalty, and a growing home décor segment.",
    baseRevenue: 35000,
    historicalRevenue: [
      { fy: "FY22", revenue: 26000 },
      { fy: "FY23", revenue: 34000 },
      { fy: "FY24", revenue: 35000 },
    ],
    historicalMargin: 0.17,
    cagr3yr: 0.10,
    cagr5yr: 0.13,
    netDebt: -2000,
    sharesOutstanding: 95.9,
    currentPrice: 2400,
  },
  {
    slug: "pidilite",
    name: "Pidilite Industries",
    ticker: "PIDILITIND",
    sector: "Adhesives & Sealants",
    description:
      "Market leader in adhesives and construction chemicals. Fevicol commands near-monopoly mindshare in B2C; also strong in construction chemicals (Dr. Fixit) and industrial adhesives.",
    baseRevenue: 12500,
    historicalRevenue: [
      { fy: "FY22", revenue: 10200 },
      { fy: "FY23", revenue: 12600 },
      { fy: "FY24", revenue: 12500 },
    ],
    historicalMargin: 0.21,
    cagr3yr: 0.10,
    cagr5yr: 0.13,
    netDebt: -2500,
    sharesOutstanding: 50.8,
    currentPrice: 2900,
  },
  {
    slug: "marico",
    name: "Marico",
    ticker: "MARICO",
    sector: "FMCG - Personal Care",
    description:
      "Owner of Parachute (coconut oil), Saffola, and Hair & Care. About 24% of revenue comes from international markets. A mature India business with ongoing premiumisation.",
    baseRevenue: 9800,
    historicalRevenue: [
      { fy: "FY22", revenue: 8900 },
      { fy: "FY23", revenue: 9800 },
      { fy: "FY24", revenue: 9800 },
    ],
    historicalMargin: 0.18,
    cagr3yr: 0.07,
    cagr5yr: 0.09,
    netDebt: -800,
    sharesOutstanding: 129.4,
    currentPrice: 680,
  },
  {
    slug: "polycab",
    name: "Polycab India",
    ticker: "POLYCAB",
    sector: "Cables & Wires / Electricals",
    description:
      "India's largest cables and wires manufacturer. Key beneficiary of infrastructure and construction growth. Also building a fast-growing FMEG segment (fans, lights, switches).",
    baseRevenue: 18500,
    historicalRevenue: [
      { fy: "FY22", revenue: 12700 },
      { fy: "FY23", revenue: 14700 },
      { fy: "FY24", revenue: 18500 },
    ],
    historicalMargin: 0.12,
    cagr3yr: 0.13,
    cagr5yr: 0.18,
    netDebt: -1500,
    sharesOutstanding: 15.0,
    currentPrice: 7200,
  },
  {
    slug: "britannia",
    name: "Britannia Industries",
    ticker: "BRITANNIA",
    sector: "FMCG - Biscuits & Bakery",
    description:
      "India's largest biscuits company with Good Day, Marie Gold, and NutriChoice. Strong rural distribution push underway. Shifting mix towards premium products.",
    baseRevenue: 16500,
    historicalRevenue: [
      { fy: "FY22", revenue: 13800 },
      { fy: "FY23", revenue: 16300 },
      { fy: "FY24", revenue: 16500 },
    ],
    historicalMargin: 0.18,
    cagr3yr: 0.10,
    cagr5yr: 0.11,
    netDebt: 200,
    sharesOutstanding: 24.1,
    currentPrice: 5500,
  },
  {
    slug: "titan",
    name: "Titan Company",
    ticker: "TITAN",
    sector: "Consumer Discretionary - Watches & Jewellery",
    description:
      "Conglomerate across jewellery (Tanishq), watches (Titan, Fastrack), and eyewear. Jewellery drives ~90% of revenue. Strong brand moat and expanding international presence.",
    baseRevenue: 51000,
    historicalRevenue: [
      { fy: "FY22", revenue: 28800 },
      { fy: "FY23", revenue: 40600 },
      { fy: "FY24", revenue: 51000 },
    ],
    historicalMargin: 0.11,
    cagr3yr: 0.21,
    cagr5yr: 0.20,
    netDebt: -4000,
    sharesOutstanding: 88.9,
    currentPrice: 3400,
  },
  {
    slug: "page-industries",
    name: "Page Industries",
    ticker: "PAGEIND",
    sector: "Garments - Innerwear",
    description:
      "Exclusive licensee of Jockey in India, Sri Lanka, and UAE. Asset-light model, high ROCE, strong brand positioning in innerwear and leisurewear. Low volumes but high realisation.",
    baseRevenue: 4300,
    historicalRevenue: [
      { fy: "FY22", revenue: 3500 },
      { fy: "FY23", revenue: 4400 },
      { fy: "FY24", revenue: 4300 },
    ],
    historicalMargin: 0.18,
    cagr3yr: 0.10,
    cagr5yr: 0.13,
    netDebt: -200,
    sharesOutstanding: 1.12,
    currentPrice: 42000,
  },
];
