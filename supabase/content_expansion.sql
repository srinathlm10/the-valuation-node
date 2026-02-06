-- NEW ARTICLES

-- 1. Understanding IPOs
insert into public.articles (id, title, excerpt, content, category_id, difficulty, reading_time, author, published_at, key_takeaways) values
('understanding-ipos', 'Understanding IPOs: How to Invest in New Companies', 'A beginner''s guide to Initial Public Offerings (IPOs) in the Indian stock market.', 
'# What is an IPO?
An Initial Public Offering (IPO) is when a private company offers shares to the public in a new stock issuance. It allows the company to raise capital from public investors.

## Why do Companies go Public?
- **Raise Capital**: For expansion, paying debts, or R&D.
- **Liquidity**: Founders and early investors can sell their stakes.
- **Prestige**: Public companies often have higher visibility.

## The Process in India
1. **DRHP Filing**: The company files a Draft Red Herring Prospectus with SEBI.
2. **Approval**: SEBI reviews and approves the document.
3. **Price Band**: The company announces the price range for shares.
4. **Bidding**: Retail investors bid for shares (usually in lots).
5. **Allotment**: Shares are credited to Demat accounts upon successful allotment.
6. **Listing**: The stock starts trading on NSE/BSE.

## Should You Invest?
Investing in IPOs can be lucrative (listing gains) but risky. Always read the RHP and understand the company''s business model before applying.', 
'investing', 'beginner', 5, 'FinBot Team', CURRENT_DATE, 
ARRAY['IPOs allow private companies to raise public capital', 'Retail investors need a Demat account to apply', 'Listing gains are not guaranteed'])
on conflict (id) do nothing;

-- 2. Taxation on Gains
insert into public.articles (id, title, excerpt, content, category_id, difficulty, reading_time, author, published_at, key_takeaways) values
('stock-market-taxes', 'Taxation on Stock Market Gains in India', 'Understand STCG and LTCG taxes on your equity investments.', 
'# Taxes on Equity Investments
In India, profits from stocks and equity mutual funds are taxed based on the holding period.

## Short Term Capital Gains (STCG)
- **Holding Period**: Less than 12 months.
- **Tax Rate**: 15% (plus cess).
- **Applicability**: If you sell shares within a year of buying.

## Long Term Capital Gains (LTCG)
- **Holding Period**: More than 12 months.
- **Tax Rate**: 10% (plus cess) on gains exceeding ₹1 Lakh in a financial year.
- **Exemption**: The first ₹1 Lakh of profit is tax-free!

## Intraday Trading
Profits from intraday trading are considered "Speculative Business Income" and are taxed according to your income tax slab, not the fixed capital gains rates.',
'taxes', 'intermediate', 4, 'FinBot Team', CURRENT_DATE, 
ARRAY['STCG is 15% for < 1 year holding', 'LTCG is 10% for > 1 year holding (above ₹1L)', 'Intraday is taxed as business income'])
on conflict (id) do nothing;

-- 3. Mutual Funds vs Direct Equity
insert into public.articles (id, title, excerpt, content, category_id, difficulty, reading_time, author, published_at, key_takeaways) values
('mutual-funds-vs-equity', 'Direct Equity vs Mutual Funds: Which is Right for You?', 'Comparing the risks and rewards of picking stocks versus investing in funds.', 
'# Direct Equity vs Mutual Funds

## Direct Equity (Stocks)
Buying shares of specific companies directly through a demat account.
- **Pros**: High potential returns, full control, dividend income.
- **Cons**: High risk, requires deep research, time-consuming.

## Mutual Funds
Pooled money managed by professional fund managers.
- **Pros**: Diversification, professional management, low barrier to entry (SIPs).
- **Cons**: Expense ratios (fees), lower control over specific stock selection.

## Verdict
- **Beginners**: Start with Mutual Funds (Index Funds or Flexi-cap) to build a base.
- **Experienced**: allocate a portion to direct stocks for alpha generation.',
'investing', 'beginner', 6, 'FinBot Team', CURRENT_DATE, 
ARRAY['Mutual funds offer diversification and professional management', 'Direct equity offers control but high risk', 'SIPs are a great way to start with mutual funds'])
on conflict (id) do nothing;


-- NEW DEFINITIONS

insert into public.definitions (id, term, full_name, category, category_id, definition, formula, why_it_matters, example) values
('sensex', 'Sensex', 'Sensitivity Index', 'Stock Market', 'investing', 'The benchmark index of the BSE, comprising 30 of the largest and most actively traded companies on the Bombay Stock Exchange.', NULL, 'It reflects the overall health of the Indian economy and market sentiment.', 'If Sensex goes up by 500 points, it generally means the market is bullish.'),
('nifty50', 'Nifty 50', 'National Stock Exchange Fifty', 'Stock Market', 'investing', 'The benchmark index of the NSE, representing the weighted average of 50 of the largest Indian companies across 13 sectors.', NULL, 'Used by investors to gauge the performance of the broader Indian stock market.', 'Many mutual funds try to mimic the returns of the Nifty 50.'),
('demat', 'Demat Account', 'Dematerialized Account', 'Investing', 'investing', 'An account used to hold financial securities (equity, debt) in electronic form.', NULL, 'Mandatory for trading in the Indian stock market.', 'You cannot buy shares of Reliance without a Demat account.'),
('dividend', 'Dividend', 'Dividend', 'Investing', 'investing', 'A portion of the company''s earnings distributed to shareholders.', 'Dividend Yield = (Dividend per Share / Current Price) * 100', 'Provides a source of passive income in addition to capital appreciation.', 'ITC declared a dividend of ₹5 per share.'),
('repo-rate', 'Repo Rate', 'Repurchasing Option Rate', 'Economy', 'investing', 'The rate at which the RBI lends money to commercial banks in the event of any shortfall of funds.', NULL, 'Control inflation and money supply in the economy.', 'If RBI increases Repo Rate, your home loan EMI might go up.'),
('circuit-breaker', 'Circuit Breaker', 'Circuit Breaker', 'Stock Market', 'investing', 'An automatic halt in trading imposed by the exchange to prevent panic selling or massive volatility.', NULL, 'Protects investors from extreme market crashes.', 'Trading was halted for 45 minutes after the Nifty fell 10%.'),
('face-value', 'Face Value', 'Face Value', 'Investing', 'investing', 'The nominal value of a security stated by the issuer.', NULL, 'Important for calculating dividends and stock splits.', 'A stock with Face Value ₹10 might trade at ₹500.'),
('bull-market', 'Bull Market', 'Bull Market', 'Stock Market', 'investing', 'A financial market condition where prices are rising or are expected to rise.', NULL, 'Indicates a strong economy and high investor confidence.', 'The post-COVID rally was a classic bull market.'),
('bear-market', 'Bear Market', 'Bear Market', 'Stock Market', 'investing', 'A market condition where prices fall 20% or more from recent highs.', NULL, 'Can signal an economic downturn or recession.', 'Investors often shift to gold or bonds during a bear market.'),
('blue-chip', 'Blue Chip', 'Blue Chip Stocks', 'Investing', 'investing', 'Shares of very large, well-recognized, and financially sound companies with a history of reliable performance.', NULL, 'Considered safer investments during volatility.', 'TCS and Reliance are considered blue-chip stocks.')
on conflict (id) do nothing;
