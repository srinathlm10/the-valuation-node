# Fresh Supabase Project Setup — The Valuation Node

Use this guide when creating a brand-new Supabase project (e.g. your previous project was paused).
Run every block in order — each one depends on the previous.

---

## Step 1 — Create the project

1. Go to **supabase.com** → Dashboard → **New project**
2. Name: `the-valuation-node`
3. Database password: generate a strong one and save it
4. Region: **Southeast Asia (ap-southeast-1)** or **South Asia (ap-south-1)** — whichever is available, pick the closer one to India
5. Plan: Free tier is fine to start
6. Click **Create new project** → wait ~2 minutes for provisioning

---

## Step 2 — Copy credentials

Go to **Project Settings** (gear icon) → **API**:

- Copy the **Project URL** — format: `https://xxxxxxxxxxxx.supabase.co`
- Copy the **anon / public** key — the long JWT string

---

## Step 3 — Update .env

Open `fin-bot-india/.env` and replace both values:

```
VITE_SUPABASE_URL=https://your-new-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key
```

If already deployed to Netlify: go to **Netlify → Site configuration → Environment variables**, update both vars, then trigger a redeploy.

---

## Step 4 — Run SQL in the SQL Editor

Open your new project → **SQL Editor** → **New query**. Run each block below in order.

---

### Block 1 — Core schema (run this first)

> The old `20260129...` migration has an incompatible `profiles` design. Use this fresh schema —
> it matches how `AuthContext.tsx` and the Week 1 RLS policies expect things to work.

```sql
-- ── PROFILES ──────────────────────────────────────────────────────
-- id = auth.users.id (not a separate auto-generated UUID)
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role         TEXT NOT NULL DEFAULT 'user',
  avatar_url   TEXT,
  streak_count INTEGER DEFAULT 0,
  last_login   TIMESTAMP WITH TIME ZONE,
  total_points INTEGER DEFAULT 0,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create a profile row on every new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── ARTICLES ──────────────────────────────────────────────────────
-- Includes all Week 1 research fields so migration_001 will be a no-op
CREATE TABLE public.articles (
  id                     TEXT PRIMARY KEY,
  slug                   TEXT,
  title                  TEXT NOT NULL,
  excerpt                TEXT,
  content                TEXT,
  category_id            TEXT,
  difficulty             TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  reading_time           INTEGER,
  author                 TEXT DEFAULT 'Srinath Gajji',
  published_at           TIMESTAMP WITH TIME ZONE DEFAULT now(),
  image_url              TEXT,
  key_takeaways          TEXT[],
  related_article_ids    TEXT[],
  status                 TEXT DEFAULT 'draft',
  -- Week 1 research fields
  methodology_summary    TEXT,
  model_download_url     TEXT,
  github_url             TEXT,
  where_i_might_be_wrong TEXT,
  citation_format        TEXT,
  update_log             JSONB DEFAULT '[]'::JSONB,
  is_research            BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ── DEFINITIONS ───────────────────────────────────────────────────
CREATE TABLE public.definitions (
  id             TEXT PRIMARY KEY,
  term           TEXT NOT NULL,
  full_name      TEXT,
  category       TEXT,
  definition     TEXT NOT NULL,
  formula        TEXT,
  why_it_matters TEXT,
  example        TEXT,
  related_terms  TEXT[]
);

ALTER TABLE public.definitions ENABLE ROW LEVEL SECURITY;

-- ── BOOKMARKS ─────────────────────────────────────────────────────
CREATE TABLE public.bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
```

---

### Block 2 — Stocks

Copy-paste the entire file: `supabase/stocks_setup.sql`

Creates the `stocks` table and seeds 20 Nifty 50 companies.

---

### Block 3 — Gamification

Copy-paste the entire file: `supabase/gamification_setup.sql`

Creates `badges` and `user_badges`. The `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS` lines are
no-ops since Block 1 already added those columns — that is fine.

---

### Block 4 — Chat history

~~Copy-paste `supabase/chat_history_setup.sql`~~ **Skip — chat feature removed for now.**

---

### Block 5 — Community

Copy-paste the entire file: `supabase/community_setup.sql`

Creates `posts`, `comments`, `post_likes`.

---

### Block 6 — RAG / pgvector

Copy-paste the entire file: `supabase/rag_setup.sql`

Enables the `pgvector` extension and creates `knowledge_embeddings`.
pgvector is available by default on all Supabase projects.

---

### Block 7 — Seed content (run before Block 8)

Copy-paste the entire file: `supabase/content_expansion.sql`

