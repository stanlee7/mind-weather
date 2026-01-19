-- Option 1: If you want to RESET everything (Delete old data)
-- DROP TABLE IF EXISTS public.diaries;

-- Option 2: Update existing table (Safe)
-- Run this if the table already exists but might be missing columns

DO $$
BEGIN
    -- Add 'weather' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diaries' AND column_name = 'weather') THEN
        ALTER TABLE public.diaries ADD COLUMN weather text NOT NULL DEFAULT 'sunny';
    END IF;

    -- Add 'emotion' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diaries' AND column_name = 'emotion') THEN
        ALTER TABLE public.diaries ADD COLUMN emotion text NOT NULL DEFAULT 'Normal';
    END IF;

    -- Add 'summary' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diaries' AND column_name = 'summary') THEN
        ALTER TABLE public.diaries ADD COLUMN summary text NOT NULL DEFAULT '';
    END IF;

    -- Add 'keywords' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diaries' AND column_name = 'keywords') THEN
        ALTER TABLE public.diaries ADD COLUMN keywords text[] NULL;
    END IF;

    -- Add 'score' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diaries' AND column_name = 'score') THEN
        ALTER TABLE public.diaries ADD COLUMN score integer NULL;
    END IF;
    
    -- Add 'content' column if missing
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diaries' AND column_name = 'content') THEN
        ALTER TABLE public.diaries ADD COLUMN content text NOT NULL DEFAULT '';
    END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;

-- Re-create policies (Drop first to avoid errors)
DROP POLICY IF EXISTS "Anyone can view diaries" ON public.diaries;
CREATE POLICY "Anyone can view diaries" ON public.diaries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert diaries" ON public.diaries;
CREATE POLICY "Anyone can insert diaries" ON public.diaries FOR INSERT WITH CHECK (true);
