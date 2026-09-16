// Site taxonomy: the structural sections and sub-sections every page belongs to
// (exclusive), the cross-cutting tag list (capped at 40), and the nine Concept
// Guide tracks. This is the single source of truth referenced by the content
// model (contentModel.ts), navigation, hubs, sitemap, and tag archives.
//
// Source: RESTRUCTURE-PLAN.md sections 1 and 7. Change the plan first, then this.

export type SectionId = "news" | "analysis" | "esg" | "vault" | "about" | "archive";

export interface Subsection {
  id: string;
  label: string;
  description: string;
}

export interface Section {
  id: SectionId;
  label: string;
  /** Landing path, e.g. /news */
  path: string;
  description: string;
  subsections: Subsection[];
  /** Shown in the primary navigation (Archive is footer-only). */
  inNav: boolean;
}

export const SECTIONS: Section[] = [
  {
    id: "news",
    label: "News & Trends",
    path: "/news",
    description: "What is moving Indian and global markets, and what the rules say.",
    inNav: true,
    subsections: [
      { id: "global-markets", label: "Global Markets", description: "Cross-border flows, rates, and commodities that reach Indian prices." },
      { id: "indian-economy", label: "Indian Economy", description: "Growth, inflation, the RBI, and the index constituents that carry the market." },
      { id: "corporate-updates", label: "Corporate Updates", description: "Results, capital raises, and corporate actions worth a second look." },
      { id: "policy-regulation", label: "Policy & Regulation", description: "SEBI, RBI, and exchange circulars, with the compliance calendar." },
      { id: "technology-ai", label: "Technology & AI", description: "Fintech, payments, and the tools reshaping finance work." },
    ],
  },
  {
    id: "analysis",
    label: "Insights & Analysis",
    path: "/analysis",
    description: "Original research on Indian companies, sectors, and valuation questions.",
    inNav: true,
    subsections: [
      { id: "company-analysis", label: "Company Analysis", description: "One company, read from its own statements." },
      { id: "industry-analysis", label: "Industry Analysis", description: "How a sector earns, and what breaks the usual valuation rules." },
      { id: "valuation-modeling", label: "Valuation & Financial Modeling", description: "DCF, multiples, cash flow, and the traps inside them." },
      { id: "business-strategy", label: "Business Strategy", description: "Moats, margins, and the choices that compound." },
      { id: "case-studies", label: "Case Studies", description: "Worked comparisons and post-mortems." },
      { id: "op-eds", label: "Op-Eds", description: "Positions argued, including this site's own editorial stance." },
    ],
  },
  {
    id: "esg",
    label: "ESG & Sustainability",
    path: "/esg",
    description: "Sustainable finance explained without the marketing.",
    inNav: true,
    subsections: [
      { id: "green-finance", label: "Green Finance", description: "Green bonds, sustainability-linked debt, and who pays for the transition." },
      { id: "corporate-governance", label: "Corporate Governance", description: "Boards, promoters, disclosures, and minority protection." },
      { id: "impact-investing", label: "Impact Investing", description: "Putting ESG into a valuation, and what it changes." },
      { id: "esg-ratings-frameworks", label: "ESG Ratings & Frameworks", description: "BRSR, SASB, ISSB, carbon accounting, and climate risk." },
    ],
  },
  {
    id: "vault",
    label: "The Vault",
    path: "/vault",
    description: "The reference library: glossary, formulas, concept guides, and interactive tools.",
    inNav: true,
    subsections: [
      { id: "glossary", label: "Financial Glossary", description: "Plain definitions, each with a formula where one exists and an Indian example." },
      { id: "formulas", label: "Key Formulas & Ratios", description: "Every ratio an analyst uses, with its formula on one line and how to read it." },
      { id: "guides", label: "Concept Guides", description: "Finance from first principles, in nine tracks." },
      { id: "interactive", label: "Model Templates & Interactive", description: "Calculators and step-by-step lessons on real numbers." },
    ],
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    description: "Who writes this, how, and the rules the site follows.",
    inNav: true,
    subsections: [
      { id: "site", label: "About the Site", description: "What The Valuation Node is for." },
      { id: "author", label: "About the Author", description: "Gajji Srinath." },
      { id: "philosophy", label: "Editorial Philosophy", description: "How research is done here, and where it might be wrong." },
      { id: "contact", label: "Contact", description: "How to reach the author." },
      { id: "privacy", label: "Privacy", description: "What this site collects and why." },
      { id: "disclaimer", label: "Disclaimer", description: "Not investment advice." },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    path: "/archive",
    description: "Earlier personal-finance articles, kept for the record.",
    inNav: false,
    subsections: [],
  },
];

export function getSection(id: SectionId): Section {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section: ${id}`);
  return s;
}

export function getSubsection(section: SectionId, sub: string): Subsection | undefined {
  return getSection(section).subsections.find((x) => x.id === sub);
}

/** Path of a section or sub-section landing. */
export function sectionPath(section: SectionId, sub?: string): string {
  const base = getSection(section).path;
  return sub ? `${base}/${sub}` : base;
}

// ── Concept Guide tracks (the nine former Foundations sections) ───────────────
export interface Track {
  id: string;
  label: string;
  description: string;
}

export const TRACKS: Track[] = [
  { id: "accounting", label: "Accounting", description: "Reading the three statements and the adjustments analysts make to them." },
  { id: "corporate-finance", label: "Corporate Finance", description: "Time value, cost of capital, capital structure, and capital budgeting." },
  { id: "valuation", label: "Valuation", description: "DCF, relative valuation, sum-of-the-parts, and the mistakes that recur." },
  { id: "financial-statement-analysis", label: "Financial Statement Analysis", description: "Profitability, liquidity, solvency, efficiency, and market ratios." },
  { id: "credit-analysis", label: "Credit Analysis", description: "Default risk, rating reports, distress models, bonds, and covenants." },
  { id: "markets-and-instruments", label: "Markets and Instruments", description: "Equities, debt, derivatives, funds, REITs, and a technical primer." },
  { id: "esg-and-sustainable-finance", label: "ESG and Sustainable Finance", description: "ESG fundamentals, reporting, carbon, green bonds, and climate risk." },
  { id: "fintech-and-digital-finance", label: "Fintech and Digital Finance", description: "Payments, digital lending, credit scoring, blockchain, security, and account aggregators." },
  { id: "data-and-tools", label: "Data and Tools", description: "Excel conventions, Python, SQL, and where to find Indian market data." },
];

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

// ── Tags (40, cross-cutting) ──────────────────────────────────────────────────
export const TAGS = [
  { id: "valuation", label: "Valuation" },
  { id: "dcf", label: "DCF" },
  { id: "relative-valuation", label: "Relative Valuation" },
  { id: "cost-of-capital", label: "Cost of Capital" },
  { id: "financial-statements", label: "Financial Statements" },
  { id: "cash-flow", label: "Cash Flow" },
  { id: "earnings-quality", label: "Earnings Quality" },
  { id: "red-flags", label: "Red Flags" },
  { id: "ratios", label: "Ratios" },
  { id: "profitability", label: "Profitability" },
  { id: "leverage", label: "Leverage" },
  { id: "liquidity", label: "Liquidity" },
  { id: "efficiency", label: "Efficiency" },
  { id: "growth", label: "Growth" },
  { id: "banking", label: "Banking" },
  { id: "credit-risk", label: "Credit Risk" },
  { id: "bonds", label: "Bonds" },
  { id: "equities", label: "Equities" },
  { id: "derivatives", label: "Derivatives" },
  { id: "funds-and-etfs", label: "Funds and ETFs" },
  { id: "technical-analysis", label: "Technical Analysis" },
  { id: "esg", label: "ESG" },
  { id: "green-finance", label: "Green Finance" },
  { id: "corporate-governance", label: "Corporate Governance" },
  { id: "climate-risk", label: "Climate Risk" },
  { id: "esg-reporting", label: "ESG Reporting" },
  { id: "fintech", label: "Fintech" },
  { id: "payments", label: "Payments" },
  { id: "digital-lending", label: "Digital Lending" },
  { id: "blockchain", label: "Blockchain" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "data-and-tools", label: "Data and Tools" },
  { id: "excel", label: "Excel" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "personal-finance", label: "Personal Finance" },
  { id: "taxation", label: "Taxation" },
  { id: "regulation", label: "Regulation" },
  { id: "macroeconomics", label: "Macroeconomics" },
  { id: "indian-markets", label: "Indian Markets" },
] as const;

export type TagId = (typeof TAGS)[number]["id"];

const TAG_LABELS = new Map<string, string>(TAGS.map((t) => [t.id, t.label]));

export function tagLabel(id: string): string {
  return TAG_LABELS.get(id) ?? id;
}

export function isTag(id: string): id is TagId {
  return TAG_LABELS.has(id);
}

export function tagPath(id: string): string {
  return `/tags/${id}`;
}
