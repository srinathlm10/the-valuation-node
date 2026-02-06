-- 1. Create Posts Table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text not null check (category in ('General', 'Stocks', 'Mutual Funds', 'Q&A', 'News')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Comments Table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Post Likes Table (Toggle Like)
create table if not exists public.post_likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, post_id)
);

-- 4. Enable RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;

-- Policies for Posts
create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Authenticated users can create posts" on public.posts for insert with check (auth.role() = 'authenticated');
create policy "Users can update own posts" on public.posts for update using (auth.uid() = user_id);
create policy "Users can delete own posts" on public.posts for delete using (auth.uid() = user_id);

-- Policies for Comments
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Authenticated users can create comments" on public.comments for insert with check (auth.role() = 'authenticated');
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Policies for Likes
create policy "Likes are viewable by everyone" on public.post_likes for select using (true);
create policy "Authenticated users can toggle likes" on public.post_likes for insert with check (auth.role() = 'authenticated');
create policy "Users can remove own likes" on public.post_likes for delete using (auth.uid() = user_id);

-- 5. Realtime Subscription (Optional but good for chat)
-- You can enable this in the Supabase Dashboard > Database > Replication
-- alter publication supabase_realtime add table public.posts, public.comments;
