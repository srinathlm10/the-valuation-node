-- Fix: infinite recursion in "Admins can read all profiles" RLS policy.
-- The original policy queried the profiles table from within a profiles policy,
-- causing Postgres to recursively evaluate RLS infinitely.
-- Solution: SECURITY DEFINER function reads profiles as DB owner, bypassing RLS.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.current_user_role() = 'admin');
