-- 1. Create Badges Table
create table if not exists public.badges (
  id text primary key, -- e.g. "first_step"
  name text not null,
  description text not null,
  icon_url text not null, -- URL to an icon or an identifier like "medal-1"
  category text not null check (category in ('learning', 'social', 'streak')), 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create User Badges Table (Many-to-Many)
create table if not exists public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text references public.badges(id) on delete cascade not null,
  awarded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, badge_id)
);

-- 3. Update Profiles Table for Streaks
-- Safe alter commands
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'streak_count') then
        alter table public.profiles add column streak_count integer default 0;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'last_login') then
        alter table public.profiles add column last_login timestamp with time zone;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'total_points') then
        alter table public.profiles add column total_points integer default 0;
    end if;
end $$;

-- 4. Enable RLS
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- Policies
-- Badges are viewable by everyone
create policy "Badges are viewable by everyone" on public.badges for select using (true);

-- User Badges are viewable by everyone (or just owner? letting everyone see for social proof)
create policy "User badges are viewable by everyone" on public.user_badges for select using (true);

-- Only system/service role should insert badges (for now, we'll allow authenticated triggers or edge functions, but for simplicity we rely on RLS bypass or specific policies if needed. defaults usually block insert).
-- Let's allow users to read their own profile updates (handled by existing profile policies).


-- 5. Seed Initial Badges
insert into public.badges (id, name, description, icon_url, category) values
('first_step', 'First Step', 'Completed your first article.', 'footprints', 'learning'),
('bookworm', 'Bookworm', 'Read 5 articles.', 'book', 'learning'),
('scholar', 'Scholar', 'Read 10 articles.', 'graduation-cap', 'learning'),
('week_warrior', 'Week Warrior', 'Logged in for 7 days in a row.', 'flame', 'streak'),
('social_butterfly', 'Social Butterfly', 'Posted your first comment.', 'message-circle', 'social')
on conflict (id) do nothing;
