-- Create the table for storing diaries
create table public.diaries (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  image_url text null,
  weather text not null,
  emotion text not null,
  summary text not null,
  keywords text[] null,
  score integer null,
  constraint diaries_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.diaries enable row level security;

-- Policies for security

-- 1. Insert: Only authenticated users can insert their own diaries
create policy "Users can insert own diaries"
on public.diaries
for insert
with check (auth.uid() = user_id);

-- 2. Select (Read):
--    Allow public access for sharing (so anyone with the link/ID can read)
--    OR strict: (auth.uid() = user_id).
--    Based on the "Share" feature, we likely want "Anyone can view".
--    However, if we want to be secure, maybe "Anyone can select" is okay provided IDs are UUIDs (hard to guess).
create policy "Anyone can view diaries"
on public.diaries
for select
using (true);

-- 3. Update: Only owner can update
create policy "Users can update own diaries"
on public.diaries
for update
using (auth.uid() = user_id);

-- 4. Delete: Only owner can delete
create policy "Users can delete own diaries"
on public.diaries
for delete
using (auth.uid() = user_id);
