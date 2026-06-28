-- Create petty_cash table in Supabase
CREATE TABLE IF NOT EXISTS public.petty_cash (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default now() not null,
  type text not null, -- 'in' or 'out'
  amount numeric not null,
  description text not null,
  by_whom text,
  date date not null,
  note text
);

-- Disable Row Level Security (RLS) so that the anonymous client can read/write directly
ALTER TABLE public.petty_cash DISABLE ROW LEVEL SECURITY;
