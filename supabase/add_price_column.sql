-- Run this in Supabase SQL Editor to add pricing to projects
alter table public.projects
  add column if not exists price_amount integer, -- in öre (1 SEK = 100 öre)
  add column if not exists price_description text;