Inserts the three sample articles (IPO, taxation, mutual funds) and the glossary definitions.
**Must run before Block 8** — quizzes reference those article IDs.

---

### Block 8 — Quizzes

Copy-paste the entire file: `supabase/quiz_setup.sql`

Creates `quizzes`, `questions`, `user_quiz_attempts` and seeds 3 quizzes.

---

### Block 9 — Week 1: Research article fields

Copy-paste the file: `supabase/migrations/20260624_001_research_article_fields.sql`

The `ADD COLUMN IF NOT EXISTS` lines will be no-ops (all columns exist from Block 1),
but the citation auto-generate trigger is new and will be created here.

---

### Block 10 — Week 1: RLS policies

Copy-paste the file: `supabase/migrations/20260624_002_rls_policies.sql`

Uses `DROP POLICY IF EXISTS` before each `CREATE POLICY`, so it cleanly replaces any
earlier policies created by the setup files.

---

### Block 11 — Week 1: Profile trigger (refresh)

Copy-paste the file: `supabase/migrations/20260624_003_profile_trigger.sql`

`CREATE OR REPLACE FUNCTION` and `DROP TRIGGER IF EXISTS` make this idempotent.

---

## Step 5 — Configure Auth settings

In your Supabase project → **Authentication → Settings**:

- **Site URL:** your Netlify URL, e.g. `https://the-valuation-node.netlify.app`
  (use `http://localhost:5173` for local-only dev)
- **Redirect URLs** — add both:
  - `https://the-valuation-node.netlify.app/auth/callback`
  - `http://localhost:5173/auth/callback`
- Email confirmations: leave enabled (recommended for production)

**Authentication → Providers → Email** is already enabled by default.

---

## Step 6 — Set up OAuth providers

For every provider below, the **Callback URL** to paste into the third-party console is always:

```
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

You can find this URL in Supabase → Authentication → Providers → (any provider) → enable toggle.

### Google

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create credentials → OAuth 2.0 Client ID → Web application
3. Authorized redirect URI: the Supabase callback URL above
4. Copy Client ID and Client Secret
5. Supabase → Authentication → Providers → Google → enable → paste Client ID and Secret

### GitHub

1. Go to github.com → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: your site URL
3. Authorization callback URL: the Supabase callback URL above
4. Copy Client ID and generate a Client Secret
5. Supabase → Authentication → Providers → GitHub → enable → paste Client ID and Secret

### LinkedIn

1. Go to [developer.linkedin.com](https://developer.linkedin.com) → Create app
2. Products tab → request "Sign In with LinkedIn using OpenID Connect"
3. Auth tab → add the Supabase callback URL to Authorized redirect URLs
4. Copy Client ID and Client Secret
5. Supabase → Authentication → Providers → LinkedIn → enable → paste Client ID and Secret

---

## Step 7 — Make yourself an admin

After signing up on the site with your own email, run this in the SQL Editor
(replace the email with yours):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'srinathguna12@gmail.com'
);
```

Or do it manually: Table Editor → `profiles` → find your row → edit → set `role` to `admin`.

---

## What about old data?

The old (paused) project still has its data accessible until it is deleted.
If you want to export anything before starting fresh:

- Old project → **Table Editor** → select any table → **Download CSV**
- Worth doing for `articles` and `definitions` if you added custom content there

For the rebrand, starting fresh is the cleaner choice — `content_expansion.sql` repopulates
the seed content automatically.

---

## Quick-reference: SQL file run order

| # | File | Purpose |
|---|------|---------|
| 1 | Block 1 above (paste directly) | Core tables: profiles, articles, definitions, bookmarks |
| 2 | `supabase/stocks_setup.sql` | stocks table + 20 Nifty 50 seed rows |
| 3 | `supabase/gamification_setup.sql` | badges, user_badges |
| 4 | `supabase/chat_history_setup.sql` | chat_sessions, chat_messages |
| 5 | `supabase/community_setup.sql` | posts, comments, post_likes |
| 6 | `supabase/rag_setup.sql` | pgvector, knowledge_embeddings |
| 7 | `supabase/content_expansion.sql` | seed articles + definitions |
| 8 | `supabase/quiz_setup.sql` | quizzes, questions, attempts |
| 9 | `supabase/migrations/20260624_001_research_article_fields.sql` | citation trigger |
| 10 | `supabase/migrations/20260624_002_rls_policies.sql` | tightened RLS |
| 11 | `supabase/migrations/20260624_003_profile_trigger.sql` | profile trigger refresh |
