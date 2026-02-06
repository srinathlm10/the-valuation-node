-- 1. Create Stocks Table
create table if not exists public.stocks (
  id text primary key, -- e.g. "RELIANCE"
  name text not null,
  sector text not null,
  market_cap numeric not null,
  pe_ratio numeric not null,
  pb_ratio numeric not null,
  roe numeric not null,
  debt_to_equity numeric not null,
  dividend_yield numeric not null,
  eps numeric not null,
  revenue_growth_5y numeric not null,
  profit_growth_5y numeric not null,
  current_price numeric not null,
  week_high_52 numeric not null,
  week_low_52 numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.stocks enable row level security;
create policy "Stocks are viewable by everyone." on stocks for select using (true);

-- 3. Seed Data (from stocks.json)
insert into public.stocks (id, name, sector, market_cap, pe_ratio, pb_ratio, roe, debt_to_equity, dividend_yield, eps, revenue_growth_5y, profit_growth_5y, current_price, week_high_52, week_low_52) values
('RELIANCE', 'Reliance Industries Ltd', 'Oil & Gas', 1987654, 28.5, 2.8, 12.4, 0.42, 0.35, 98.2, 14.2, 18.6, 2845, 3024, 2180),
('TCS', 'Tata Consultancy Services Ltd', 'IT Services', 1456789, 32.1, 14.2, 48.5, 0.05, 1.25, 124.5, 12.8, 10.2, 4012, 4255, 3180),
('HDFCBANK', 'HDFC Bank Ltd', 'Banking', 1234567, 21.4, 3.1, 16.8, 0.85, 1.1, 78.4, 18.5, 22.1, 1678, 1794, 1362),
('INFY', 'Infosys Ltd', 'IT Services', 756432, 26.8, 8.4, 32.1, 0.08, 2.4, 68.2, 11.4, 9.8, 1824, 1962, 1358),
('ICICIBANK', 'ICICI Bank Ltd', 'Banking', 845621, 18.9, 3.4, 18.2, 0.78, 0.85, 62.4, 16.2, 28.4, 1182, 1285, 892),
('HINDUNILVR', 'Hindustan Unilever Ltd', 'FMCG', 598745, 58.2, 11.8, 21.4, 0.02, 1.65, 42.8, 8.2, 12.4, 2492, 2859, 2172),
('BHARTIARTL', 'Bharti Airtel Ltd', 'Telecom', 945678, 78.4, 6.2, 8.4, 1.24, 0.42, 21.8, 14.8, 45.2, 1712, 1778, 1142),
('ITC', 'ITC Ltd', 'FMCG', 612345, 28.4, 7.8, 28.6, 0.01, 2.85, 17.2, 6.8, 14.2, 488, 528, 398),
('KOTAKBANK', 'Kotak Mahindra Bank Ltd', 'Banking', 412567, 22.8, 3.8, 14.2, 0.68, 0.12, 82.4, 12.4, 18.6, 1878, 2062, 1544),
('SBIN', 'State Bank of India', 'Banking', 756234, 11.2, 1.8, 17.4, 0.92, 1.42, 75.8, 14.2, 32.8, 848, 912, 598),
('BAJFINANCE', 'Bajaj Finance Ltd', 'NBFC', 512456, 34.2, 7.4, 22.8, 3.42, 0.38, 248.6, 24.6, 28.4, 8512, 8924, 6142),
('MARUTI', 'Maruti Suzuki India Ltd', 'Automobile', 398765, 28.6, 5.2, 18.4, 0.02, 0.72, 452.8, 12.8, 22.4, 12945, 13562, 9842),
('AXISBANK', 'Axis Bank Ltd', 'Banking', 378945, 14.8, 2.2, 16.2, 0.82, 0.08, 78.4, 15.8, 42.6, 1162, 1285, 842),
('LT', 'Larsen & Toubro Ltd', 'Infrastructure', 512678, 38.4, 5.8, 15.2, 1.12, 0.68, 98.2, 8.4, 12.8, 3768, 3982, 2845),
('ASIANPAINT', 'Asian Paints Ltd', 'Consumer Goods', 298456, 62.4, 18.2, 28.6, 0.18, 0.85, 48.2, 14.2, 18.4, 3012, 3542, 2412),
('HCLTECH', 'HCL Technologies Ltd', 'IT Services', 456789, 24.2, 6.8, 24.8, 0.12, 3.42, 72.4, 13.8, 16.2, 1752, 1892, 1242),
('SUNPHARMA', 'Sun Pharmaceutical Industries Ltd', 'Pharma', 412567, 42.8, 5.4, 12.8, 0.08, 0.62, 42.6, 8.2, 24.6, 1824, 1962, 1142),
('WIPRO', 'Wipro Ltd', 'IT Services', 298456, 22.4, 4.2, 18.6, 0.14, 0.18, 24.8, 9.8, 12.4, 556, 598, 398),
('TATAMOTORS', 'Tata Motors Ltd', 'Automobile', 378945, 8.4, 2.8, 32.4, 0.98, 0.42, 118.4, 18.4, 156.2, 994, 1179, 612),
('POWERGRID', 'Power Grid Corporation of India Ltd', 'Power', 312456, 18.2, 2.4, 14.2, 1.48, 3.85, 18.6, 8.4, 12.8, 338, 362, 242)
on conflict (id) do nothing;
