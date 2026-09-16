// "Latest Updates" feed for the home-page sidebar (prototype .recent-list).
// Vault entries carry no publish date of their own, so additions are logged
// here explicitly with the date they landed; research articles are pulled in
// automatically from their front-matter dates. Newest first. Append a line
// when a term, formula, guide, or tool is added.

export interface RecentUpdate {
  /** ISO date the item was added or last revised. */
  date: string;
  /** "Term added", "Formula added", "Guide updated", ... */
  label: string;
  /** Site path of the item. */
  path: string;
  /** Text shown as the link. */
  title: string;
  /** Where it lives, shown after the date: "The Vault", "Insights & Analysis", ... */
  section: string;
}

export const RECENT_UPDATES: RecentUpdate[] = [
  { date: "2026-09-15", label: "Formula added", path: "/vault/formulas/promoter-holding", title: "Promoter Holding", section: "The Vault" },
  { date: "2026-09-15", label: "Formula added", path: "/vault/formulas/net-debt-to-ebitda", title: "Net Debt to EBITDA", section: "The Vault" },
  { date: "2026-09-15", label: "Term added", path: "/vault/glossary/casa-ratio", title: "CASA Ratio", section: "The Vault" },
  { date: "2026-09-15", label: "Term added", path: "/vault/glossary/net-interest-margin", title: "Net Interest Margin", section: "The Vault" },
  { date: "2026-09-15", label: "Formula added", path: "/vault/formulas/cfo-to-pat", title: "CFO to PAT Ratio", section: "The Vault" },
];
