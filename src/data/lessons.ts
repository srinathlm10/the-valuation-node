// Interactive lesson metadata for the Learn-by-Doing modules. Moved out of
// LearnByDoing.tsx in the restructure so hubs, search, and the sitemap can
// read it without importing a page component. Lesson components stay in
// src/components/learn/.

export const LESSONS = [
  {
    slug: "build-a-dcf",
    title: "Build a DCF, Step by Step",
    description: "Start from scratch and build a complete discounted cash flow model for a real Indian company, one concept at a time.",
    duration: "~30 min",
    steps: 8,
    live: true,
  },
  {
    slug: "read-an-income-statement",
    title: "Read an Income Statement, Line by Line",
    description: "Walk through a real Indian company's P&L, line by line, and understand what each number means.",
    duration: "~20 min",
    steps: 13,
    live: true,
  },
  {
    slug: "compute-ratios",
    title: "Compute Ratios from Raw Statements",
    description: "Pull numbers from financial statements and compute the ratios analysts use every day, you do the math, we check it.",
    duration: "~25 min",
    steps: 6,
    live: true,
  },
  {
    slug: "compare-two-companies",
    title: "Compare Two Companies Side by Side",
    description: "Use a structured framework to compare two companies in the same sector. Predict the winner, then see the full profile.",
    duration: "~15 min",
    steps: 6,
    live: true,
  },
  {
    slug: "spot-the-red-flags",
    title: "Spot the Red Flags",
    description: "Work through realistic case studies and identify the warning signs of financial distress and poor earnings quality.",
    duration: "~30 min",
    steps: 3,
    live: true,
  },
];

export type Lesson = (typeof LESSONS)[number];
export const LESSON_SLUGS = LESSONS.map((l) => l.slug);
