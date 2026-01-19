-- Create the table for storing diaries
create table public.diaries (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  content text not null,
  weather text not null,
  emotion text not null,
  summary text not null,
  keywords text[] null,
  score integer null,
  constraint diaries_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.diaries enable row level security;

-- Create policy to allow anyone to read diaries (for sharing)
create policy "Anyone can view diaries"
on public.diaries
for select
using (true);

-- Create policy to allow inserting diaries (from the app)
-- Note: In a real app with auth, you'd restrict this to authenticated users.
-- For this demo, we allow anon inserts or rely on Service Role key if we used it, 
-- but simpler to allow anon inserts for the demo app without auth yet.
create policy "Anyone can insert diaries"
on public.diaries
for insert
with check (true);
