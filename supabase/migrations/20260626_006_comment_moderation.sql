-- Migration: Comment moderation and reporting
-- Run in Supabase SQL Editor before deploying frontend changes.

-- 1. Extend comments table
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- 2. Create comment_reports table
CREATE TABLE IF NOT EXISTS public.comment_reports (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id       uuid REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason           text NOT NULL CHECK (reason IN ('spam','abuse','off_topic','misinformation','other')),
  details          text,
  status           text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','reviewed','dismissed')),
  created_at       timestamptz DEFAULT now() NOT NULL,
  reviewed_at      timestamptz,
  reviewed_by      uuid REFERENCES public.profiles(id)
);

-- One report per user per comment
ALTER TABLE public.comment_reports
  ADD CONSTRAINT comment_reports_unique_reporter
  UNIQUE (comment_id, reporter_user_id);

ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;

-- 3. RLS: comment_reports
CREATE POLICY "Authenticated users can report"
  ON public.comment_reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_user_id = auth.uid());

CREATE POLICY "Admins can read reports"
  ON public.comment_reports FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update reports"
  ON public.comment_reports FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can delete reports"
  ON public.comment_reports FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 4. Update comments RLS

-- Replace the blanket "authenticated can read" policy with one that hides hidden comments
-- (admins bypass this and see everything including hidden)
DROP POLICY IF EXISTS "Authenticated users can read comments" ON public.comments;

CREATE POLICY "Users can read visible comments"
  ON public.comments FOR SELECT
  USING (
    auth.role() = 'authenticated' AND (
      is_hidden = false
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- Users can edit their own comment text
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can hide/unhide any comment
CREATE POLICY "Admins can update any comment"
  ON public.comments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Admins can hard-delete any comment
CREATE POLICY "Admins can delete any comment"
  ON public.comments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 5. Auto-hide trigger: if a comment gets 3+ distinct reports, hide it pending review
CREATE OR REPLACE FUNCTION public.auto_hide_reported_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(DISTINCT reporter_user_id)
    FROM public.comment_reports
    WHERE comment_id = NEW.comment_id AND status = 'pending'
  ) >= 3 THEN
    UPDATE public.comments SET is_hidden = true WHERE id = NEW.comment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_reported ON public.comment_reports;
CREATE TRIGGER on_comment_reported
  AFTER INSERT ON public.comment_reports
  FOR EACH ROW EXECUTE FUNCTION public.auto_hide_reported_comment();
