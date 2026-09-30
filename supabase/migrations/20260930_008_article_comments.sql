-- Migration: comments on research/analysis articles.
--
-- This is a separate table from the community forum's `comments`
-- (20260625_005/20260626_006): different context (an article, not a forum
-- post), different moderation shape, and it supports anonymous posting,
-- which the community table currently does not (community reads and writes
-- both require `auth.role() = 'authenticated'`; there is no guest path
-- there). This table does not extend or depend on that schema.
--
-- Anonymous comments: user_id is null, author_label is 'Guest'. Logged-in
-- comments: user_id is the author, author_label is null (the display name is
-- resolved from public.profiles.display_name at read time).

CREATE TABLE IF NOT EXISTS public.article_comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug text NOT NULL,
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_label text,
  body         text NOT NULL,
  is_hidden    boolean NOT NULL DEFAULT false,
  report_count integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Fetching visible comments for one article, oldest first.
CREATE INDEX IF NOT EXISTS article_comments_slug_visible_idx
  ON public.article_comments (article_slug, is_hidden, created_at);

-- The admin moderation queue (newest first, hidden and visible both).
CREATE INDEX IF NOT EXISTS article_comments_moderation_idx
  ON public.article_comments (is_hidden, created_at);

ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Anyone, including anonymous visitors, can read visible comments.
CREATE POLICY "Anyone can read visible article comments"
  ON public.article_comments FOR SELECT
  USING (is_hidden = false);

-- Admins can read hidden ones too, for moderation.
CREATE POLICY "Admins can read all article comments"
  ON public.article_comments FOR SELECT
  USING (public.current_user_role() = 'admin');

-- Anyone can post. The app sets user_id = null (and author_label = 'Guest')
-- for anonymous comments, or the caller's own uid when logged in; this check
-- only blocks posting a comment AS a different real user.
CREATE POLICY "Anyone can post an article comment"
  ON public.article_comments FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Only the author can edit or delete their own comment. Anonymous comments
-- (user_id is null) have no author to match, so this policy never grants
-- edit/delete on them; only an admin can remove those (below).
CREATE POLICY "Authors can update their own article comment"
  ON public.article_comments FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authors can delete their own article comment"
  ON public.article_comments FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admins can hide/restore or hard-delete any comment, including anonymous ones.
CREATE POLICY "Admins can update any article comment"
  ON public.article_comments FOR UPDATE
  USING (public.current_user_role() = 'admin');

CREATE POLICY "Admins can delete any article comment"
  ON public.article_comments FOR DELETE
  USING (public.current_user_role() = 'admin');

-- Auto-hide once a comment crosses 3 reports. Fires on the report_count
-- UPDATE below, mirroring auto_hide_reported_comment in
-- 20260626_006_comment_moderation.sql (same threshold, same shape).
CREATE OR REPLACE FUNCTION public.auto_hide_reported_article_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.report_count >= 3 AND NEW.is_hidden = false THEN
    UPDATE public.article_comments SET is_hidden = true WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_article_comment_report_count_changed ON public.article_comments;
CREATE TRIGGER on_article_comment_report_count_changed
  AFTER UPDATE OF report_count ON public.article_comments
  FOR EACH ROW EXECUTE FUNCTION public.auto_hide_reported_article_comment();

-- Reports. Deliberately no `status` column (unlike the community
-- comment_reports table): a report row IS the pending state, and
-- "resolving" it means the admin deletes the row (see
-- articleCommentService.dismissReport / hideAndResolveReports). Simpler
-- schema, same practical effect for a single admin's moderation queue.
CREATE TABLE IF NOT EXISTS public.article_comment_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  uuid REFERENCES public.article_comments(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid REFERENCES auth.users(id) NOT NULL,
  reason      text NOT NULL CHECK (reason IN ('spam','harassment','off_topic','misinformation','other')),
  details     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, reporter_id)
);

ALTER TABLE public.article_comment_reports ENABLE ROW LEVEL SECURITY;

-- Reporting requires login (the report button is hidden for guests in the UI;
-- this is the server-side backstop for that rule).
CREATE POLICY "Authenticated users can report an article comment"
  ON public.article_comment_reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can read article comment reports"
  ON public.article_comment_reports FOR SELECT
  USING (public.current_user_role() = 'admin');

CREATE POLICY "Admins can delete article comment reports"
  ON public.article_comment_reports FOR DELETE
  USING (public.current_user_role() = 'admin');

-- Every new report increments report_count on its comment; that UPDATE is
-- what fires the auto-hide trigger above.
CREATE OR REPLACE FUNCTION public.increment_article_comment_report_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.article_comments
  SET report_count = report_count + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_article_comment_reported ON public.article_comment_reports;
CREATE TRIGGER on_article_comment_reported
  AFTER INSERT ON public.article_comment_reports
  FOR EACH ROW EXECUTE FUNCTION public.increment_article_comment_report_count();
