-- Create user_stats table
CREATE TABLE public.user_stats (
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

-- Enable RLS on user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_stats
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

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize user stats on first sign-in
CREATE OR REPLACE FUNCTION public.initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, total_flashcards, studied_today, average_score, study_streak, daily_goal)
  VALUES (NEW.id, 0, 0, 0.0, 0, 10)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize stats when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_stats();

-- Create function to update study streak
CREATE OR REPLACE FUNCTION public.update_study_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  last_streak_date DATE;
  current_streak INTEGER;
BEGIN
  -- Get current streak info
  SELECT study_streak, last_streak_date 
  INTO current_streak, last_streak_date
  FROM public.user_stats 
  WHERE user_id = user_uuid;

  -- If no stats exist, create them
  IF current_streak IS NULL THEN
    INSERT INTO public.user_stats (user_id, study_streak, last_streak_date)
    VALUES (user_uuid, 1, current_date)
    ON CONFLICT (user_id) DO UPDATE SET
      study_streak = 1,
      last_streak_date = current_date,
      updated_at = now();
    RETURN;
  END IF;

  -- Check if streak should continue or reset
  IF last_streak_date IS NULL OR last_streak_date < current_date - INTERVAL '1 day' THEN
    -- Reset streak if more than 1 day has passed
    UPDATE public.user_stats 
    SET study_streak = 1, 
        last_streak_date = current_date,
        updated_at = now()
    WHERE user_id = user_uuid;
  ELSIF last_streak_date = current_date THEN
    -- Already studied today, no change needed
    RETURN;
  ELSIF last_streak_date = current_date - INTERVAL '1 day' THEN
    -- Continue streak
    UPDATE public.user_stats 
    SET study_streak = current_streak + 1,
        last_streak_date = current_date,
        updated_at = now()
    WHERE user_id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset daily study count
CREATE OR REPLACE FUNCTION public.reset_daily_study_count()
RETURNS VOID AS $$
BEGIN
  -- Reset studied_today for all users where last_streak_date is not today
  UPDATE public.user_stats 
  SET studied_today = 0,
      updated_at = now()
  WHERE last_streak_date IS NULL OR last_streak_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment total flashcards
CREATE OR REPLACE FUNCTION public.increment_total_flashcards(user_uuid UUID, increment_amount INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_stats 
  SET total_flashcards = total_flashcards + increment_amount,
      updated_at = now()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment studied today
CREATE OR REPLACE FUNCTION public.increment_studied_today(user_uuid UUID, increment_amount INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_stats 
  SET studied_today = studied_today + increment_amount,
      updated_at = now()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
