// Central icon registry: ONE lucide icon per Foundations category, per Tool,
// and per Learn section, used consistently everywhere those things appear
// (sidebars, cards, breadcrumb eyebrows). Change an assignment here, never
// inline in a component.

import {
  FileSpreadsheet,
  Landmark,
  Scale,
  ChartBar,
  ShieldCheck,
  ChartCandlestick,
  Leaf,
  Smartphone,
  Database,
  SlidersHorizontal,
  TrendingUp,
  CalendarClock,
  ChartLine,
  Hourglass,
  Layers,
  Timer,
  CreditCard,
  Gauge,
  BookOpen,
  MousePointerClick,
  Library,
  PiggyBank,
  Droplets,
  Target,
  ChartBarIncreasing,
  Banknote,
  ScrollText,
  Gavel,
  ChartPie,
  Receipt,
  GraduationCap,
  Tag,
  type LucideIcon,
} from "lucide-react";

/** One icon per Foundations section (keys = section slugs in FOUNDATIONS_TREE). */
export const FOUNDATIONS_SECTION_ICONS: Record<string, LucideIcon> = {
  "accounting": FileSpreadsheet,
  "corporate-finance": Landmark,
  "valuation": Scale,
  "financial-statement-analysis": ChartBar,
  "credit-analysis": ShieldCheck,
  "markets-and-instruments": ChartCandlestick,
  "esg-and-sustainable-finance": Leaf,
  "fintech-and-digital-finance": Smartphone,
  "data-and-tools": Database,
};

/** One icon per Tool (keys = tool slugs used in /tools routes). */
export const TOOL_ICONS: Record<string, LucideIcon> = {
  "dcf-sensitivity": SlidersHorizontal,
  "cagr": TrendingUp,
  "sip": CalendarClock,
  "future-value": ChartLine,
  "present-value": Hourglass,
  "compound-interest": Layers,
  "rule-of-72": Timer,
  "emi": CreditCard,
  "inflation-adjusted-returns": Gauge,
  "step-up-sip": ChartBarIncreasing,
  "goal-sip": Target,
  "loan-prepayment": Banknote,
  "wacc": Scale,
};

/** One icon per Learn section card. */
export const LEARN_SECTION_ICONS: Record<string, LucideIcon> = {
  "/learn/foundations": BookOpen,
  "/learn/by-doing": MousePointerClick,
  "/learn/glossary": Library,
};

/** One icon per Glossary category (keys = category names in the definitions data). */
export const GLOSSARY_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Investment Planning": PiggyBank,
  "Profitability Ratios": TrendingUp,
  "Valuation Ratios": Scale,
  "Liquidity Ratios": Droplets,
  "Solvency Ratios": ShieldCheck,
  "Efficiency Ratios": Gauge,
  "Technical Analysis": ChartCandlestick,
  "Regulatory Compliance": Gavel,
  "Risk & Portfolio": ChartPie,
  "Taxation": Receipt,
  "Fundamentals": BookOpen,
  "Mutual Funds": Layers,
  "Indices": ChartLine,
  "Basics of Stock Market": GraduationCap,
  "Credit & Debt": ScrollText,
  "Macroeconomics": Landmark,
  "ESG & Governance": Leaf,
  "Fintech": Smartphone,
};

/** Fallback for categories without an assignment. */
export const GLOSSARY_FALLBACK_ICON: LucideIcon = Tag;
