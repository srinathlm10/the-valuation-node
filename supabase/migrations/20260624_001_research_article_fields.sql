-- Migration: Add research-specific fields to articles table
-- Week 1 Step 4 — present to Srinath for review before applying

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS methodology_summary text,
  ADD COLUMN IF NOT EXISTS model_download_url   text,
  ADD COLUMN IF NOT EXISTS github_url           text,
  ADD COLUMN IF NOT EXISTS where_i_might_be_wrong text,
  ADD COLUMN IF NOT EXISTS citation_format      text,
  ADD COLUMN IF NOT EXISTS update_log           jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_research          boolean DEFAULT false;

-- Auto-generate a basic citation_format on insert/update when null
-- (actual override can be done from the admin)
CREATE OR REPLACE FUNCTION public.generate_citation_format()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.citation_format IS NULL AND NEW.title IS NOT NULL AND NEW.published_at IS NOT NULL THEN
    NEW.citation_format := format(
      'Gajji, S. (%s). "%s." The Valuation Node. https://thevaluationnode.com/research/%s',
      EXTRACT(YEAR FROM NEW.published_at)::text,
      NEW.title,
      NEW.slug
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_citation_format ON public.articles;
CREATE TRIGGER set_citation_format
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.generate_citation_format();
