import { Quiz } from "@/services/quizService";

export const localQuizzes: Quiz[] = [
    // --------------------------------------------------------------------------
    // BASICS SECTION - INDIVIDUAL ARTICLE QUIZZES
    // --------------------------------------------------------------------------

    // 1. Compound Interest
    {
        id: "quiz-compound-interest",
        article_id: "compound-interest-basics",
        title: "Quiz: Compound Interest Mastery",
        description: "Test your understanding of the eighth wonder of the world.",
        questions: [
            {
                id: "q1",
                question: "What is compound interest?",
                options: [
                    "Interest earned only on the principal investment",
                    "Interest earned on the principal and previously accumulated interest",
                    "A fixed bonus paid by the bank annually",
                    "Interest that is calculated only once at the end of the term"
                ],
                correct_answer_index: 1,
                explanation: "Compound interest is interest on interest. It makes your money grow faster over time because you earn returns on your returns."
            },
            {
                id: "q2",
                question: "Which formula represents compound interest?",
                options: [
                    "A = P + (P * r * t)",
                    "A = P(1 + rt)",
                    "A = P(1 + r/n)^(nt)",
                    "A = P * r^t"
                ],
                correct_answer_index: 2,
                explanation: "The formula is A = P(1 + r/n)^(nt), where P is principal, r is rate, n is compounding frequency, and t is time."
            },
            {
                id: "q3",
                question: "If you invest $1,000 at 10% annual interest compounded yearly, how much will you have after 2 years?",
                options: [
                    "$1,200",
                    "$1,210",
                    "$1,100",
                    "$1,150"
                ],
                correct_answer_index: 1,
                explanation: "Year 1: $1,000 * 1.10 = $1,100. Year 2: $1,100 * 1.10 = $1,210."
            },
            {
                id: "q4",
                question: "Which factor has the greatest impact on compound interest over the long term?",
                options: [
                    "The bank's brand",
                    "Time (duration of investment)",
                    "The type of currency",
                    "Short-term market fluctuations"
                ],
                correct_answer_index: 1,
                explanation: "Time is exponential in the compound interest formula. The longer your money stays invested, the more powerful the compounding effect."
            },
            {
                id: "q5",
                question: "What is the 'Rule of 72' used for?",
                options: [
                    "Calculating taxes",
                    "Estimating how long it takes to double your money",
                    "Determining retirement age",
                    "Calculating mortgage payments"
                ],
                correct_answer_index: 1,
                explanation: "The Rule of 72 states that dividing 72 by the annual interest rate gives the approximate number of years to double your investment."
            },
            {
                id: "q6",
                question: "Why does starting early matter so much?",
                options: [
                    "You get better tax rates",
                    "Your money has more time to compound exponentially",
                    "You can only invest when you are young",
                    "Older people are not allowed to invest"
                ],
                correct_answer_index: 1,
                explanation: "A 25-year-old investing smaller amounts can often end up with more wealth than a 35-year-old investing larger amounts, simply due to the extra decade of compounding."
            }
        ]
    },

    // 2. Index Funds
    {
        id: "quiz-index-funds",
        article_id: "index-funds-101",
        title: "Quiz: Index Fund Basics",
        description: "Verify your knowledge about this popular investment strategy.",
        questions: [
            {
                id: "q1",
                question: "What is the primary goal of an index fund?",
                options: [
                    "To beat the market significantly every year",
                    "To match the performance of a specific market index",
                    "To guarantee zero losses",
                    "To invest in only one specific company"
                ],
                correct_answer_index: 1,
                explanation: "Index funds are designed to mirror the performance of indices like the S&P 500 or Nifty 50, not to outperform them."
            },
            {
                id: "q2",
                question: "Why are index funds generally cheaper than actively managed funds?",
                options: [
                    "They use lower quality stocks",
                    "They don't require expensive teams of analysts to pick stocks",
                    "They are government-subsidized",
                    "They only trade once a year"
                ],
                correct_answer_index: 1,
                explanation: "Since they passively track an index, they have lower operational costs, resulting in lower expense ratios (fees)."
            },
            {
                id: "q3",
                question: "What does diversifying with an index fund mean?",
                options: [
                    "Buying shares of a single company",
                    "Spreading your investment across hundreds or thousands of companies",
                    "Investing in different banks",
                    "Buying gold and silver only"
                ],
                correct_answer_index: 1,
                explanation: "Buying a single index fund unit can give you exposure to all the companies in that index, instantly diversifying your portfolio."
            },
            {
                id: "q4",
                question: "Which of the following is a famous example of a market index?",
                options: [
                    "The GDP 500",
                    "The Inflation Index",
                    "The S&P 500",
                    "The Bitcoin Ledger"
                ],
                correct_answer_index: 2,
                explanation: "The S&P 500 is one of the most widely followed indices, tracking 500 large companies in the US."
            },
            {
                id: "q5",
                question: "Over the long term, how do index funds compare to active management?",
                options: [
                    "Active managers almost always win",
                    "Index funds often outperform the majority of active managers",
                    "They perform exactly the same",
                    "Active management has no risk"
                ],
                correct_answer_index: 1,
                explanation: "Statistical data consistently shows that the vast majority of active fund managers fail to beat their benchmark index over long periods (10+ years)."
            }
        ]
    },

    // 3. Emergency Fund
    {
        id: "quiz-emergency-fund",
        article_id: "building-emergency-fund",
        title: "Quiz: Emergency Preparedness",
        description: "Are you financially ready for the unexpected?",
        questions: [
            {
                id: "q1",
                question: "What is the recommended size for an emergency fund?",
                options: [
                    "$500",
                    "1 month of salary",
                    "3-6 months of essential living expenses",
                    "3 years of income"
                ],
                correct_answer_index: 2,
                explanation: "3-6 months gives you enough buffer to handle major events like job loss or medical emergencies without needing debt."
            },
            {
                id: "q2",
                question: "Which of these is a valid reason to use your emergency fund?",
                options: [
                    "A flash sale on a new TV",
                    "A vacation to Hawaii",
                    "Unexpected medical bills or job loss",
                    "Investing in a hot stock tip"
                ],
                correct_answer_index: 2,
                explanation: "Emergency funds are strictly for true emergencies - unforeseen, necessary expenses or income loss."
            },
            {
                id: "q3",
                question: "Where should you keep your emergency fund?",
                options: [
                    "Locked in a 5-year fixed deposit",
                    "In a liquid, high-yield savings account",
                    "In the stock market",
                    "In cash under your mattress"
                ],
                correct_answer_index: 1,
                explanation: "You need liquidity (quick access) and safety. A high-yield savings account provides both, plus some interest."
            },
            {
                id: "q4",
                question: "Why shouldn't you invest your emergency fund in stocks?",
                options: [
                    "Stocks are illegal",
                    "Stocks give too much return",
                    "The market could be down exactly when you need the cash",
                    "Stocks are not liquid"
                ],
                correct_answer_index: 2,
                explanation: "If an emergency hits during a market crash, you might be forced to sell your investments at a loss."
            },
            {
                id: "q5",
                question: "What is the first step to building an emergency fund?",
                options: [
                    "Sell your house",
                    "Take a loan",
                    "Calculate your monthly essential expenses",
                    "Quit your job"
                ],
                correct_answer_index: 2,
                explanation: "You need to know how much you spend on needs (rent, food, etc.) to calculate your 3-6 month target."
            }
        ]
    },

    // 4. 50/30/20 Budgeting (Updated ID)
    {
        id: "quiz-budgeting-503020",
        article_id: "50-30-20-budgeting",
        title: "Quiz: The 50/30/20 Rule",
        description: "Master the art of simple budgeting.",
        questions: [
            {
                id: "q1",
                question: "In the 50/30/20 rule, what does the '50' represent?",
                options: [
                    "Wants",
                    "Needs",
                    "Savings",
                    "Charity"
                ],
                correct_answer_index: 1,
                explanation: "50% of your after-tax income should cover needs: housing, groceries, utilities, and minimum debt payments."
            },
            {
                id: "q2",
                question: "Which category includes groceries and rent?",
                options: [
                    "Wants (30%)",
                    "Savings (20%)",
                    "Needs (50%)",
                    "Investments (10%)"
                ],
                correct_answer_index: 2,
                explanation: "These are essential for survival, so they fall under the 'Needs' category."
            },
            {
                id: "q3",
                question: "Where does 'Dining Out' belong?",
                options: [
                    "Needs",
                    "Wants",
                    "Savings",
                    "Emergency Fund"
                ],
                correct_answer_index: 1,
                explanation: "Dining out is a lifestyle choice, not a survival necessity, so it is a 'Want'."
            },
            {
                id: "q4",
                question: "What should you do with the '20%' portion?",
                options: [
                    "Buy new clothes",
                    "Pay for Netflix",
                    "Save, invest, and pay off extra debt",
                    "Keep it in your checking account for spending"
                ],
                correct_answer_index: 2,
                explanation: "The 20% is for your financial future: retirement, emergency fund, and aggressive debt repayment."
            },
            {
                id: "q5",
                question: "Is the 50/30/20 rule rigid?",
                options: [
                    "Yes, you must follow it exactly to the penny",
                    "No, it's a guideline that can be adjusted",
                    "Yes, otherwise it is illegal",
                    "No, the math doesn't matter"
                ],
                correct_answer_index: 1,
                explanation: "It's a framework. In high cost-of-living areas, Needs might be 60%. The goal is to have a structured plan."
            }
        ]
    },

    // 5. Credit Score
    {
        id: "quiz-credit-score",
        article_id: "credit-score-explained",
        title: "Quiz: Credit Score Logic",
        description: "Understand how your credit score is calculated.",
        questions: [
            {
                id: "q1",
                question: "Which factor makes up the largest part (35%) of your FICO score?",
                options: [
                    "Credit Utilization",
                    "Length of Credit History",
                    "Payment History",
                    "New Credit"
                ],
                correct_answer_index: 2,
                explanation: "Payment history is king. Paying on time, every time, is the most important thing you can do."
            },
            {
                id: "q2",
                question: "What is Credit Utilization?",
                options: [
                    "How many credit cards you have",
                    "The percentage of your available credit that you are currently using",
                    "The interest rate on your cards",
                    "The annual fee of your cards"
                ],
                correct_answer_index: 1,
                explanation: "It's the ratio of your balance to your credit limit. Using $300 of a $1000 limit is 30% utilization."
            },
            {
                id: "q3",
                question: "What is a 'Good' credit utilization ratio to aim for?",
                options: [
                    "Below 30%",
                    "Above 50%",
                    "100% (Maxed out)",
                    "0% (Never use credit)"
                ],
                correct_answer_index: 0,
                explanation: "Below 30% is good, below 10% is excellent. It shows lenders you aren't desperate for credit."
            },
            {
                id: "q4",
                question: "Does closing an old credit card help your score?",
                options: [
                    "Yes, having fewer cards is always better",
                    "No, it can hurt your score by shortening your credit history and reducing total limit",
                    "It has no effect",
                    "Yes, if you don't use it"
                ],
                correct_answer_index: 1,
                explanation: "Closing old cards reduces your average account age and your total available credit, which can lower your score."
            },
            {
                id: "q5",
                question: "How often can you check your credit report for free by law?",
                options: [
                    "Once a lifetime",
                    "Once a year from each major bureau",
                    "Only when you apply for a loan",
                    "Never"
                ],
                correct_answer_index: 1,
                explanation: "You are entitled to one free report annually from Equifax, Experian, and TransUnion (though many services offer it more frequently now)."
            }
        ]
    },

    // 6. Retirement Planning
    {
        id: "quiz-retirement-planning",
        article_id: "retirement-planning-basics",
        title: "Quiz: Retirement Ready",
        description: "Check your knowledge on securing your golden years.",
        questions: [
            {
                id: "q1",
                question: "What is the main benefit of a Roth IRA?",
                options: [
                    "Tax deduction today",
                    "Tax-free withdrawals in retirement",
                    "Unlimited contribution limits",
                    "Employer matching"
                ],
                correct_answer_index: 1,
                explanation: "You pay taxes on the money before you contribute, so all growth and withdrawals in retirement are tax-free."
            },
            {
                id: "q2",
                question: "What happens if you don't contribute enough to get your employer's full 401(k) match?",
                options: [
                    "Nothing",
                    "You are leaving 'free money' on the table",
                    "Your employer saves it for next year",
                    "You pay a penalty"
                ],
                correct_answer_index: 1,
                explanation: "Employer matching is essentially a 100% return on your investment instantly. Always contribute at least enough to get the match."
            },
            {
                id: "q3",
                question: "As you get closer to retirement, how should your portfolio generally change?",
                options: [
                    "Become more aggressive (100% Stocks)",
                    "Become more conservative (Shift towards Bonds/Cash)",
                    "Invest everything in Crypto",
                    "Stop investing completely"
                ],
                correct_answer_index: 1,
                explanation: "To protect your capital from market crashes right before you need to spend it, you generally shift from growth (stocks) to stability (bonds)."
            },
            {
                id: "q4",
                question: "What is a 'Target Date Fund'?",
                options: [
                    "A fund that closes on a specific date",
                    "A fund that automatically adjusts its risk based on when you plan to retire",
                    "A fund for day traders",
                    "A fund that targets only tech stocks"
                ],
                correct_answer_index: 1,
                explanation: "These funds automatically rebalance from aggressive to conservative as you approach your target retirement year."
            },
            {
                id: "q5",
                question: "What is a good rule of thumb for saving for retirement?",
                options: [
                    "Save whatever is left over",
                    "Save 15% of your income",
                    "Save 1%",
                    "Wait until you are 50 to start"
                ],
                correct_answer_index: 1,
                explanation: "Saving 15% of your gross income starting in your 20s or 30s is a widely recommended benchmark for a comfortable retirement."
            }
        ]
    },

    // 7. Tax Deductions (NEW)
    {
        id: "quiz-tax-deductions",
        article_id: "tax-deductions-guide",
        title: "Quiz: Tax Deductions",
        description: "Don't leave money on the table. Test your tax knowledge.",
        questions: [
            {
                id: "q1",
                question: "What is the difference between a tax deduction and a tax credit?",
                options: [
                    "They are the same thing",
                    "Deductions reduce taxable income; Credits reduce tax owed dollar-for-dollar",
                    "Credits reduce taxable income; Deductions reduce tax owed",
                    "Deductions are for businesses only"
                ],
                correct_answer_index: 1,
                explanation: "A credit is more valuable because it directly lowers your bill. A deduction only lowers the income you are taxed on."
            },
            {
                id: "q2",
                question: "When should you itemize your deductions instead of taking the Standard Deduction?",
                options: [
                    "Always",
                    "Never",
                    "When your total itemized deductions are greater than the Standard Deduction",
                    "When you want to annoy the IRS"
                ],
                correct_answer_index: 2,
                explanation: "You should choose whichever method results in the larger deduction to minimize your tax bill."
            },
            {
                id: "q3",
                question: "Which of these is a commonly overlooked deduction?",
                options: [
                    "Groceries",
                    "Student Loan Interest",
                    "Gym memberships",
                    "Rent payments"
                ],
                correct_answer_index: 1,
                explanation: "You can deduct up to $2,500 in student loan interest paid, even if you take the standard deduction."
            },
            {
                id: "q4",
                question: "Who can claim the Home Office Deduction?",
                options: [
                    "Anyone who works from home occassionally",
                    "Self-employed individuals who use a space exclusively for business",
                    "Employees who check email at home",
                    "Everyone"
                ],
                correct_answer_index: 1,
                explanation: "The IRS has strict rules: the space must be used regularly and exclusively for business, and usually applies to self-employed/freancers."
            },
            {
                id: "q5",
                question: "What record-keeping habit is essential for claiming deductions?",
                options: [
                    "Guessing numbers at the end of the year",
                    "Keeping receipts and documenting expenses throughout the year",
                    "Asking your neighbor",
                    "Only keeping receipts for items over $1000"
                ],
                correct_answer_index: 1,
                explanation: "Without proof (receipts, logs), the IRS can disallow your deductions if audited."
            }
        ]
    },

    // 8. Debt Payoff Strategies (NEW)
    {
        id: "quiz-debt-payoff",
        article_id: "debt-payoff-strategies",
        title: "Quiz: Debt Destroyer",
        description: "Snowball vs. Avalanche. Which do you know?",
        questions: [
            {
                id: "q1",
                question: "The 'Debt Snowball' method focuses on paying off debts in what order?",
                options: [
                    "Highest interest rate first",
                    "Largest balance first",
                    "Smallest balance first",
                    "Random order"
                ],
                correct_answer_index: 2,
                explanation: "The Snowball method targets the smallest balance to get quick wins and build psychological momentum."
            },
            {
                id: "q2",
                question: "The 'Debt Avalanche' method focuses on paying off debts in what order?",
                options: [
                    "Highest interest rate first",
                    "Smallest balance first",
                    "Oldest debt first",
                    "Newest debt first"
                ],
                correct_answer_index: 0,
                explanation: "The Avalanche method targets the highest interest rate mathematically to save the most money on interest."
            },
            {
                id: "q3",
                question: "Which method is mathematically cheaper (saves more money)?",
                options: [
                    "Snowball",
                    "Avalanche",
                    "Neither",
                    "Consolidation"
                ],
                correct_answer_index: 1,
                explanation: "By eliminating high-interest debt first, the Avalanche method reduces the total amount of interest paid over time."
            },
            {
                id: "q4",
                question: "Why might someone choose the Snowball method over the Avalanche?",
                options: [
                    "They hate math",
                    "They need motivation from seeing debts disappear quickly",
                    "It is faster",
                    "It is required by law"
                ],
                correct_answer_index: 1,
                explanation: "Psychology often matters more than math. The feeling of progress from closing accounts helps people stick to the plan."
            },
            {
                id: "q5",
                question: "Regardless of the method, what must you do with your other debts?",
                options: [
                    "Ignore them",
                    "Pay half payments",
                    "Continue making minimum payments",
                    "Consolidate them"
                ],
                correct_answer_index: 2,
                explanation: "You must always maintain minimum payments on all debts to avoid penalties and credit score damage while attacking one target debt."
            }
        ]
    },

    // 9. Stock Market Myths
    {
        id: "quiz-market-myths",
        article_id: "stock-market-myths",
        title: "Quiz: Myth Buster",
        description: "Separate fact from fiction.",
        questions: [
            {
                id: "q1",
                question: "Is investing different from gambling?",
                options: [
                    "No, it's all luck",
                    "Yes, investing owns real assets with positive expected returns",
                    "No, both are rigged",
                    "Yes, gambling is safer"
                ],
                correct_answer_index: 1,
                explanation: "Gambling is a zero-sum game against the house. Investing allows you to participate in the value creation of businesses."
            },
            {
                id: "q2",
                question: "Can you time the market consistently?",
                options: [
                    "Yes, if you watch the news",
                    "Yes, professionals do it all the time",
                    "No, historically, time IN the market beats timing the market",
                    "Yes, using AI"
                ],
                correct_answer_index: 2,
                explanation: "Missing just the best 10 days in the market over 20 years can cut returns in half. Staying invested is the reliable strategy."
            },
            {
                id: "q3",
                question: "Do you need $10,000 to start investing?",
                options: [
                    "Yes, most brokers require it",
                    "No, you can start with very small amounts",
                    "Yes, otherwise fees eat your profit",
                    "No, but you need at least $5,000"
                ],
                correct_answer_index: 1,
                explanation: "Fractional shares and modern apps allow you to start with as little as $5 or $10."
            },
            {
                id: "q4",
                question: "What is the best way to handle stock market risk?",
                options: [
                    "Avoid stocks completely",
                    "Buy only one 'safe' stock",
                    "Diversification (buying many different stocks)",
                    "Panic sell when things drop"
                ],
                correct_answer_index: 2,
                explanation: "Diversification spreads your risk. If one company fails, it doesn't ruin your entire portfolio."
            },
            {
                id: "q5",
                question: "When the market crashes, what should a long-term investor typically do?",
                options: [
                    "Sell everything to cash",
                    "Stay calm and stay invested (or buy more)",
                    "Short the market",
                    "Stop checking their account"
                ],
                correct_answer_index: 1,
                explanation: "Panic selling locks in losses. History shows markets recover, and downturns are often buying opportunities."
            }
        ]
    },

    // 10. P/E Ratio
    {
        id: "quiz-pe-ratio",
        article_id: "pe-ratio-explained",
        title: "Quiz: Valuation & P/E",
        description: "Test your skills in valuing companies.",
        questions: [
            {
                id: "q1",
                question: "What calculates the P/E ratio?",
                options: [
                    "Price / Dividend",
                    "Price / Earnings per Share (EPS)",
                    "Profit / Equity",
                    "Price / EBIT"
                ],
                correct_answer_index: 1,
                explanation: "P/E is the Stock Price divided by the Earnings Per Share."
            },
            {
                id: "q2",
                question: "Generally, what does a very high P/E ratio indicate?",
                options: [
                    "The company is undervalued",
                    "The company is bankrupt",
                    "Investors expect high future growth",
                    "The company pays high dividends"
                ],
                correct_answer_index: 2,
                explanation: "Investors are willing to pay a premium today (higher price) because they expect earnings to grow significantly in the future."
            },
            {
                id: "q3",
                question: "Which P/E ratio uses estimated future earnings?",
                options: [
                    "Trailing P/E",
                    "Forward P/E",
                    "Historical P/E",
                    "Current P/E"
                ],
                correct_answer_index: 1,
                explanation: "Forward P/E looks ahead at analyst estimates for the next 12 months."
            },
            {
                id: "q4",
                question: "Should you compare the P/E ratios of a Tech company and a Utility company?",
                options: [
                    "Yes, P/E is universal",
                    "No, different industries have different standard valuations",
                    "Yes, lower is always better",
                    "No, neither is relevant"
                ],
                correct_answer_index: 1,
                explanation: "Industries grow at different rates. Tech usually has higher P/Es than stable, slow-growth Utilities. Compare apples to apples."
            },
            {
                id: "q5",
                question: "If Company A has a P/E of 15 and Company B has a P/E of 30, which is 'cheaper' relative to earnings?",
                options: [
                    "Company A",
                    "Company B",
                    "They are the same",
                    "Cannot tell"
                ],
                correct_answer_index: 0,
                explanation: "Company A costs $15 for every $1 of earnings, while B costs $30. A is cheaper on a valuation basis."
            }
        ]
    },

    // 11. Technical Analysis Basics (Article)
    {
        id: "quiz-technical-basics-article",
        article_id: "technical-analysis-basics",
        title: "Quiz: Chart Reading 101",
        description: "The basics of technical analysis.",
        questions: [
            {
                id: "q1",
                question: "What is the core philosophy of Technical Analysis?",
                options: [
                    "Buy good businesses",
                    "Price discounts everything (all info is in the price)",
                    "Management matters most",
                    "Dividends are king"
                ],
                correct_answer_index: 1,
                explanation: "Technical analysts believe that all fundamental factors are already reflected in the current market price."
            },
            {
                id: "q2",
                question: "Which of these is a Technical Analysis tool?",
                options: [
                    "Balance Sheet",
                    "Income Statement",
                    "Moving Averages",
                    "Cash Flow Statement"
                ],
                correct_answer_index: 2,
                explanation: "Moving averages are mathematical calculations based on price history, a key tool for chartists."
            },
            {
                id: "q3",
                question: "What does 'Resistance' mean on a chart?",
                options: [
                    "A price floor where buying is strong",
                    "A price ceiling where selling is strong",
                    "The broker's fee",
                    "A market crash"
                ],
                correct_answer_index: 1,
                explanation: "Resistance is a level where the price has trouble rising above because sellers enter the market there."
            },
            {
                id: "q4",
                question: "Does Technical Analysis guarantee future price movements?",
                options: [
                    "Yes, 100%",
                    "No, it deals in probabilities, not certainties",
                    "Yes, if used with AI",
                    "No, it is useless"
                ],
                correct_answer_index: 1,
                explanation: "Nothing guarantees the future. TA helps identify high-probability setups."
            },
            {
                id: "q5",
                question: "What is a characteristic of a 'Trend'?",
                options: [
                    "Prices moving in a straight line",
                    "Higher Highs and Higher Lows (Uptrend)",
                    "Prices staying exactly the same",
                    "Random volatility"
                ],
                correct_answer_index: 1,
                explanation: "An uptrend is defined by a series of higher highs and higher lows."
            }
        ]
    },

    // --------------------------------------------------------------------------
    // MAIN SECTIONS - COMPREHENSIVE QUIZZES
    // --------------------------------------------------------------------------

    // Fundamental Analysis Main Section
    {
        id: "quiz-fundamental-analysis-section",
        article_id: "fundamental-analysis-intro",
        title: "Comprehensive Quiz: Fundamental Analysis",
        description: "Verify your mastery of fundamental analysis concepts.",
        questions: [
            {
                id: "q1",
                question: "Which financial statement shows a company's assets, liabilities, and equity at a specific point in time?",
                options: [
                    "Income Statement",
                    "Cash Flow Statement",
                    "Balance Sheet",
                    "Annual Report"
                ],
                correct_answer_index: 2,
                explanation: "The Balance Sheet is a snapshot of what the company owns and owes at a single moment."
            },
            {
                id: "q2",
                question: "What is 'Top Line' growth referring to?",
                options: [
                    "Net Income",
                    "Revenue/Sales",
                    "EPS",
                    "Dividends"
                ],
                correct_answer_index: 1,
                explanation: "The 'Top Line' of an income statement is Revenue (Sales). 'Bottom Line' is Net Income."
            },
            {
                id: "q3",
                question: "The Debt-to-Equity ratio measures...",
                options: [
                    "Profitability",
                    "Liquidity",
                    "Solvency/Leverage",
                    "Efficiency"
                ],
                correct_answer_index: 2,
                explanation: "It indicates how much debt a company is using to finance its assets relative to the value of shareholders' equity."
            },
            {
                id: "q4",
                question: "What is 'Free Cash Flow'?",
                options: [
                    "Cash given away for free",
                    "Operating Cash Flow minus Capital Expenditures",
                    "Net Income plus Depreciation",
                    "Total Revenue minus Expenses"
                ],
                correct_answer_index: 1,
                explanation: "FCF is the cash a company generates after accounting for cash outflows to support operations and maintain its capital assets."
            },
            {
                id: "q5",
                question: "What is a 'Moat' in investing terms?",
                options: [
                    "A water body around a factory",
                    "A competitive advantage that protects market share",
                    "A type of bank account",
                    "A government subsidy"
                ],
                correct_answer_index: 1,
                explanation: "Popularized by Warren Buffett, a moat is a durable competitive advantage (brand, network effect, patent) that protects profits."
            },
            {
                id: "q6",
                question: "Which is a 'Qualitative' factor?",
                options: [
                    "Revenue Growth",
                    "Brand Reputation",
                    "Profit Margin",
                    "P/E Ratio"
                ],
                correct_answer_index: 1,
                explanation: "Qualitative factors are subjective and hard to measure with numbers, unlike quantitative data."
            },
            {
                id: "q7",
                question: "Return on Equity (ROE) measures...",
                options: [
                    "How much debt the company has",
                    "How efficiently management uses shareholders' capital to generate profit",
                    "The stock price increase",
                    "The dividend payout"
                ],
                correct_answer_index: 1,
                explanation: "ROE = Net Income / Shareholders' Equity. It shows profitability relative to shareholder investment."
            },
            {
                id: "q8",
                question: "If a company buys back its own shares, what usually happens to EPS?",
                options: [
                    "It decreases",
                    "It increases",
                    "Stays the same",
                    "It becomes zero"
                ],
                correct_answer_index: 1,
                explanation: "Buybacks reduce the number of outstanding shares. Since EPS = Earnings / Shares, reducing the denominator increases the EPS."
            }
        ]
    },

    // Technical Analysis Main Section
    {
        id: "quiz-technical-analysis-section",
        article_id: "technical-analysis-intro",
        title: "Comprehensive Quiz: Technical Analysis",
        description: "Verify your mastery of technical analysis concepts.",
        questions: [
            {
                id: "q1",
                question: "What divides a candlestick body?",
                options: [
                    "The High and Low",
                    "The Open and Close",
                    "The Volume and Price",
                    "The Bid and Ask"
                ],
                correct_answer_index: 1,
                explanation: "The 'body' of the candle is formed by the difference between the Opening price and the Closing price."
            },
            {
                id: "q2",
                question: "A 'Golden Cross' occurs when...",
                options: [
                    "A short-term moving average crosses above a long-term moving average",
                    "A long-term moving average crosses above a short-term one",
                    "Price drops below the 200-day MA",
                    "RSI goes above 70"
                ],
                correct_answer_index: 0,
                explanation: "Typically, when the 50-day MA crosses *above* the 200-day MA, signaling a potential long-term bull market."
            },
            {
                id: "q3",
                question: "What does a 'Head and Shoulders' pattern typically signal?",
                options: [
                    "Trend continuation",
                    "Trend reversal (Bearish)",
                    "Trend reversal (Bullish)",
                    "Low volatility"
                ],
                correct_answer_index: 1,
                explanation: "It is one of the most reliable trend reversal patterns, signaling the end of an uptrend and start of a downtrend."
            },
            {
                id: "q4",
                question: "Bollinger Bands are used to measure...",
                options: [
                    "Volume",
                    "Volatility",
                    "Momentum",
                    "Sentiment"
                ],
                correct_answer_index: 1,
                explanation: "The bands expand when volatility increases and contract when volatility decreases."
            },
            {
                id: "q5",
                question: "What is a 'Doji' candle?",
                options: [
                    "A long green candle",
                    "A candle with no body (Open equals Close)",
                    "A candle with no wick",
                    "A gap up"
                ],
                correct_answer_index: 1,
                explanation: "A Doji represents indecision in the market, where buyers and sellers matched each other, closing at the opening price."
            },
            {
                id: "q6",
                question: "MACD stands for...",
                options: [
                    "Mean Average Calculation Data",
                    "Moving Average Convergence Divergence",
                    "Market Analysis Chart Direction",
                    "Multi-Asset Class Divergence"
                ],
                correct_answer_index: 1,
                explanation: "It is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price."
            },
            {
                id: "q7",
                question: "If volume decreases while price is rising, what does it often suggest?",
                options: [
                    "Strong trend",
                    "Weak trend (Divergence)",
                    "Market crash imminent",
                    "High liquidity"
                ],
                correct_answer_index: 1,
                explanation: "Volume confirms trends. Rising price on falling volume suggests big players aren't participating, and the trend may reverse."
            },
            {
                id: "q8",
                question: "Which level is a key Fibonacci Retracement level?",
                options: [
                    "10%",
                    "61.8%",
                    "99%",
                    "45%"
                ],
                correct_answer_index: 1,
                explanation: "61.8% (the Golden Ratio) is considered one of the most significant retracement levels in technical analysis."
            }
        ]
    }
];
