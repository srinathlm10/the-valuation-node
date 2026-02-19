import { Quiz } from "@/services/quizService";

export const localQuizzes: Quiz[] = [
    // --- Basics (Article Quizzes) ---
    {
        id: "quiz-compound-interest",
        article_id: "compound-interest-basics",
        title: "Quiz: Compound Interest",
        description: "Test your knowledge on how compound interest works.",
        questions: [
            {
                id: "q1",
                question: "What is compound interest?",
                options: [
                    "Interest earned only on the principal amount",
                    "Interest earned on the principal and accumulated interest",
                    "A fixed fee paid by the bank",
                    "Interest that decreases over time"
                ],
                correct_answer_index: 1,
                explanation: "Compound interest is calculated on the initial principal and also on the accumulated interest of previous periods."
            },
            {
                id: "q2",
                question: "Which factor does NOT affect compound interest calculation directly?",
                options: [
                    "Principal amount",
                    "Interest rate",
                    "Time period",
                    "Inflation rate"
                ],
                correct_answer_index: 3,
                explanation: "While inflation affects real value, the compound interest formula A = P(1 + r/n)^(nt) depends on Principal, Rate, and Time."
            },
            {
                id: "q3",
                question: "Why is starting early important for compound interest?",
                options: [
                    "Banks give better rates to young people",
                    "You have more time for your money to grow exponentially",
                    "Taxes are lower for young investors",
                    "It is not important"
                ],
                correct_answer_index: 1,
                explanation: "Time is a key exponent in the formula. More time allows the 'snowball effect' to work more effectively."
            }
        ]
    },
    {
        id: "quiz-index-funds",
        article_id: "index-funds-101",
        title: "Quiz: Index Funds",
        description: "Check your understanding of Index Funds.",
        questions: [
            {
                id: "q1",
                question: "What is an Index Fund?",
                options: [
                    "A fund that tries to beat the market by picking stocks",
                    "A fund that tracks a specific market index like the S&P 500",
                    "A government savings bond",
                    "A high-risk cryptocurrency fund"
                ],
                correct_answer_index: 1,
                explanation: "An index fund is a mutual fund or ETF designed to follow certain preset rules so that the fund can track a specified basket of underlying investments."
            },
            {
                id: "q2",
                question: "What is a major advantage of index funds?",
                options: [
                    "Guaranteed returns",
                    "Low expense ratios and diversification",
                    "Ability to double your money overnight",
                    "Zero risk of loss"
                ],
                correct_answer_index: 1,
                explanation: "Index funds typically have lower fees (expense ratios) because they are passively managed, and they offer broad market exposure."
            }
        ]
    },
    {
        id: "quiz-emergency-fund",
        article_id: "building-emergency-fund",
        title: "Quiz: Emergency Funds",
        description: "Are you ready for financial emergencies?",
        questions: [
            {
                id: "q1",
                question: "How much should you generally save in an emergency fund?",
                options: [
                    "1 month of income",
                    "3-6 months of essential expenses",
                    "1 year of gross salary",
                    "$1,000 flat"
                ],
                correct_answer_index: 1,
                explanation: "Most financial experts recommend having 3 to 6 months' worth of essential living expenses saved."
            },
            {
                id: "q2",
                question: "Where is the best place to keep an emergency fund?",
                options: [
                    "Under your mattress",
                    "In the stock market",
                    "High-yield savings account",
                    "Checking account"
                ],
                correct_answer_index: 2,
                explanation: "A high-yield savings account offers safety, liquidity (easy access), and earns some interest, unlike checking accounts or cash."
            }
        ]
    },
    {
        id: "quiz-budgeting-503020",
        article_id: "50-30-20-budgeting",
        title: "Quiz: The 50/30/20 Rule",
        description: "Test your budgeting knowledge.",
        questions: [
            {
                id: "q1",
                question: "In the 50/30/20 rule, what does the '50' represent?",
                options: [
                    "Savings",
                    "Wants",
                    "Needs",
                    "Debt"
                ],
                correct_answer_index: 2,
                explanation: "50% of your income should go towards Needs (housing, groceries, utilities)."
            },
            {
                id: "q2",
                question: "Which category does 'Dining Out' fall into?",
                options: [
                    "Needs",
                    "Wants",
                    "Savings",
                    "None of the above"
                ],
                correct_answer_index: 1,
                explanation: "Dining out is considered a 'Want' in this framework."
            }
        ]
    },
    {
        id: "quiz-credit-score",
        article_id: "credit-score-explained",
        title: "Quiz: Credit Scores",
        description: "Do you know what impacts your credit?",
        questions: [
            {
                id: "q1",
                question: "Which factor has the biggest impact on your FICO credit score?",
                options: [
                    "Credit Mix",
                    "Length of Credit History",
                    "Payment History",
                    "New Credit"
                ],
                correct_answer_index: 2,
                explanation: "Payment History accounts for 35% of your FICO score, making it the most significant factor."
            },
            {
                id: "q2",
                question: "What is a recommended credit utilization ratio?",
                options: [
                    "Below 30%",
                    "Exactly 50%",
                    "Above 70%",
                    "It doesn't matter"
                ],
                correct_answer_index: 0,
                explanation: "Experts recommend keeping your credit utilization below 30% to maintain a healthy score."
            }
        ]
    },
    {
        id: "quiz-retirement",
        article_id: "retirement-planning-basics",
        title: "Quiz: Retirement Planning",
        description: "Are you prepared for the future?",
        questions: [
            {
                id: "q1",
                question: "What is the key difference between a Traditional and Roth IRA?",
                options: [
                    "Contribution limits",
                    "Investment options",
                    "When you pay taxes (Now vs. Later)",
                    "Eligibility age"
                ],
                correct_answer_index: 2,
                explanation: "Traditional IRAs offer tax deductions now (taxed later), while Roth IRAs are funded with after-tax money (tax-free withdrawals later)."
            },
            {
                id: "q2",
                question: "What does 'employer match' mean in a 401(k)?",
                options: [
                    "Your employer picks your investments",
                    "Your employer contributes money effectively doubling your contribution up to a limit",
                    "Your employer taxes your contribution",
                    "It is a fee you pay to your employer"
                ],
                correct_answer_index: 1,
                explanation: "An employer match is free money given by your employer into your retirement account, usually matching a percentage of what you contribute."
            }
        ]
    },
    {
        id: "quiz-stock-myths",
        article_id: "stock-market-myths",
        title: "Quiz: Market Myths",
        description: "Can you separate fact from fiction?",
        questions: [
            {
                id: "q1",
                question: "Is investing in the stock market the same as gambling?",
                options: [
                    "Yes, it is exactly the same",
                    "No, investing buys ownership in real businesses with positive expected returns",
                    "Only if you buy tech stocks",
                    "Yes, because you can lose money"
                ],
                correct_answer_index: 1,
                explanation: "Gambling is a zero-sum game. Investing owns productive assets that grow with the economy over the long term."
            },
            {
                id: "q2",
                question: "Do you need a lot of money to start investing?",
                options: [
                    "Yes, at least $10,000",
                    "No, you can start with very small amounts",
                    "Yes, because of high broker fees",
                    "No, but it's not worth it if you're poor"
                ],
                correct_answer_index: 1,
                explanation: "With fractional shares and zero-commission brokers, you can start investing with as little as $5."
            }
        ]
    },
    {
        id: "quiz-pe-ratio",
        article_id: "pe-ratio-explained",
        title: "Quiz: P/E Ratio",
        description: "Test your valuation knowledge.",
        questions: [
            {
                id: "q1",
                question: "What does P/E stand for?",
                options: [
                    "Profit to Earnings",
                    "Price to Earnings",
                    "Price to Equity",
                    "Public to Exchange"
                ],
                correct_answer_index: 1,
                explanation: "P/E stands for Price-to-Earnings ratio."
            },
            {
                id: "q2",
                question: "A high P/E ratio typically implies...",
                options: [
                    "The company is going bankrupt",
                    "Investors expect high growth or the stock is overvalued",
                    "The company has no earnings",
                    "The stock is very cheap"
                ],
                correct_answer_index: 1,
                explanation: "A high P/E suggests investors are willing to pay more for each dollar of earnings, usually because they expect future growth."
            }
        ]
    },
    {
        id: "quiz-technical-basics",
        article_id: "technical-analysis-basics",
        title: "Quiz: Technical Analysis Basics",
        description: "Charts and patterns quiz.",
        questions: [
            {
                id: "q1",
                question: "What does Technical Analysis primarily focus on?",
                options: [
                    "Company financial statements",
                    "Management team quality",
                    "Price action and volume",
                    "Economic news"
                ],
                correct_answer_index: 2,
                explanation: "Technical analysis ignores business fundamentals and focuses on statistical trends gathered from trading activity, such as price movement and volume."
            },
            {
                id: "q2",
                question: "What is a 'Support' level?",
                options: [
                    "A price level where a stock has difficulty falling below",
                    "A price level where a stock has difficulty rising above",
                    "The customer service number",
                    "When the government buys the stock"
                ],
                correct_answer_index: 0,
                explanation: "Support is a price level where a downtrend can be expected to pause due to a concentration of demand (buying interest)."
            }
        ]
    },

    // --- Fundamental Analysis Section Quiz ---
    {
        id: "quiz-fundamental-analysis-section",
        article_id: "fundamental-analysis-intro", // Virtual ID
        title: "Quiz: Fundamental Analysis Mastery",
        description: "Test your comprehensive knowledge of Fundamental Analysis.",
        questions: [
            {
                id: "q1",
                question: "Which of the following is NOT a core Financial Statement?",
                options: [
                    "Balance Sheet",
                    "Income Statement",
                    "Cash Flow Statement",
                    "Daily Stock Price Report"
                ],
                correct_answer_index: 3,
                explanation: "The three core financial statements are the Balance Sheet, Income Statement, and Cash Flow Statement."
            },
            {
                id: "q2",
                question: "What does 'EPS' stand for?",
                options: [
                    "Earnings Per Share",
                    "Equity Price Standard",
                    "Estimation of Profit Share",
                    "Earnings Plus Sales"
                ],
                correct_answer_index: 0,
                explanation: "EPS stands for Earnings Per Share, which is a company's profit divided by the outstanding shares of its common stock."
            },
            {
                id: "q3",
                question: "What is the 'Intrinsic Value' of a stock?",
                options: [
                    "The current market price",
                    "The calculated 'true' value based on fundamentals",
                    "The highest price it has ever reached",
                    "The price listed on the IPO"
                ],
                correct_answer_index: 1,
                explanation: "Intrinsic value is an estimate of the actual worth of a company, based on its fundamentals, distinct from its current market price."
            },
            {
                id: "q4",
                question: "Which ratio helps assess a company's ability to pay short-term obligations?",
                options: [
                    "P/E Ratio",
                    "Debt-to-Equity Ratio",
                    "Current Ratio",
                    "Dividend Yield"
                ],
                correct_answer_index: 2,
                explanation: "The Current Ratio (Current Assets / Current Liabilities) measures a company's ability to pay short-term obligations."
            }
        ]
    },

    // --- Technical Analysis Section Quiz ---
    {
        id: "quiz-technical-analysis-section",
        article_id: "technical-analysis-intro", // Virtual ID
        title: "Quiz: Technical Analysis Proficiency",
        description: "Challenge yourself on Technical Analysis concepts.",
        questions: [
            {
                id: "q1",
                question: "What is a 'Candlestick' in charting?",
                options: [
                    "A type of wax used in trading desks",
                    "A visual representation of price movement (Open, High, Low, Close)",
                    "A steady line graph",
                    "A bar chart with no color"
                ],
                correct_answer_index: 1,
                explanation: "A candlestick chart displays the high, low, open, and closing prices of a security for a specific period."
            },
            {
                id: "q2",
                question: "What does RSI stand for?",
                options: [
                    "Relative Strength Index",
                    "Real Stock Indicator",
                    "Rate of Sales Increase",
                    "Risk Standard Index"
                ],
                correct_answer_index: 0,
                explanation: "RSI (Relative Strength Index) is a momentum indicator used to evaluate overbought or oversold conditions."
            },
            {
                id: "q3",
                question: "If the RSI is above 70, the stock is generally considered...",
                options: [
                    "Oversold",
                    "Overbought",
                    "Neutral",
                    "Crashed"
                ],
                correct_answer_index: 1,
                explanation: "Traditionally, an RSI above 70 indicates that a security is becoming overbought or overvalued."
            },
            {
                id: "q4",
                question: "What is a 'moving average' used for?",
                options: [
                    "To predict the exact closing price",
                    "To smooth out price data and identify trends",
                    "To calculate divident payouts",
                    "To measure volume"
                ],
                correct_answer_index: 1,
                explanation: "Moving averages smooth out price action by filtering out the 'noise' from random short-term price fluctuations."
            }
        ]
    }
];
