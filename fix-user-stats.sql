
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_flashcards INTEGER NOT NULL DEFAULT 0,
  studied_today INTEGER NOT NULL DEFAULT 0,
  average_score FLOAT NOT NULL DEFAULT 0.0,
  study_streak INTEGER NOT NULL DEFAULT 0,
  last_streak_date DATE,
  daily_goal INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can create their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can delete their own stats" ON public.user_stats;

CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stats" 
ON public.user_stats 
FOR DELETE 
USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_total_flashcards(user_uuid UUID, increment_amount INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_stats 
  SET total_flashcards = total_flashcards + increment_amount,
      updated_at = now()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_studied_today(user_uuid UUID, increment_amount INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_stats 
  SET studied_today = studied_today + increment_amount,
      updated_at = now()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_study_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  last_streak_date DATE;
  current_streak INTEGER;
  days_diff INTEGER;
BEGIN
  SELECT study_streak, last_streak_date 
  INTO current_streak, last_streak_date
  FROM public.user_stats 
  WHERE user_id = user_uuid;

  IF current_streak IS NULL THEN
    INSERT INTO public.user_stats (user_id, study_streak, last_streak_date)
    VALUES (user_uuid, 1, current_date)
    ON CONFLICT (user_id) DO UPDATE SET
      study_streak = 1,
      last_streak_date = current_date,
      updated_at = now();
    RETURN;
  END IF;

  IF last_streak_date IS NULL THEN
    days_diff := 999; -- Treat as very old date
  ELSE
    days_diff := current_date - last_streak_date;
  END IF;

  IF days_diff = 0 THEN
    RETURN;
  ELSIF days_diff = 1 THEN
    UPDATE public.user_stats 
    SET study_streak = current_streak + 1,
        last_streak_date = current_date,
        updated_at = now()
    WHERE user_id = user_uuid;
  ELSE
    UPDATE public.user_stats 
    SET study_streak = 1, 
        last_streak_date = current_date,
        updated_at = now()
    WHERE user_id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

INSERT INTO public.user_stats (user_id, total_flashcards, studied_today, average_score, study_streak, daily_goal)
SELECT 
  au.id as user_id,
  COALESCE(COUNT(f.id), 0) as total_flashcards,
  0 as studied_today,
  0.0 as average_score,
  0 as study_streak,
  10 as daily_goal
FROM auth.users au
LEFT JOIN public.flashcards f ON f.user_id = au.id
LEFT JOIN public.user_stats us ON us.user_id = au.id
WHERE us.user_id IS NULL
GROUP BY au.id
ON CONFLICT (user_id) DO NOTHING;
