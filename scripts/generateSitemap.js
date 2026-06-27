// Build-time sitemap generator
// Run via: node scripts/generateSitemap.js
// Hooked into npm build — runs before vite build
// Dynamic routes (research articles, glossary entries) are excluded here;
// add them by fetching from Supabase if needed in a future pass.

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://valuationnode.com";
const today = new Date().toISOString().split("T")[0];

const routes = [
  // ── Core ─────────────────────────────────────────────────────────────
  { path: "/",                        priority: "1.0", changefreq: "weekly"  },

  // ── Research ──────────────────────────────────────────────────────────
  { path: "/research",                priority: "0.9", changefreq: "daily"   },

  // ── Learn ─────────────────────────────────────────────────────────────
  { path: "/learn",                   priority: "0.9", changefreq: "weekly"  },

  // Foundations index
  { path: "/learn/foundations",       priority: "0.8", changefreq: "weekly"  },

  // Foundations — Accounting
  { path: "/learn/foundations/accounting/reading-an-income-statement",           priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/accounting/reading-a-balance-sheet",               priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/accounting/reading-a-cash-flow-statement",         priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/accounting/linking-the-three-statements",          priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/accounting/ind-as-vs-ifrs-vs-indian-gaap",         priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/accounting/common-adjustments",                    priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/accounting/quality-of-earnings",                   priority: "0.7", changefreq: "monthly" },

  // Foundations — Corporate Finance
  { path: "/learn/foundations/corporate-finance/time-value-of-money",            priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/corporate-finance/cost-of-capital",                priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/corporate-finance/capital-structure",              priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/corporate-finance/working-capital",                priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/corporate-finance/capital-budgeting",              priority: "0.7", changefreq: "monthly" },

  // Foundations — Valuation
  { path: "/learn/foundations/valuation/dcf-theory-and-mechanics",               priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/valuation/relative-valuation",                     priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/valuation/sum-of-the-parts",                       priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/valuation/sector-specific-valuation",              priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/valuation/terminal-value-approaches",              priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/valuation/common-dcf-mistakes",                    priority: "0.7", changefreq: "monthly" },

  // Foundations — Financial Statement Analysis
  { path: "/learn/foundations/financial-statement-analysis/profitability-ratios",priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/financial-statement-analysis/liquidity-ratios",    priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/financial-statement-analysis/solvency-ratios",     priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/financial-statement-analysis/efficiency-ratios",   priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/financial-statement-analysis/market-ratios",       priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/financial-statement-analysis/dupont-decomposition",priority: "0.7", changefreq: "monthly" },

  // Foundations — Credit Analysis
  { path: "/learn/foundations/credit-analysis/credit-risk-fundamentals",         priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/credit-analysis/reading-crisil-icra-moodys-reports", priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/credit-analysis/altman-z-score-and-distress-models", priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/credit-analysis/bond-pricing-and-yields",          priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/credit-analysis/covenants-and-triggers",           priority: "0.7", changefreq: "monthly" },

  // Foundations — Markets and Instruments
  { path: "/learn/foundations/markets-and-instruments/equities",                 priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/markets-and-instruments/debt-markets-and-yield-curves", priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/markets-and-instruments/derivatives",              priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/markets-and-instruments/mutual-funds-etfs-aifs",   priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/markets-and-instruments/reits-and-invits",         priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/markets-and-instruments/technical-analysis-primer",priority: "0.7", changefreq: "monthly" },

  // Foundations — ESG and Sustainable Finance
  { path: "/learn/foundations/esg-and-sustainable-finance/esg-fundamentals",                    priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/esg-and-sustainable-finance/reporting-frameworks",                priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/esg-and-sustainable-finance/carbon-accounting",                   priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/esg-and-sustainable-finance/green-bonds-and-sustainability-linked-debt", priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/esg-and-sustainable-finance/esg-integrated-valuation",           priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/esg-and-sustainable-finance/climate-risk-and-stranded-assets",   priority: "0.7", changefreq: "monthly" },

  // Foundations — Fintech and Digital Finance
  { path: "/learn/foundations/fintech-and-digital-finance/payments-landscape",             priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/fintech-and-digital-finance/digital-lending-models",         priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/fintech-and-digital-finance/credit-scoring",                 priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/fintech-and-digital-finance/blockchain-and-defi-primer",     priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/fintech-and-digital-finance/cybersecurity-in-financial-systems", priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/fintech-and-digital-finance/account-aggregators",            priority: "0.7", changefreq: "monthly" },

  // Foundations — Data and Tools for Finance
  { path: "/learn/foundations/data-and-tools-for-finance/excel-modeling-conventions",      priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/data-and-tools-for-finance/python-for-finance",              priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/data-and-tools-for-finance/sql-for-finance-data",            priority: "0.7", changefreq: "monthly" },
  { path: "/learn/foundations/data-and-tools-for-finance/where-to-find-indian-markets-data", priority: "0.7", changefreq: "monthly" },

  // Learn-by-Doing
  { path: "/learn/by-doing",                                  priority: "0.8", changefreq: "monthly" },
  { path: "/learn/by-doing/build-a-dcf",                      priority: "0.9", changefreq: "monthly" },
  { path: "/learn/by-doing/read-an-income-statement",         priority: "0.6", changefreq: "monthly" },
  { path: "/learn/by-doing/compute-ratios-from-raw-statements", priority: "0.6", changefreq: "monthly" },
  { path: "/learn/by-doing/compare-two-companies",            priority: "0.6", changefreq: "monthly" },
  { path: "/learn/by-doing/spot-the-red-flags",               priority: "0.6", changefreq: "monthly" },

  // Glossary index (entries are dynamic — not listed here)
  { path: "/learn/glossary",          priority: "0.8", changefreq: "weekly"  },

  // ── Tools ─────────────────────────────────────────────────────────────
  { path: "/tools",                                   priority: "0.8", changefreq: "monthly" },
  { path: "/tools/dcf-sensitivity",                  priority: "0.9", changefreq: "monthly" },
  { path: "/tools/sip",                               priority: "0.7", changefreq: "monthly" },
  { path: "/tools/future-value",                      priority: "0.7", changefreq: "monthly" },
  { path: "/tools/present-value",                     priority: "0.7", changefreq: "monthly" },
  { path: "/tools/cagr",                              priority: "0.7", changefreq: "monthly" },
  { path: "/tools/compound-interest",                 priority: "0.7", changefreq: "monthly" },
  { path: "/tools/rule-of-72",                        priority: "0.7", changefreq: "monthly" },
  { path: "/tools/emi",                               priority: "0.7", changefreq: "monthly" },
  { path: "/tools/inflation-adjusted-returns",        priority: "0.7", changefreq: "monthly" },

  // ── Markets ───────────────────────────────────────────────────────────
  { path: "/markets",             priority: "0.7", changefreq: "weekly"  },
  { path: "/markets/nifty50",     priority: "0.6", changefreq: "monthly" },
  { path: "/markets/compliance",  priority: "0.6", changefreq: "monthly" },

  // ── About ─────────────────────────────────────────────────────────────
  { path: "/about",                priority: "0.6", changefreq: "monthly" },
  { path: "/about/author",         priority: "0.5", changefreq: "monthly" },
  { path: "/about/site",           priority: "0.5", changefreq: "monthly" },
  { path: "/about/methodology",    priority: "0.5", changefreq: "monthly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path, priority, changefreq }) =>
      `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;

const outPath = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`sitemap.xml written — ${routes.length} URLs (${outPath})`);
