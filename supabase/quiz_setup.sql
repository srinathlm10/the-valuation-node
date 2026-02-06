-- 1. Create Quizzes Table
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  article_id text references public.articles(id) on delete cascade not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Questions Table
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question text not null,
  options text[] not null, -- Array of 4 strings
  correct_answer_index integer not null, -- 0 to 3
  explanation text, -- Optional explanation for the answer
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. User Quiz Attempts
create table if not exists public.user_quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer not null, -- Number of correct answers
  total_questions integer not null,
  passed boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS Policies
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.user_quiz_attempts enable row level security;

-- Quizzes/Questions are public readable
create policy "Quizzes are viewable by everyone" on public.quizzes for select using (true);
create policy "Questions are viewable by everyone" on public.questions for select using (true);

-- User Attempts: Users fetch their own, Insert their own
create policy "Users can view own quiz attempts" on public.user_quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own quiz attempts" on public.user_quiz_attempts for insert with check (auth.uid() = user_id);

-- 5. Seed Data (Quizzes for existing articles)

-- Quiz 1: IPOs (Using valid ID: 'understanding-ipos')
WITH new_quiz AS (
  INSERT INTO public.quizzes (article_id, title, description) 
  VALUES ('understanding-ipos', 'IPO Basics Challenge', 'Test your knowledge on Initial Public Offerings.')
  RETURNING id
)
INSERT INTO public.questions (quiz_id, question, options, correct_answer_index, explanation)
VALUES 
((SELECT id FROM new_quiz), 'What does IPO stand for?', ARRAY['Initial Public Offering', 'Indian Public Office', 'Internal Profit Organization', 'Initial Private Offer'], 0, 'IPO is when a private company first sells shares to the public.'),
((SELECT id FROM new_quiz), 'Which of these is a benefit of going public?', ARRAY['Less regulation', 'Raising capital', 'Lower visibility', 'No shareholders'], 1, 'Companies mainly go public to raise capital for expansion.'),
((SELECT id FROM new_quiz), 'What is the role of SEBI in an IPO?', ARRAY['To set the price', 'To buy shares', 'To regulate and approve the process', 'To sell shares'], 2, 'SEBI regulates the entire IPO process to protect investors.');

-- Quiz 2: Taxes (Using valid id: 'stock-market-taxes')
WITH new_quiz AS (
  INSERT INTO public.quizzes (article_id, title, description) 
  VALUES ('stock-market-taxes', 'Taxation Trivia', 'Do you know how your gains are taxed?')
  RETURNING id
)
INSERT INTO public.questions (quiz_id, question, options, correct_answer_index, explanation)
VALUES 
((SELECT id FROM new_quiz), 'What is the holding period for Long Term Capital Gains (LTCG) in equity?', ARRAY['6 months', '12 months', '24 months', '3 years'], 1, 'For equity, holding more than 12 months is considered Long Term.'),
((SELECT id FROM new_quiz), 'What is the tax rate for STCG on equity?', ARRAY['10%', '15%', '20%', '30%'], 1, 'Short Term Capital Gains (STCG) are taxed at 15%.'),
((SELECT id FROM new_quiz), 'Are intraday profits considered Capital Gains?', ARRAY['Yes, always', 'No, they are Speculative Business Income', 'Only if loss', 'No, they are tax-free'], 1, 'Intraday trading profits are treated as speculative business income.');

-- Quiz 3: Mutual Funds (Using valid id: 'mutual-funds-vs-equity')
WITH new_quiz AS (
  INSERT INTO public.quizzes (article_id, title, description) 
  VALUES ('mutual-funds-vs-equity', 'Mutual Funds vs Stocks', 'Which is right for you?')
  RETURNING id
)
INSERT INTO public.questions (quiz_id, question, options, correct_answer_index, explanation)
VALUES 
((SELECT id FROM new_quiz), 'What is a major advantage of Mutual Funds?', ARRAY['Guaranteed returns', 'Professional Management & Diversification', 'No fees', 'Instant doubling of money'], 1, 'Mutual funds are managed by experts and invest in a basket of stocks.'),
((SELECT id FROM new_quiz), 'Who controls the stock selection in Direct Equity?', ARRAY['Fund Manager', 'SEBI', 'You (The Investor)', 'The Bank'], 2, 'In direct equity, you have full control over which stocks to buy or sell.'),
((SELECT id FROM new_quiz), 'What is an expense ratio?', ARRAY['A fee charged by Mutual Funds', 'A tax to government', 'Brokerage fee', 'Profit share'], 0, 'Expense ratio is the annual fee charged by mutual funds to manage your money.');
