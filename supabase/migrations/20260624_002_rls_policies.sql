-- Migration: Tighten Row Level Security policies
-- Week 1 Step 17.3
-- PREREQUISITE: Run 20260625_004_role_column.sql first
--
-- profiles.id IS auth.uid() (the PK is the auth user ID directly).
-- bookmarks.user_id references auth.users directly.
-- All other user tables (posts, comments, etc.) have user_id referencing profiles.id = auth.uid().

-- ──────────────────────────────────────────────
-- articles: public read (published only), admin all
-- ──────────────────────────────────────────────
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can do everything on articles" ON public.articles;
CREATE POLICY "Admins can do everything on articles"
  ON public.articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ──────────────────────────────────────────────
-- definitions: public read, admin manage
-- ──────────────────────────────────────────────
ALTER TABLE public.definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read definitions" ON public.definitions;
CREATE POLICY "Public can read definitions"
  ON public.definitions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage definitions" ON public.definitions;
CREATE POLICY "Admins can manage definitions"
  ON public.definitions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ──────────────────────────────────────────────
-- stocks: public read, admin manage
-- ──────────────────────────────────────────────
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read stocks" ON public.stocks;
CREATE POLICY "Public can read stocks"
  ON public.stocks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage stocks" ON public.stocks;
CREATE POLICY "Admins can manage stocks"
  ON public.stocks FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ──────────────────────────────────────────────
-- profiles: own row only (profiles.id = auth.uid())
-- ──────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ──────────────────────────────────────────────
-- bookmarks: own rows only (bookmarks.user_id references auth.users directly)
-- ──────────────────────────────────────────────
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;

CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
