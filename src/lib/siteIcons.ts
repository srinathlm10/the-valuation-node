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
};

/** One icon per Learn section card. */
export const LEARN_SECTION_ICONS: Record<string, LucideIcon> = {
  "/learn/foundations": BookOpen,
  "/learn/by-doing": MousePointerClick,
  "/learn/glossary": Library,
};
