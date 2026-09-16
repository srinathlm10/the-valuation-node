// Calculator metadata (label, description, how to use, the maths, and the
// Concept Guide each one pairs with). Moved out of ToolPage.tsx in the
// restructure so hubs, search, and the sitemap can read it without importing
// a page component. Calculator components stay in ToolPage.tsx.

export interface ToolMeta {
  label: string;
  description: string;
  howToUse: string;
  mathExplainer: string;
  foundationsLink?: { href: string; label: string };
}

export const TOOL_META: Record<string, ToolMeta> = {
  sip: {
    label: "SIP Calculator",
    description: "Estimate the maturity value of a Systematic Investment Plan (SIP) over time.",
    howToUse: "Enter your monthly investment amount, the expected annual return rate, and the investment duration in years. The calculator shows your estimated corpus at the end of the period.\n\nUse realistic return assumptions. Indian equity mutual funds have historically returned 12–15% CAGR over long periods, but past performance is not a guarantee.",
    mathExplainer: "SIP maturity value = P × [(1+r)ⁿ − 1] / r × (1+r), where P is the monthly investment, r is the monthly return rate (annual rate ÷ 12), and n is the total number of months.",
    foundationsLink: { href: "/vault/guides/time-value-of-money", label: "Time Value of Money" },
  },
  "future-value": {
    label: "Future Value Calculator",
    description: "Calculate the future value of a lump-sum investment given a rate of return and time horizon.",
    howToUse: "Enter the principal (lump-sum amount), the expected annual return, and the number of years. The result is the compounded value of your investment.\n\nThis is useful for estimating how a one-time investment grows, unlike SIP which models periodic investments.",
    mathExplainer: "FV = PV × (1 + r)ⁿ, where PV is the present value (principal), r is the annual rate of return, and n is the number of years.",
    foundationsLink: { href: "/vault/guides/time-value-of-money", label: "Time Value of Money" },
  },
  "present-value": {
    label: "Present Value Calculator",
    description: "Find the present value of a future sum, given a discount rate and time horizon.",
    howToUse: "Enter the future value, the discount rate (your required rate of return), and the number of years. The result tells you what that future sum is worth in today's terms.",
    mathExplainer: "PV = FV / (1 + r)ⁿ, where FV is the future value, r is the discount rate, and n is the number of years.",
    foundationsLink: { href: "/vault/guides/dcf-theory-and-mechanics", label: "DCF: Theory and Mechanics" },
  },
  cagr: {
    label: "CAGR Calculator",
    description: "Compute the compound annual growth rate between a starting and ending value over a number of years.",
    howToUse: "Enter the beginning value, ending value, and number of years. CAGR is the single rate at which the beginning value would have grown each year to reach the ending value.",
    mathExplainer: "CAGR = (Ending Value / Beginning Value)^(1/n) − 1, where n is the number of years.",
    foundationsLink: { href: "/vault/guides/market-ratios", label: "Market Ratios" },
  },
  "compound-interest": {
    label: "Compound Interest Calculator",
    description: "Calculate how money grows when interest compounds monthly, quarterly, or annually over time.",
    howToUse: "Enter the principal, annual interest rate, compounding frequency (monthly, quarterly, annually), and number of years.",
    mathExplainer: "A = P × (1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency per year, and t is years.",
    foundationsLink: { href: "/vault/guides/time-value-of-money", label: "Time Value of Money" },
  },
  "rule-of-72": {
    label: "Rule of 72",
    description: "A quick mental-math shortcut to estimate how many years it takes to double an investment.",
    howToUse: "Divide 72 by the annual rate of return. The result is the approximate number of years to double your money. The calculator also shows the exact answer for comparison.",
    mathExplainer: "Approximate doubling time ≈ 72 / r, where r is the annual return rate as a percentage. The exact formula is ln(2) / ln(1 + r).",
    foundationsLink: { href: "/vault/guides/time-value-of-money", label: "Time Value of Money" },
  },
  emi: {
    label: "EMI Calculator",
    description: "Calculate the Equated Monthly Instalment (EMI) for a home, car, or personal loan, plus the total interest you will pay over the tenure.",
    howToUse: "Enter the loan principal, the annual interest rate, and the tenure. The calculator shows the monthly EMI, the total interest paid over the life of the loan, and the total amount payable.\n\nTwo things are worth noticing as you move the sliders. First, tenure cuts both ways: a longer tenure lowers the monthly EMI but sharply increases the total interest paid, so the cheapest-feeling loan is often the most expensive one. Second, EMIs are front-loaded: in the early years most of each instalment is interest, not principal, which is why prepaying early in the tenure saves far more interest than prepaying late.\n\nTypical Indian lending rates differ by loan type: home loans are usually the cheapest (they are secured), followed by car loans, with personal loans and credit card debt the most expensive. Always compare the total interest figure, not just the EMI, when choosing between offers.",
    mathExplainer: "EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is principal, r is the monthly interest rate (annual rate ÷ 12), and n is the number of months.\n\nTotal amount payable = EMI × n. Total interest = EMI × n − P.",
    foundationsLink: { href: "/vault/guides/cost-of-capital", label: "Cost of Capital" },
  },
  "inflation-adjusted-returns": {
    label: "Inflation-Adjusted Returns Calculator",
    description: "See what a nominal return actually means after inflation, the real growth in your purchasing power.",
    howToUse: "Enter the nominal return your investment earns and the inflation rate you expect. The calculator shows the real return: the growth in what your money can actually buy.\n\nThis distinction matters more than most investors realise. A fixed deposit earning 7% while inflation runs at 6% grows your purchasing power by barely 1% a year; after tax on the interest, the real return can even turn negative. That is the quiet way conservative portfolios lose wealth over decades.\n\nNote that the real return is not simply the nominal return minus inflation. The correct formula divides rather than subtracts, and the gap between the two widens as rates rise. For India, CPI inflation has historically averaged in the mid single digits, which is a reasonable starting assumption for long-horizon planning.",
    mathExplainer: "Real Return = (1 + Nominal Return) / (1 + Inflation Rate) − 1. This is the Fisher equation.\n\nThe common shortcut (nominal minus inflation) overstates the real return. Example: 12% nominal with 6% inflation gives a true real return of 1.12/1.06 − 1 = 5.66%, not 6%.",
    foundationsLink: { href: "/vault/guides/debt-markets-and-yield-curves", label: "Debt Markets and Yield Curves" },
  },
  "step-up-sip": {
    label: "Step-Up SIP Calculator",
    description: "Project a SIP where the monthly amount increases every year, the way a salary does.",
    howToUse: "Enter your starting monthly investment, the percentage by which you will raise it each year, the expected annual return, and the duration. The calculator compounds each month and steps the contribution up every 12 months.\n\nA step-up is the most realistic way to plan a SIP, because incomes grow. Even a modest 10% annual increase changes the outcome dramatically over long periods; the comparison row shows exactly how much more you end with versus keeping the SIP fixed.\n\nMost Indian fund platforms support automatic annual step-ups, so the plan you model here can be set up once and left alone.",
    mathExplainer: "Each month: balance = (balance + contribution) x (1 + r), where r is the monthly return. Every 12 months the contribution is multiplied by (1 + step-up rate). The fixed-SIP comparison uses the standard annuity formula with the starting contribution.",
    foundationsLink: { href: "/vault/guides/time-value-of-money", label: "Time Value of Money" },
  },
  "goal-sip": {
    label: "Goal SIP Calculator",
    description: "Work backwards from a target corpus to the monthly SIP required to reach it.",
    howToUse: "Enter the corpus you want, the years available, and the return you expect. The calculator inverts the SIP formula to tell you the monthly investment required.\n\nUse it for concrete goals: a child's education, a house down payment, retirement. Two cautions make the answer honest. First, state the target in future rupees: a goal 15 years away should be inflated before it is entered, and the Inflation-Adjusted Returns tool helps with that. Second, revisit the plan yearly; if returns disappoint, the required SIP rises the longer you wait.",
    mathExplainer: "Required SIP = T x r / (((1+r)^n - 1) x (1+r)), where T is the target corpus, r is the monthly return, and n is the number of months. This is the SIP future-value formula solved for the payment.",
    foundationsLink: { href: "/vault/guides/time-value-of-money", label: "Time Value of Money" },
  },
  "loan-prepayment": {
    label: "Loan Prepayment Calculator",
    description: "See how much interest and time a regular extra payment knocks off a loan.",
    howToUse: "Enter your loan details and the extra amount you can pay each month on top of the EMI. The calculator re-runs the amortisation schedule and shows how much earlier the loan closes and how much interest you avoid.\n\nPrepayment is powerful because EMIs are front-loaded: early instalments are mostly interest, so every extra rupee paid early cancels many rupees of future interest. The same extra payment made in year 15 of a 20-year loan saves far less than in year 2.\n\nFor floating-rate loans to individuals, RBI rules bar banks from charging prepayment penalties, so home-loan prepayment is usually free. Check the terms on fixed-rate and business loans.",
    mathExplainer: "The schedule is simulated month by month: interest = balance x r, then balance falls by (EMI - interest + extra). The loan closes when the balance reaches zero. Savings are the difference in months and in total interest versus the no-prepayment schedule.",
    foundationsLink: { href: "/vault/guides/cost-of-capital", label: "Cost of Capital" },
  },
  "wacc": {
    label: "WACC Calculator",
    description: "Compute the weighted average cost of capital from equity and debt weights, their costs, and the tax rate.",
    howToUse: "Enter the market value of equity and debt, the cost of each, and the tax rate. The calculator weights the two costs by their share of total capital, using the after-tax cost of debt because interest is tax-deductible.\n\nFor Indian listed companies, cost of equity typically lands between 12% and 16% when built with CAPM (10-year G-sec yield plus beta times the equity risk premium), and cost of debt sits near the company's actual borrowing rate. The result is the discount rate a DCF uses, so small changes matter: test a range rather than trusting one number.",
    mathExplainer: "WACC = (E/V) x Re + (D/V) x Rd x (1 - t), where E and D are market values of equity and debt, V = E + D, Re is cost of equity, Rd is pre-tax cost of debt, and t is the tax rate.",
    foundationsLink: { href: "/vault/guides/cost-of-capital", label: "Cost of Capital" },
  },
};

export const TOOL_SLUGS = Object.keys(TOOL_META);
