-- 1. Create Challenge Sessions Table
create table if not exists public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'New Chat' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Chat Messages Table
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- 4. RLS Policies for Sessions
create policy "Users can view own sessions" 
on public.chat_sessions for select 
using (auth.uid() = user_id);

create policy "Users can create own sessions" 
on public.chat_sessions for insert 
with check (auth.uid() = user_id);

create policy "Users can update own sessions" 
on public.chat_sessions for update 
using (auth.uid() = user_id);

create policy "Users can delete own sessions" 
on public.chat_sessions for delete 
using (auth.uid() = user_id);

-- 5. RLS Policies for Messages
-- Messages are accessible if the user owns the session
create policy "Users can view messages of own sessions" 
on public.chat_messages for select 
using (
  exists (
    select 1 from public.chat_sessions 
    where id = chat_messages.session_id 
    and user_id = auth.uid()
  )
);

create policy "Users can insert messages into own sessions" 
on public.chat_messages for insert 
with check (
  exists (
    select 1 from public.chat_sessions 
    where id = chat_messages.session_id 
    and user_id = auth.uid()
  )
);
