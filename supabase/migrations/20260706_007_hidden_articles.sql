-- Article visibility: holds the slugs of Research articles that are currently
-- hidden from the public. Article CONTENT lives in Git as Markdown; only the
-- hide/unhide flag lives here so an admin can toggle it instantly, from any
-- device, with no redeploy. Presence of a row = the article is hidden.

CREATE TABLE IF NOT EXISTS public.hidden_articles (
  slug       text PRIMARY KEY,
  hidden_at  timestamptz NOT NULL DEFAULT now(),
  hidden_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.hidden_articles ENABLE ROW LEVEL SECURITY;

-- Anyone may read the hidden list. It only reveals which slugs are hidden, and
-- the site needs it to render a "temporarily unavailable" state for visitors.
CREATE POLICY "Public can read hidden list"
  ON public.hidden_articles
  FOR SELECT
  USING (true);

-- Only admins can hide an article.
CREATE POLICY "Admins can hide"
  ON public.hidden_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can unhide an article.
CREATE POLICY "Admins can unhide"
  ON public.hidden_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
