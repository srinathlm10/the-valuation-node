// Central cross-linking data: which glossary categories belong to which
// Foundations section, which Foundations topic teaches each glossary category,
// which research category fits each Foundations section, and which tools are
// siblings of each other. All related-content navigation derives from here.

import definitions from "@/data/definitions.json";

export function termSlug(term: string): string {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── Foundations section -> glossary categories ──────────────────────────────
const SECTION_TO_GLOSSARY_CATEGORIES: Record<string, string[]> = {
  "accounting": ["Fundamentals"],
  "corporate-finance": ["Fundamentals", "Investment Planning"],
  "valuation": ["Valuation Ratios"],
  "financial-statement-analysis": [
    "Profitability Ratios",
    "Liquidity Ratios",
    "Solvency Ratios",
    "Efficiency Ratios",
  ],
  "credit-analysis": ["Solvency Ratios", "Credit & Debt"],
  "markets-and-instruments": ["Basics of Stock Market", "Indices", "Technical Analysis", "Mutual Funds", "Macroeconomics"],
  "esg-and-sustainable-finance": ["ESG & Governance"],
  "fintech-and-digital-finance": ["Fintech"],
};

export interface GlossaryTermLink {
  term: string;
  slug: string;
}

/** A handful of glossary terms relevant to a Foundations section (empty for sections without a mapped category). */
export function getGlossaryTermsForSection(section: string, limit = 6): GlossaryTermLink[] {
  const categories = SECTION_TO_GLOSSARY_CATEGORIES[section];
  if (!categories) return [];
  return (definitions as Array<{ term: string; category?: string }>)
    .filter((d) => d.category && categories.includes(d.category))
    .sort((a, b) => a.term.localeCompare(b.term))
    .slice(0, limit)
    .map((d) => ({ term: d.term, slug: termSlug(d.term) }));
}

// ── Glossary category -> the Foundations topic that teaches it ──────────────
export const GLOSSARY_CATEGORY_TO_TOPIC: Record<string, { href: string; label: string }> = {
  "Profitability Ratios": { href: "/learn/foundations/financial-statement-analysis/profitability-ratios", label: "Profitability Ratios" },
  "Valuation Ratios": { href: "/learn/foundations/financial-statement-analysis/market-ratios", label: "Market Ratios" },
  "Liquidity Ratios": { href: "/learn/foundations/financial-statement-analysis/liquidity-ratios", label: "Liquidity Ratios" },
  "Solvency Ratios": { href: "/learn/foundations/financial-statement-analysis/solvency-ratios", label: "Solvency Ratios" },
  "Efficiency Ratios": { href: "/learn/foundations/financial-statement-analysis/efficiency-ratios", label: "Efficiency Ratios" },
  "Technical Analysis": { href: "/learn/foundations/markets-and-instruments/technical-analysis-primer", label: "Technical Analysis Primer" },
  "Investment Planning": { href: "/learn/foundations/corporate-finance/time-value-of-money", label: "Time Value of Money" },
  "Risk & Portfolio": { href: "/learn/foundations/markets-and-instruments/mutual-funds-etfs-aifs", label: "Mutual Funds, ETFs, AIFs" },
  "Fundamentals": { href: "/learn/foundations/accounting/reading-an-income-statement", label: "Reading an Income Statement" },
  "Mutual Funds": { href: "/learn/foundations/markets-and-instruments/mutual-funds-etfs-aifs", label: "Mutual Funds, ETFs, AIFs" },
  "Indices": { href: "/learn/foundations/markets-and-instruments/equities", label: "Equities (NSE, BSE, IPO Process)" },
  "Basics of Stock Market": { href: "/learn/foundations/markets-and-instruments/equities", label: "Equities (NSE, BSE, IPO Process)" },
  "Regulatory Compliance": { href: "/learn/foundations/markets-and-instruments/equities", label: "Equities (NSE, BSE, IPO Process)" },
  "Credit & Debt": { href: "/learn/foundations/credit-analysis/bond-pricing-and-yields", label: "Bond Pricing and Yields" },
  "Macroeconomics": { href: "/learn/foundations/markets-and-instruments/debt-markets-and-yield-curves", label: "Debt Markets and Yield Curves" },
  "ESG & Governance": { href: "/learn/foundations/esg-and-sustainable-finance/esg-fundamentals", label: "ESG Fundamentals" },
  "Fintech": { href: "/learn/foundations/fintech-and-digital-finance/payments-landscape", label: "Payments Landscape" },
};

// ── Foundations section -> best-fitting research category ───────────────────
export const ARTICLE_CATEGORY_BY_SECTION: Record<string, string> = {
  "accounting": "Valuation",
  "corporate-finance": "Valuation",
  "valuation": "Valuation",
  "financial-statement-analysis": "Valuation",
  "credit-analysis": "Credit",
  "markets-and-instruments": "Valuation",
  "esg-and-sustainable-finance": "ESG",
  "fintech-and-digital-finance": "Fintech",
  "data-and-tools": "Methodology",
};

// ── Tools directory for sibling suggestions ─────────────────────────────────
export interface ToolEntry {
  slug: string;
  label: string;
  group: string;
}

export const TOOL_DIRECTORY: ToolEntry[] = [
  { slug: "dcf-sensitivity", label: "DCF Sensitivity Calculator", group: "Valuation" },
  { slug: "cagr", label: "CAGR Calculator", group: "Valuation" },
  { slug: "sip", label: "SIP Calculator", group: "Investment Planning" },
  { slug: "future-value", label: "Future Value Calculator", group: "Investment Planning" },
  { slug: "present-value", label: "Present Value Calculator", group: "Investment Planning" },
  { slug: "compound-interest", label: "Compound Interest Calculator", group: "Investment Planning" },
  { slug: "rule-of-72", label: "Rule of 72", group: "Investment Planning" },
  { slug: "emi", label: "EMI Calculator", group: "Loans" },
  { slug: "inflation-adjusted-returns", label: "Inflation-Adjusted Returns Calculator", group: "Risk" },
  { slug: "wacc", label: "WACC Calculator", group: "Valuation" },
  { slug: "step-up-sip", label: "Step-Up SIP Calculator", group: "Investment Planning" },
  { slug: "goal-sip", label: "Goal SIP Calculator", group: "Investment Planning" },
  { slug: "loan-prepayment", label: "Loan Prepayment Calculator", group: "Loans" },
];

/** Sibling tools: same group first, then the rest in directory order. */
export function getRelatedTools(slug: string, limit = 3): ToolEntry[] {
  const current = TOOL_DIRECTORY.find((t) => t.slug === slug);
  const others = TOOL_DIRECTORY.filter((t) => t.slug !== slug);
  if (!current) return others.slice(0, limit);
  return [
    ...others.filter((t) => t.group === current.group),
    ...others.filter((t) => t.group !== current.group),
  ].slice(0, limit);
}
