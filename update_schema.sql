-- 1. Check if table exists (optional, or just alter)
-- We will assume starting fresh or altering. Here is a safe migration script.

-- Add user_id column if it doesn't exist
do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'diaries' and column_name = 'user_id') then
        alter table public.diaries add column user_id uuid references auth.users(id) on delete cascade;
    end if;
end $$;

-- Enable RLS
alter table public.diaries enable row level security;

-- Drop insecure policies if they exist
drop policy if exists "Anyone can view diaries" on public.diaries;
drop policy if exists "Anyone can insert diaries" on public.diaries;

-- Create secure policies
-- View: Only owner can view their own diaries
create policy "Users can view own diaries"
on public.diaries
for select
using (auth.uid() = user_id);

-- Insert: Users can insert their own diaries
create policy "Users can insert own diaries"
on public.diaries
for insert
with check (auth.uid() = user_id);

-- Update: Only owner can update
create policy "Users can update own diaries"
on public.diaries
for update
using (auth.uid() = user_id);

-- Delete: Only owner can delete
create policy "Users can delete own diaries"
on public.diaries
for delete
using (auth.uid() = user_id);
