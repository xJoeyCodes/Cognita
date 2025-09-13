ALTER TABLE public.flashcards 
ADD COLUMN IF NOT EXISTS pdf_name TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium';

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pdf_name TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct INTEGER NOT NULL CHECK (correct >= 0 AND correct <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quizzes" ON public.quizzes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes" ON public.quizzes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes" ON public.quizzes
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quizzes_updated_at 
  BEFORE UPDATE ON public.quizzes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_pdf_name ON public.quizzes(pdf_name);
CREATE INDEX IF NOT EXISTS idx_flashcards_pdf_name ON public.flashcards(pdf_name);
CREATE INDEX IF NOT EXISTS idx_flashcards_difficulty ON public.flashcards(difficulty);

