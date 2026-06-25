-- Migration: RLS for gamification and community tables
-- Week 1 Step 17.3 (continuation)
-- PREREQUISITE: Run 20260625_004_role_column.sql first
--
-- profiles.id = auth.uid() (PK is auth user ID directly).
-- Tables with user_id referencing profiles.id can compare user_id = auth.uid() directly.

-- ──────────────────────────────────────────────
-- badges: existing public read is correct — add admin write
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can manage badges" ON public.badges;
CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ──────────────────────────────────────────────
-- user_badges: own read only (replace public-read policy)
-- (user_badges.user_id references profiles.id = auth.uid())
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "User badges are viewable by everyone" ON public.user_badges;
DROP POLICY IF EXISTS "Users can read own badges" ON public.user_badges;

CREATE POLICY "Users can read own badges"
  ON public.user_badges FOR SELECT
  USING (user_id = auth.uid());

-- ──────────────────────────────────────────────
-- quizzes + questions: existing public read is correct — add admin write
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ──────────────────────────────────────────────
-- user_quiz_attempts: fix existing policies
-- (user_quiz_attempts.user_id references profiles.id = auth.uid())
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.user_quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON public.user_quiz_attempts;

CREATE POLICY "Users can view own quiz attempts"
  ON public.user_quiz_attempts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quiz attempts"
  ON public.user_quiz_attempts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ──────────────────────────────────────────────
-- posts: tighten from public read to authenticated only
-- (posts.user_id references profiles.id = auth.uid())
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

CREATE POLICY "Authenticated users can read posts"
  ON public.posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (user_id = auth.uid());

-- ──────────────────────────────────────────────
-- comments: tighten from public read to authenticated only
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Authenticated users can read comments"
  ON public.comments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (user_id = auth.uid());

-- ──────────────────────────────────────────────
-- post_likes: tighten from public read to authenticated only
-- ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.post_likes;
DROP POLICY IF EXISTS "Authenticated users can toggle likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can remove own likes" ON public.post_likes;

CREATE POLICY "Authenticated users can read post likes"
  ON public.post_likes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can toggle likes"
  ON public.post_likes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove own likes"
  ON public.post_likes FOR DELETE
  USING (user_id = auth.uid());
