export type Category =
  | "investing"
  | "budgeting"
  | "taxes"
  | "retirement"
  | "credit"
  | "fundamental-analysis"
  | "technical-analysis";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  difficulty: DifficultyLevel;
  readingTime: number;
  author: string;
  publishedAt: string;
  imageUrl: string;
  keyTakeaways: string[];
  relatedArticleIds: string[];
}

export const categories: { id: Category; name: string; description: string; icon: string }[] = [
  {
    id: "investing",
    name: "Investing",
    description: "Learn how to grow your wealth through stocks, bonds, and other investments",
    icon: "TrendingUp",
  },
  {
    id: "budgeting",
    name: "Budgeting",
    description: "Master the art of managing your money and tracking expenses",
    icon: "Wallet",
  },
  {
    id: "taxes",
    name: "Taxes",
    description: "Understand tax strategies and maximize your deductions",
    icon: "Receipt",
  },
  {
    id: "retirement",
    name: "Retirement",
    description: "Plan for a secure and comfortable retirement",
    icon: "Landmark",
  },
  {
    id: "credit",
    name: "Credit & Debt",
    description: "Build credit and manage debt effectively",
    icon: "CreditCard",
  },
];

export const articles: Article[] = [
  {
    id: "compound-interest-basics",
    title: "The Power of Compound Interest: Your Money's Best Friend",
    excerpt: "Discover how compound interest can transform small savings into substantial wealth over time.",
    content: `
# The Power of Compound Interest

Compound interest is often called the eighth wonder of the world, and for good reason. It's the concept that makes your money work for you, generating earnings not just on your initial investment, but also on the accumulated interest over time.

## How Compound Interest Works

When you invest money, you earn interest on your principal (the original amount). With compound interest, you also earn interest on the interest you've already earned. This creates a snowball effect that accelerates your wealth growth over time.

### The Compound Interest Formula

The formula for compound interest is:

**A = P(1 + r/n)^(nt)**

Where:
- A = the final amount
- P = the principal (initial investment)
- r = the annual interest rate (decimal)
- n = number of times interest is compounded per year
- t = number of years

## Real-World Example

Let's say you invest $10,000 at a 7% annual return, compounded monthly:

- After 10 years: $20,097
- After 20 years: $40,387
- After 30 years: $81,165

Notice how the growth accelerates over time? That's the magic of compound interest.

## Starting Early Matters

The earlier you start investing, the more time compound interest has to work in your favor. A 25-year-old who invests $200/month will have significantly more at retirement than a 35-year-old investing the same amount.

## Key Strategies

1. **Start as early as possible** - Time is your greatest ally
2. **Be consistent** - Regular contributions amplify the effect
3. **Reinvest dividends** - Let all earnings compound
4. **Be patient** - The real magic happens over decades
    `,
    category: "investing",
    difficulty: "beginner",
    readingTime: 8,
    author: "Sarah Chen",
    publishedAt: "2024-01-15",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    keyTakeaways: [
      "Compound interest earns returns on both principal and accumulated interest",
      "Starting early dramatically increases your final wealth",
      "Consistency and patience are key to maximizing compound growth",
    ],
    relatedArticleIds: ["index-funds-101", "retirement-planning-basics"],
  },
  {
    id: "index-funds-101",
    title: "Index Funds 101: The Simplest Way to Build Wealth",
    excerpt: "Learn why index funds are the go-to investment vehicle for beginners and experts alike.",
    content: `
# Index Funds 101

Index funds have revolutionized investing by making it simple, affordable, and effective for everyday investors to build wealth.

## What Is an Index Fund?

An index fund is a type of mutual fund or ETF designed to track a specific market index, such as the S&P 500. Instead of trying to beat the market, index funds aim to match its performance.

## Why Index Funds Work

1. **Low Costs** - Expense ratios are often under 0.1%
2. **Diversification** - One fund gives you exposure to hundreds of stocks
3. **Consistency** - Most active managers fail to beat index funds long-term
4. **Simplicity** - No need to pick individual stocks

## Popular Index Funds

- **S&P 500 Index Funds** - Track the 500 largest US companies
- **Total Stock Market Funds** - Cover the entire US stock market
- **International Index Funds** - Provide global diversification
- **Bond Index Funds** - Add stability to your portfolio

## How to Get Started

1. Open a brokerage account
2. Choose a broad market index fund
3. Set up automatic contributions
4. Stay the course through market ups and downs

Remember: The best investment strategy is one you can stick with for the long term.
    `,
    category: "investing",
    difficulty: "beginner",
    readingTime: 6,
    author: "Michael Torres",
    publishedAt: "2024-01-20",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    keyTakeaways: [
      "Index funds track market indexes rather than trying to beat them",
      "Low costs and broad diversification make them ideal for most investors",
      "Consistency and patience outperform market timing",
    ],
    relatedArticleIds: ["compound-interest-basics", "building-emergency-fund"],
  },
  {
    id: "building-emergency-fund",
    title: "Building Your Emergency Fund: A Complete Guide",
    excerpt: "An emergency fund is your financial safety net. Here's how to build one that protects you.",
    content: `
# Building Your Emergency Fund

An emergency fund is one of the most important financial tools you can have. It's the foundation of financial security.

## Why You Need an Emergency Fund

Life is unpredictable. Job loss, medical emergencies, car repairs—unexpected expenses can derail your finances without proper preparation.

## How Much Should You Save?

The general guideline is 3-6 months of essential expenses:

- **3 months** if you have stable employment and low expenses
- **6 months** if you're self-employed or have variable income
- **More** if you're in an unstable industry or have dependents

## Where to Keep Your Emergency Fund

Your emergency fund should be:

1. **Easily accessible** - You need it quickly when emergencies happen
2. **Safe** - Not subject to market fluctuations
3. **Earning interest** - High-yield savings accounts are ideal

## Building Your Fund Step by Step

1. **Calculate your target** - Add up monthly essential expenses
2. **Start small** - Even $500 provides a buffer
3. **Automate transfers** - Set up automatic deposits
4. **Build gradually** - Aim for $1,000, then one month, then your full goal

## When to Use It

Only dip into your emergency fund for true emergencies:
- Job loss
- Medical emergencies
- Essential home or car repairs
- Unexpected necessary travel

Shopping sales and vacations don't count!
    `,
    category: "budgeting",
    difficulty: "beginner",
    readingTime: 7,
    author: "Emily Johnson",
    publishedAt: "2024-02-01",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    keyTakeaways: [
      "Aim for 3-6 months of essential expenses",
      "Keep funds in a high-yield savings account",
      "Automate contributions to build consistently",
    ],
    relatedArticleIds: ["50-30-20-budgeting", "compound-interest-basics"],
  },
  {
    id: "50-30-20-budgeting",
    title: "The 50/30/20 Budget Rule Explained",
    excerpt: "Simplify your finances with this straightforward budgeting framework.",
    content: `
# The 50/30/20 Budget Rule

The 50/30/20 rule is a simple budgeting framework that helps you allocate your after-tax income effectively.

## The Breakdown

### 50% - Needs
Essential expenses you can't avoid:
- Housing (rent/mortgage)
- Utilities
- Groceries
- Insurance
- Minimum debt payments
- Transportation

### 30% - Wants
Non-essential spending that improves your life:
- Dining out
- Entertainment
- Hobbies
- Subscriptions
- Vacations
- Shopping

### 20% - Savings & Debt
Building your future:
- Emergency fund contributions
- Retirement savings
- Extra debt payments
- Investment contributions

## How to Implement It

1. **Calculate your after-tax income**
2. **List all expenses** and categorize them
3. **Adjust spending** to fit the percentages
4. **Automate** your savings and bill payments

## Flexibility Is Key

These percentages are guidelines, not rigid rules. Adjust based on your situation:
- High cost of living? Needs might be 60%
- Aggressive debt payoff? Savings might be 30%
- Low income? Focus on needs first

The goal is progress, not perfection.
    `,
    category: "budgeting",
    difficulty: "beginner",
    readingTime: 5,
    author: "David Park",
    publishedAt: "2024-02-10",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    keyTakeaways: [
      "Allocate 50% to needs, 30% to wants, 20% to savings",
      "Adjust percentages based on your personal situation",
      "Automation makes budgeting easier to maintain",
    ],
    relatedArticleIds: ["building-emergency-fund", "credit-score-explained"],
  },
  {
    id: "credit-score-explained",
    title: "Understanding Your Credit Score: What It Is and Why It Matters",
    excerpt: "Your credit score affects more than you think. Learn what impacts it and how to improve it.",
    content: `
# Understanding Your Credit Score

Your credit score is a three-digit number that represents your creditworthiness. It affects everything from loan approvals to apartment rentals.

## What Makes Up Your Score

### FICO Score Components:

1. **Payment History (35%)** - Do you pay on time?
2. **Credit Utilization (30%)** - How much of your available credit are you using?
3. **Length of Credit History (15%)** - How long have you had credit?
4. **Credit Mix (10%)** - Do you have different types of credit?
5. **New Credit (10%)** - Have you opened many new accounts recently?

## Score Ranges

- **800-850**: Exceptional
- **740-799**: Very Good
- **670-739**: Good
- **580-669**: Fair
- **300-579**: Poor

## How to Improve Your Score

1. **Pay bills on time** - Set up autopay
2. **Keep utilization low** - Aim for under 30%, ideally under 10%
3. **Don't close old accounts** - Length of history matters
4. **Limit new applications** - Each one causes a small, temporary dip
5. **Check for errors** - Dispute any inaccuracies

## Monitoring Your Credit

You're entitled to free credit reports from each major bureau annually. Check regularly to catch fraud early and track your progress.
    `,
    category: "credit",
    difficulty: "beginner",
    readingTime: 6,
    author: "Lisa Wang",
    publishedAt: "2024-02-15",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
    keyTakeaways: [
      "Payment history and credit utilization are the biggest factors",
      "Keep credit utilization under 30% of your limit",
      "Monitor your credit reports regularly for errors",
    ],
    relatedArticleIds: ["50-30-20-budgeting", "building-emergency-fund"],
  },
  {
    id: "retirement-planning-basics",
    title: "Retirement Planning 101: Start Building Your Future Today",
    excerpt: "It's never too early to start planning for retirement. Learn the basics of building long-term wealth.",
    content: `
# Retirement Planning 101

Planning for retirement might seem distant, but the earlier you start, the easier it becomes. Here's everything you need to know to get started.

## Why Start Now?

Thanks to compound interest, money invested early has more time to grow. Someone who starts at 25 could have significantly more at 65 than someone who starts at 35, even if they invest the same monthly amount.

## Retirement Account Types

### 401(k)
- Employer-sponsored
- Often includes matching contributions
- Contribution limit: $23,000/year (2024)
- Traditional (pre-tax) or Roth (after-tax) options

### IRA (Individual Retirement Account)
- Personal accounts
- Contribution limit: $7,000/year (2024)
- Traditional or Roth options
- More investment choices than most 401(k)s

### Roth vs. Traditional

**Traditional**: Tax deduction now, pay taxes in retirement
**Roth**: No tax deduction now, tax-free withdrawals in retirement

Choose Roth if you expect higher taxes in retirement; Traditional if you expect lower.

## How Much to Save

General guidelines:
- Minimum: Enough to get full employer match
- Target: 15% of income (including employer match)
- Catch up: More if you started late

## Investment Strategy

- **Young (20s-30s)**: Mostly stocks (80-90%)
- **Middle (40s-50s)**: Balanced mix (60-70% stocks)
- **Near Retirement (60s)**: More conservative (40-50% stocks)

Target date funds automatically adjust this for you.
    `,
    category: "retirement",
    difficulty: "beginner",
    readingTime: 9,
    author: "Robert Kim",
    publishedAt: "2024-02-20",
    imageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800",
    keyTakeaways: [
      "Start early to maximize compound growth",
      "Always contribute enough to get your full employer match",
      "Choose Roth or Traditional based on your tax situation",
    ],
    relatedArticleIds: ["compound-interest-basics", "index-funds-101"],
  },
  {
    id: "tax-deductions-guide",
    title: "Common Tax Deductions You Might Be Missing",
    excerpt: "Don't leave money on the table. Learn about tax deductions that could reduce your bill.",
    content: `
# Common Tax Deductions You Might Be Missing

Tax deductions reduce your taxable income, potentially saving you hundreds or thousands of dollars. Here are deductions many people overlook.

## Standard vs. Itemized Deductions

The standard deduction for 2024:
- Single: $14,600
- Married Filing Jointly: $29,200

Only itemize if your total deductions exceed the standard deduction.

## Commonly Missed Deductions

### 1. Home Office Deduction
If you're self-employed and use part of your home exclusively for business, you may qualify.

### 2. Student Loan Interest
Deduct up to $2,500 in student loan interest, even if you don't itemize.

### 3. Charitable Contributions
Cash and non-cash donations to qualified organizations. Keep receipts!

### 4. Medical Expenses
Expenses exceeding 7.5% of your adjusted gross income may be deductible.

### 5. State and Local Taxes (SALT)
Up to $10,000 in state income, sales, and property taxes.

## Tax Credits vs. Deductions

- **Deductions** reduce taxable income
- **Credits** reduce tax owed dollar-for-dollar

Credits are generally more valuable. Don't miss:
- Earned Income Tax Credit
- Child Tax Credit
- Education Credits

## Keep Good Records

Document everything throughout the year. Use apps to track expenses and save receipts digitally.
    `,
    category: "taxes",
    difficulty: "intermediate",
    readingTime: 7,
    author: "Jennifer Adams",
    publishedAt: "2024-02-25",
    imageUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800",
    keyTakeaways: [
      "Compare standard deduction vs. itemizing annually",
      "Tax credits are more valuable than deductions",
      "Keep detailed records throughout the year",
    ],
    relatedArticleIds: ["retirement-planning-basics", "50-30-20-budgeting"],
  },
  {
    id: "debt-payoff-strategies",
    title: "Debt Payoff Strategies: Snowball vs. Avalanche",
    excerpt: "Two proven methods to eliminate debt. Which one is right for you?",
    content: `
# Debt Payoff Strategies

When tackling debt, having a strategy keeps you motivated and focused. The two most popular approaches are the Snowball and Avalanche methods.

## The Debt Snowball Method

**Strategy**: Pay off debts from smallest to largest balance, regardless of interest rate.

### How It Works:
1. List all debts from smallest to largest balance
2. Make minimum payments on everything
3. Put extra money toward the smallest debt
4. When paid off, roll that payment to the next smallest

### Pros:
- Quick wins build momentum
- Psychological motivation
- Easier to stick with

### Cons:
- May pay more interest overall
- Not mathematically optimal

## The Debt Avalanche Method

**Strategy**: Pay off debts from highest to lowest interest rate.

### How It Works:
1. List all debts from highest to lowest interest rate
2. Make minimum payments on everything
3. Put extra money toward the highest-rate debt
4. When paid off, move to the next highest rate

### Pros:
- Saves the most money on interest
- Mathematically optimal

### Cons:
- First payoff may take longer
- Requires more discipline

## Which Should You Choose?

- **Choose Snowball** if you need quick wins to stay motivated
- **Choose Avalanche** if you're disciplined and want to save money

Both work. The best method is the one you'll actually follow through on.

## Tips for Success

1. Stop accumulating new debt
2. Build a small emergency fund first
3. Find extra money through side hustles or expense cuts
4. Celebrate milestones along the way
    `,
    category: "credit",
    difficulty: "intermediate",
    readingTime: 6,
    author: "Marcus Thompson",
    publishedAt: "2024-03-01",
    imageUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800",
    keyTakeaways: [
      "Snowball focuses on smallest balances for quick wins",
      "Avalanche targets highest interest rates to save money",
      "The best method is the one you'll stick with",
    ],
    relatedArticleIds: ["credit-score-explained", "building-emergency-fund"],
  },
  {
    id: "stock-market-myths",
    title: "Common Myths About the Stock Market Debunked",
    excerpt: "Think investing is just gambling? Think you need millions to start? Let's bust the biggest myths holding you back.",
    content: `
# Myths About the Stock Market

Investing in the stock market is one of the best ways to build wealth, but many people stay away because of misconceptions. Let's clear up the most common myths.

## Myth 1: Investing is Just Like Gambling
**Reality:** Gambling is a zero-sum game where the house always wins. Investing is purchasing ownership in real businesses that produce goods and services. Over the long term, the stock market has historically trended upwards as the economy grows.

## Myth 2: You Need a Lot of Money to Start
**Reality:** You can start with as little as $5 or $10 thanks to fractional shares and modern trading apps. The key is starting *now*, not waiting until you're rich.

## Myth 3: You Need to Be a Financial Expert
**Reality:** You don't need to analyze balance sheets or watch charts all day. Simple strategies, like investing in broad index funds (e.g., S&P 500), often outperform professional fund managers over time.

## Myth 4: You Can Time the Market
**Reality:** "Buy low, sell high" sounds easy, but nobody can consistently predict market tops and bottoms. Time *in* the market beats *timing* the market. Missing just the best 10 days of the market over 20 years can cut your returns in half.

## Myth 5: Stocks Are Too Risky
**Reality:** While individual stocks can be risky, a diversified portfolio reduces that risk significantly. Inflation is also a risk—leaving cash under your mattress guarantees it loses value over time.

## Myth 6: You Should Sell When the Market Drops
**Reality:** Panic selling locks in your losses. Market corrections are normal. Historically, the market has recovered from every crash, including buying opportunities for disciplined investors.

## Conclusion
Don't let these myths stop you from securing your financial future. Educate yourself, start small, and think long-term.
    `,
    category: "investing",
    difficulty: "beginner",
    readingTime: 5,
    author: "FinBot Team",
    publishedAt: "2024-03-10",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    keyTakeaways: [
      "Investing is owning businesses, not gambling",
      "You can start with very little money",
      "Time in the market beats timing the market"
    ],
    relatedArticleIds: ["index-funds-101", "compound-interest-basics"],
  },
  {
    id: "pe-ratio-explained",
    title: "Understanding the P/E Ratio: A Fundamental Metric",
    excerpt: "The Price-to-Earnings ratio is the most popular valuation metric. Here is how to use it correctly.",
    content: `
# Understanding the P/E Ratio

The Price-to-Earnings (P/E) ratio is a key metric used by investors to determine if a stock is overvalued or undervalued.

## What is P/E Ratio?
It is the ratio of a company's share price to its earnings per share (EPS).

**Formula:**
P/E = Market Value per Share / Earnings per Share (EPS)

## Interpreting the P/E Ratio
- **High P/E:** Investors expect higher earnings growth in the future compared to companies with a lower P/E. It could also mean the stock is overvalued.
- **Low P/E:** The company may be undervalued, or investors are expecting earnings to fall.

## Types of P/E
1. **Trailing P/E:** Based on the last 12 months of earnings.
2. **Forward P/E:** Based on estimated future earnings.

The P/E ratio is best used when comparing companies within the *same industry*.
    `,
    category: "fundamental-analysis",
    difficulty: "beginner",
    readingTime: 4,
    author: "FinBot Team",
    publishedAt: "2024-03-12",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    keyTakeaways: [
      "P/E measures valuation",
      "Compare P/E within same industry",
      "High P/E suggests high growth expectations"
    ],
    relatedArticleIds: ["stock-market-myths"],
  },
  {
    id: "technical-analysis-basics",
    title: "Introduction to Technical Analysis: Charts & Patterns",
    excerpt: "Technical analysis uses chart patterns to predict future price movements. Learn the basics here.",
    content: `
# Introduction to Technical Analysis

Technical analysis is the art of reading chart patterns and price action to identify trading opportunities.

## Core Assumptions
1. **Market Discounts Everything:** The price reflects all known information.
2. **Price Moves in Trends:** Prices tend to move in uptrends, downtrends, or sideways ranges.
3. **History Repeats Itself:** Chart patterns tend to recur because human psychology doesn't change.

## Basic Tools
*   **Candlestick Charts:** Show open, high, low, and close prices.
*   **Support & Resistance:** Levels where price tends to stop and reverse.
*   **Moving Averages:** Smooth out price action to identify trends.

## Fundamental vs. Technical
While Fundamental analysis looks at the business (earnings, debt), Technical analysis looks only at the *price* and *volume* data.
    `,
    category: "technical-analysis",
    difficulty: "beginner",
    readingTime: 6,
    author: "FinBot Team",
    publishedAt: "2024-03-14",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    keyTakeaways: [
      "Focuses on price action and volume",
      "Uses charts to identify trends",
      "Assumes history repeats itself"
    ],
    relatedArticleIds: ["stock-market-myths"],
  }
];

export function getArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

export function getArticlesByCategory(category: Category): Article[] {
  return articles.filter(article => article.category === category);
}

export function getRelatedArticles(articleId: string): Article[] {
  const article = getArticleById(articleId);
  if (!article) return [];
  return article.relatedArticleIds
    .map(id => getArticleById(id))
    .filter((a): a is Article => a !== undefined);
}

export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(
    article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.category.toLowerCase().includes(lowercaseQuery)
  );
}
