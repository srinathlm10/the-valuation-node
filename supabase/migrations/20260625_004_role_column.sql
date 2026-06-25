-- Migration: Add role column to profiles
-- Week 1 Step 17.3 prerequisite — run BEFORE 002 and 003

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));
