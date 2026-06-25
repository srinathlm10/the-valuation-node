-- Migration: Create profile row automatically on signup
-- Week 1 Step 17.5
-- PREREQUISITE: Run 20260625_004_role_column.sql first
--
-- profiles.id IS auth.uid() — insert NEW.id directly into id column.

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
