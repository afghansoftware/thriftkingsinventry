-- ============================================================
-- PETTY CASH TABLE — Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → paste all → RUN
-- ============================================================

-- Step 1: Drop the old table completely (removes old columns too)
DROP TABLE IF EXISTS public.petty_cash;

-- Step 2: Recreate with correct column names
CREATE TABLE public.petty_cash (
  id          bigint primary key generated always as identity,
  created_at  timestamp with time zone default now() not null,
  type        text not null,       -- 'in' or 'out'
  amount      numeric not null,
  description text,
  by_whom     text,
  date        date not null,
  note        text
);

-- Step 3: Disable Row Level Security so anonymous key can read/write
ALTER TABLE public.petty_cash DISABLE ROW LEVEL SECURITY;

-- Step 4: Grant full access to the anon and service_role
GRANT ALL ON public.petty_cash TO anon;
GRANT ALL ON public.petty_cash TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
