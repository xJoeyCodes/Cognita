-- Add quiz_sessions_count column to user_stats table
ALTER TABLE public.user_stats 
ADD COLUMN IF NOT EXISTS quiz_sessions_count INTEGER NOT NULL DEFAULT 0;

-- Update existing records to have 0 quiz sessions
UPDATE public.user_stats 
SET quiz_sessions_count = 0 
WHERE quiz_sessions_count IS NULL;
